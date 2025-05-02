import React, { useState, useEffect } from 'react';
import { Stack, Grid, Card, CardActionArea, Button, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayArrow, Replay } from "@mui/icons-material";
import MOLE_IMAGE from './assets/mole.webp';

const GRID_SIZE = 3;
const ANIMATION_DURATION = 300; // Duration in milliseconds

const App = () => {
  const [gameState, setGameState] = useState('ready');
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [activeCell, setActiveCell] = useState(null);
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') || 0);
  const [clickedCells, setClickedCells] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate random sequence for the mole to appear
  const generateSequence = () => {
    const nextIndex = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
    return [...sequence, nextIndex];
  };

  // Start new round
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

  // Handle player input
  const handleCellClick = (cellIndex) => {
    if (gameState === 'copy' && !isAnimating) {
      setIsAnimating(true);
      const newPlayerSequence = [...playerSequence, cellIndex];
      setPlayerSequence(newPlayerSequence);
      setClickedCells([...clickedCells, cellIndex]);
      
      // Check if the clicked cell matches the expected cell in the sequence
      const isCorrect = cellIndex === sequence[playerSequence.length];
      
      setTimeout(() => {
        setClickedCells(clickedCells.filter(cell => cell !== cellIndex));
        setIsAnimating(false);
        
        if (!isCorrect) {
          const newHighScore = round > highScore ? round : highScore;
          setHighScore(newHighScore);
          localStorage.setItem('highScore', newHighScore);
          setGameState('results');
        } else if (newPlayerSequence.length === sequence.length) {
          // Only proceed to next round if the sequence is complete and all moves were correct
          setTimeout(() => {
            setRound(round + 1);
            setGameState('ready');
          }, ANIMATION_DURATION);
        }
      }, ANIMATION_DURATION);
    }
  };

  // Reset game
  const resetGame = () => {
    setRound(1);
    setSequence([]);
    setGameState('ready');
  };

  // Render grid cells
  const renderGrid = () => {
    return Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
      <Grid size={4} key={`grid-${index}`}>
        <Card sx={{ 
          height: 120, 
          backgroundColor: '#E8E8E8',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          border: '2px solid #BDBDBD',
          borderRadius: '8px'
        }}>
          <CardActionArea
            onClick={() => handleCellClick(index)}
            disabled={gameState !== 'copy' || isAnimating}
            sx={{ height: '100%' }}
          >
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              position: 'relative',
              backgroundColor: '#F5F5F5'
            }}>
              <motion.div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#E8E8E8',
                  transformOrigin: 'left',
                  zIndex: 2
                }}
                animate={{
                  rotateY: (activeCell === index && gameState === 'show') || 
                          (clickedCells.includes(index) && gameState === 'copy') ? -90 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <AnimatePresence>
                {(activeCell === index && gameState === 'show') || 
                 (clickedCells.includes(index) && gameState === 'copy' && index === sequence[playerSequence.length - 1]) ? (
                  <motion.img
                    src={MOLE_IMAGE}
                    alt="Nagano"
                    style={{ 
                      width: 80, 
                      height: 80,
                      position: 'absolute',
                      zIndex: 1
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : null}
              </AnimatePresence>
            </Box>
          </CardActionArea>
        </Card>
      </Grid>
    ));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#F5F5F5', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <Box sx={{ 
        maxWidth: 600, 
        width: '100%', 
        padding: 3,
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            color: '#424242',
            fontFamily: '"Noto Serif JP", serif',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Memory Game
        </Typography>
        {gameState === 'results' ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#424242', fontFamily: '"Noto Serif JP", serif' }}>
              Game Over!
            </Typography>
            <Typography variant="h6" sx={{ color: '#424242', fontFamily: '"Noto Serif JP", serif' }}>
              Highest Round Completed: {round}
            </Typography>
            <Typography variant="h6" sx={{ color: '#424242', fontFamily: '"Noto Serif JP", serif' }}>
              All-Time High Score: {highScore}
            </Typography>
            <Button
              variant="contained"
              onClick={resetGame}
              startIcon={<Replay />}
              sx={{ 
                mt: 3, 
                backgroundColor: '#424242',
                '&:hover': {
                  backgroundColor: '#616161'
                }
              }}
            >
              Play Again
            </Button>
          </Box>
        ) : (
          <Stack spacing={2}>
            <Typography 
              variant="h6" 
              align="center" 
              gutterBottom
              sx={{ 
                color: '#424242',
                fontFamily: '"Noto Serif JP", serif'
              }}
            >
              {gameState === "ready"
                ? `Round: ${round}`
                : gameState === "show"
                  ? "Watch the Doors!"
                  : "Repeat the Sequence!"}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {renderGrid()}
            </Grid>
            <Button
              variant="contained"
              onClick={startRound}
              startIcon={<PlayArrow />}
              sx={{ 
                backgroundColor: '#424242',
                visibility: gameState === 'ready' ? 'visible' : 'hidden',
                opacity: gameState === 'ready' ? 1 : 0,
                pointerEvents: gameState === 'ready' ? 'auto' : 'none',
                cursor: gameState === 'ready' ? 'pointer' : 'default',
                '&:hover': {
                  backgroundColor: '#616161'
                }
              }}
            >
              Start Round
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default App;
