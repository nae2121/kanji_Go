import { Gamepad2, Trophy, BookOpen } from 'lucide-react';
import type { GameLevel, GameScreen } from '../types/game';

interface HomeScreenProps {
  onStartGame: (level: GameLevel) => void;
  onNavigate: (screen: GameScreen) => void;
}

export function HomeScreen({ onStartGame, onNavigate }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block bg-white rounded-2xl shadow-lg p-6 mb-6 transform hover:scale-105 transition-transform">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              漢字でゴー
            </h1>
            <p className="text-sm text-gray-600 mt-2">Kanji de Go</p>
          </div>
          <p className="text-gray-700 text-lg">
            漢字の読みを入力して、スコアを競おう！
          </p>
        </div>

        <div className="grid gap-4 mb-6">
          <LevelCard
            level={1}
            title="初級"
            subtitle="小学校レベル"
            color="from-green-500 to-emerald-500"
            icon={<BookOpen className="w-8 h-8" />}
            onClick={() => onStartGame(1)}
          />
          <LevelCard
            level={2}
            title="中級"
            subtitle="中学校レベル"
            color="from-blue-500 to-cyan-500"
            icon={<BookOpen className="w-8 h-8" />}
            onClick={() => onStartGame(2)}
          />
          <LevelCard
            level={3}
            title="上級"
            subtitle="常用漢字"
            color="from-red-500 to-orange-500"
            icon={<BookOpen className="w-8 h-8" />}
            onClick={() => onStartGame(3)}
          />
        </div>

        <button
          onClick={() => onNavigate('ranking')}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border-2 border-gray-200"
        >
          <Trophy className="w-5 h-5 text-yellow-500" />
          ランキングを見る
        </button>
      </div>
    </div>
  );
}

interface LevelCardProps {
  level: number;
  title: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function LevelCard({ title, subtitle, color, icon, onClick }: LevelCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white hover:shadow-xl transition-all rounded-xl p-6 border-2 border-gray-100 hover:border-gray-200 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
      <div className="relative flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color} text-white`}>
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <Gamepad2 className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </button>
  );
}
