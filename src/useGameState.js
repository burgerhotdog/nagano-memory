import { useState, useEffect } from 'react';
import { GRID_SIZE, ANIMATION_DURATION } from './constants';
import { getHighScore, saveHighScore } from './highScore';

export const useGameState = () => {
  const [gameState, setGameState] = useState('ready');
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [activeCell, setActiveCell] = useState(null);
  const [highScore, setHighScore] = useState(getHighScore());
  const [clickedCells, setClickedCells] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateSequence = () => {
    const nextIndex = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
    return [...sequence, nextIndex];
  };

  const startRound = () => {
    setSequence(generateSequence());
    setPlayerSequence([]);
    setGameState('show');
  };

  // Show sequence to player
  useEffect(() => {
    if (gameState === 'show' && sequence.length > 0) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < sequence.length) {
          setActiveCell(sequence[index]);
          setTimeout(() => setActiveCell(null), 500);
          index++;
        } else {
          clearInterval(timer);
          setGameState('copy');
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, sequence]);

  const handleCellClick = (cellIndex) => {
    if (gameState === 'copy' && !isAnimating) {
      setIsAnimating(true);
      const newPlayerSequence = [...playerSequence, cellIndex];
      setPlayerSequence(newPlayerSequence);
      setClickedCells([...clickedCells, cellIndex]);

      const isCorrect = cellIndex === sequence[playerSequence.length];

      setTimeout(() => {
        setClickedCells(clickedCells.filter(cell => cell !== cellIndex));
        setIsAnimating(false);

        if (!isCorrect) {
          const newHighScore = round > highScore ? round : highScore;
          setHighScore(newHighScore);
          saveHighScore(newHighScore);
          setGameState('results');
        } else if (newPlayerSequence.length === sequence.length) {
          setTimeout(() => {
            setRound(round + 1);
            setGameState('ready');
          }, ANIMATION_DURATION);
        }
      }, ANIMATION_DURATION);
    }
  };

  const resetGame = () => {
    setRound(1);
    setSequence([]);
    setGameState('ready');
  };

  return {
    gameState,
    round,
    sequence,
    playerSequence,
    activeCell,
    highScore,
    clickedCells,
    isAnimating,
    startRound,
    handleCellClick,
    resetGame
  };
};
