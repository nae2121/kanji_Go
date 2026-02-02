export interface KanjiQuestion {
  id: string;
  kanji: string;
  yomi: string;
  level: number;
  meaning: string;
}

export interface GameState {
  questions: KanjiQuestion[];
  currentIndex: number;
  score: number;
  correctCount: number;
  totalCount: number;
  timeRemaining: number;
  isPlaying: boolean;
  isFinished: boolean;
  userAnswer: string;
  showFeedback: boolean;
  isCorrect: boolean;
}

export interface Score {
  id: string;
  player_name: string;
  score: number;
  correct_count: number;
  total_count: number;
  level: number;
  play_time: number;
  created_at: string;
}

export type GameScreen = 'home' | 'game' | 'result' | 'ranking';
export type GameLevel = 1 | 2 | 3;
