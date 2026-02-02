import { useState } from 'react';
import { Trophy, Home, RotateCcw, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { GameState, GameLevel, GameScreen } from '../types/game';

interface ResultScreenProps {
  gameState: GameState;
  level: GameLevel;
  playTime: number;
  onNavigate: (screen: GameScreen) => void;
  onRestart: () => void;
}

export function ResultScreen({ gameState, level, playTime, onNavigate, onRestart }: ResultScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const accuracy = gameState.totalCount > 0
    ? Math.round((gameState.correctCount / gameState.totalCount) * 100)
    : 0;

  const handleSaveScore = async () => {
    if (!playerName.trim() || isSaving || isSaved) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('scores').insert({
        player_name: playerName.trim(),
        score: gameState.score,
        correct_count: gameState.correctCount,
        total_count: gameState.totalCount,
        level: level,
        play_time: playTime,
      });

      if (error) throw error;
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving score:', error);
      alert('スコアの保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-2">ゲーム終了！</h2>
            <p className="text-gray-600">お疲れ様でした</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
                {gameState.score}
              </div>
              <div className="text-sm text-gray-600">スコア</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">正答率</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {gameState.correctCount}
              </div>
              <div className="text-sm text-gray-600">正解数</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {gameState.totalCount}
              </div>
              <div className="text-sm text-gray-600">回答数</div>
            </div>
          </div>

          {!isSaved && (
            <div className="mb-6 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Save className="w-5 h-5" />
                スコアを保存
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="プレイヤー名を入力..."
                  maxLength={20}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                />
                <button
                  onClick={handleSaveScore}
                  disabled={!playerName.trim() || isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          )}

          {isSaved && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
              <p className="text-green-700 font-semibold">✓ スコアを保存しました！</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">ホーム</span>
            </button>
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="hidden sm:inline">もう一度</span>
            </button>
            <button
              onClick={() => onNavigate('ranking')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition-all"
            >
              <Trophy className="w-5 h-5" />
              <span className="hidden sm:inline">ランキング</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
