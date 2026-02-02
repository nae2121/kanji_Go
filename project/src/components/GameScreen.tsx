import { useEffect, useRef } from 'react';
import { Clock, Zap, CheckCircle2, XCircle } from 'lucide-react';
import type { GameState } from '../types/game';
import { AirInputOverlay } from './AirInputOverlay';

interface GameScreenProps {
  gameState: GameState;
  combo: number;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
}

export function GameScreen({
  gameState,
  combo,
  onAnswerChange,
  onSubmit,
}: GameScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentQuestion = gameState.questions[gameState.currentIndex];

  useEffect(() => {
    if (!gameState.showFeedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.currentIndex, gameState.showFeedback]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>問題を読み込んでいます...</p>
      </div>
    );
  }

  return (
    <>
      {/* ===== 空中手書き入力（寿司打と直結） ===== */}
      <AirInputOverlay
        onCharCommit={(char) => {
          onAnswerChange(char); // 1文字入力
        }}
        onSubmitGesture={() => {
          if (!gameState.showFeedback && gameState.userAnswer.trim()) {
            onSubmit(); // 縦振りで確定
          }
        }}
      />

      {/* ===== 既存UI ===== */}
      <div className="relative z-0 min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">

            {/* 上部UI */}
            <div className="flex justify-between mb-8">
              <div className="flex gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-lg text-blue-600">
                    {gameState.timeRemaining}s
                  </span>
                </div>

                {combo > 0 && (
                  <div className="bg-orange-50 px-4 py-2 rounded-lg flex items-center gap-2 animate-bounce">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <span className="font-bold text-orange-600">
                      {combo} コンボ
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600">スコア</div>
                <div className="text-3xl font-bold text-orange-600">
                  {gameState.score}
                </div>
              </div>
            </div>

            {/* 問題 */}
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4">
                この漢字の読みをひらがなで入力してください
              </p>
              <div className="text-9xl font-bold">{currentQuestion.kanji}</div>
            </div>

            {/* 入力欄（カメラと同期） */}
            <input
              ref={inputRef}
              value={gameState.userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              disabled
              className="w-full text-3xl text-center py-4 border rounded-xl bg-gray-100"
            />

            {!gameState.showFeedback && (
              <button
                onClick={onSubmit}
                className="w-full mt-6 bg-orange-500 text-white py-4 rounded-xl"
              >
                答える
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
