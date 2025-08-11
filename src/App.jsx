import { Stack, Button, Typography, Box } from '@mui/material';
import { PlayArrow, Replay } from "@mui/icons-material";
import { useGameState } from './useGameState';
import GameGrid from './GameGrid';

const App = () => {
  const {
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
  } = useGameState();

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
                '&:hover': { backgroundColor: '#616161' }
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
            <GameGrid
              activeCell={activeCell}
              clickedCells={clickedCells}
              sequence={sequence}
              playerSequence={playerSequence}
              gameState={gameState}
              isAnimating={isAnimating}
              onClick={handleCellClick}
            />
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
                '&:hover': { backgroundColor: '#616161' }
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
