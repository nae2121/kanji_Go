import { useState, useEffect } from 'react';
import { Trophy, Home, Medal, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Score, GameScreen } from '../types/game';

interface RankingScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

export function RankingScreen({ onNavigate }: RankingScreenProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  useEffect(() => {
    loadRankings();
  }, [selectedLevel]);

  const loadRankings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('level', selectedLevel)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error loading rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-gray-600 font-bold">{rank}</span>;
    }
  };

  const getLevelName = (level: number) => {
    switch (level) {
      case 1: return '初級';
      case 2: return '中級';
      case 3: return '上級';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-800 mb-2">ランキング</h2>
          <p className="text-gray-600">トップ10プレイヤー</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedLevel === level
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              {getLevelName(level)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              読み込み中...
            </div>
          ) : scores.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              まだスコアが登録されていません
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 text-lg truncate">
                        {score.player_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        正解: {score.correct_count}/{score.total_count} ({Math.round((score.correct_count / score.total_count) * 100)}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        {score.score}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(score.created_at).toLocaleDateString('ja-JP')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-300 transition-all shadow-md"
        >
          <Home className="w-5 h-5" />
          ホームに戻る
        </button>
      </div>
    </div>
  );
}
