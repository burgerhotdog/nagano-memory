import { Card, CardActionArea, Box, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MOLE_IMAGE from './assets/nagano.webp';

const GridCell = ({ index, activeCell, clickedCells, sequence, playerSequence, gameState, isAnimating, onClick }) => {
  return (
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
          onClick={() => onClick(index)}
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
  );
};

export default GridCell;
