import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { RankingScreen } from './components/RankingScreen';
import { useGameState } from './hooks/useGameState';
import type { GameScreen as GameScreenType, GameLevel } from './types/game';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreenType>('home');
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>(1);
  const [startTime, setStartTime] = useState(0);

  const { gameState, combo, loadQuestions, startGame, submitAnswer, setUserAnswer } = useGameState(selectedLevel);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleStartGame = (level: GameLevel) => {
    setSelectedLevel(level);
    setCurrentScreen('game');
    setStartTime(Date.now());
    setTimeout(() => {
      startGame();
    }, 100);
  };

  const handleRestart = () => {
    setStartTime(Date.now());
    startGame();
    setCurrentScreen('game');
  };

  useEffect(() => {
    if (gameState.isFinished) {
      setCurrentScreen('result');
    }
  }, [gameState.isFinished]);

  const playTime = gameState.isFinished ? Math.floor((Date.now() - startTime) / 1000) : 0;

  return (
    <>
      {currentScreen === 'home' && (
        <HomeScreen onStartGame={handleStartGame} onNavigate={setCurrentScreen} />
      )}
      {currentScreen === 'game' && gameState.isPlaying && (
        <GameScreen
          gameState={gameState}
          combo={combo}
          onAnswerChange={setUserAnswer}
          onSubmit={submitAnswer}
        />
      )}
      {currentScreen === 'result' && (
        <ResultScreen
          gameState={gameState}
          level={selectedLevel}
          playTime={playTime}
          onNavigate={setCurrentScreen}
          onRestart={handleRestart}
        />
      )}
      {currentScreen === 'ranking' && (
        <RankingScreen onNavigate={setCurrentScreen} />
      )}
    </>
  );
}

export default App;
