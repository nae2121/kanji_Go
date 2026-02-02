import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GameState, KanjiQuestion, GameLevel } from '../types/game';

/* ===== 仮問題データ（Supabase未使用時のフォールバック） ===== */
const MOCK_QUESTIONS: KanjiQuestion[] = [
  { id: '1', kanji: '日', yomi: 'ひ', level: 1, meaning: 'day' },
  { id: '2', kanji: '山', yomi: 'やま', level: 1, meaning: 'mountain' },
  { id: '3', kanji: '川', yomi: 'かわ', level: 1, meaning: 'river' },
  { id: '4', kanji: '人', yomi: 'ひと', level: 1, meaning: 'person' },
  { id: '5', kanji: '木', yomi: 'き', level: 1, meaning: 'tree' },
];

const INITIAL_TIME = 150;
const POINTS_PER_CORRECT = 100;
const COMBO_BONUS = 50;

export function useGameState(level: GameLevel) {
  const [gameState, setGameState] = useState<GameState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    totalCount: 0,
    timeRemaining: INITIAL_TIME,
    isPlaying: false,
    isFinished: false,
    userAnswer: '',
    showFeedback: false,
    isCorrect: false,
  });

  const [combo, setCombo] = useState(0);

  /* ===== タイマー処理 ===== */
  useEffect(() => {
    if (!gameState.isPlaying || gameState.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          return { ...prev, timeRemaining: 0, isPlaying: false, isFinished: true };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeRemaining]);

  /* ===== 問題ロード（Supabase → 無ければモック） ===== */
  const loadQuestions = useCallback(async () => {
    // 一旦空にして「読み込み中」状態を抜けさせる
    setGameState((prev) => ({ ...prev, questions: [] }));

    // Supabaseが使える場合
    if (supabase) {
      const { data, error } = await supabase
        .from('kanji_questions')
        .select('*')
        .eq('level', level)
        .limit(50);

      if (!error && data && data.length > 0) {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setGameState((prev) => ({
          ...prev,
          questions: shuffled as KanjiQuestion[],
        }));
        return;
      }
    }

    // フォールバック（必ず問題が出る）
    const fallback = MOCK_QUESTIONS.filter((q) => q.level === level);
    setGameState((prev) => ({
      ...prev,
      questions: fallback,
    }));
  }, [level]);

  /* ===== ゲーム開始 ===== */
  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentIndex: 0,
      score: 0,
      correctCount: 0,
      totalCount: 0,
      timeRemaining: INITIAL_TIME,
      isPlaying: true,
      isFinished: false,
      userAnswer: '',
      showFeedback: false,
      isCorrect: false,
    }));
    setCombo(0);
  }, []);

  /* ===== 回答確定 ===== */
  const submitAnswer = useCallback(() => {
    const currentQuestion = gameState.questions[gameState.currentIndex];
    if (!currentQuestion) return;

    const normalizedAnswer = gameState.userAnswer.trim();
    const normalizedCorrect = currentQuestion.yomi.trim();
    const isCorrect = normalizedAnswer === normalizedCorrect;

    setGameState((prev) => {
      const newCorrectCount = isCorrect ? prev.correctCount + 1 : prev.correctCount;
      const comboBonus = isCorrect ? combo * COMBO_BONUS : 0;
      const newScore = isCorrect
        ? prev.score + POINTS_PER_CORRECT + comboBonus
        : prev.score;

      return {
        ...prev,
        isCorrect,
        showFeedback: true,
        correctCount: newCorrectCount,
        totalCount: prev.totalCount + 1,
        score: newScore,
      };
    });

    setCombo(isCorrect ? combo + 1 : 0);

    setTimeout(() => {
      setGameState((prev) => {
        const nextIndex = prev.currentIndex + 1;
        if (nextIndex >= prev.questions.length) {
          return {
            ...prev,
            isPlaying: false,
            isFinished: true,
            showFeedback: false,
          };
        }
        return {
          ...prev,
          currentIndex: nextIndex,
          userAnswer: '',
          showFeedback: false,
        };
      });
    }, 1200);
  }, [gameState, combo]);

  /* ===== 入力更新 ===== */
  const setUserAnswer = useCallback((answer: string) => {
    setGameState((prev) => ({ ...prev, userAnswer: answer }));
  }, []);

  return {
    gameState,
    combo,
    loadQuestions,
    startGame,
    submitAnswer,
    setUserAnswer,
  };
}
