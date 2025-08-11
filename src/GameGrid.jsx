import { Grid } from '@mui/material';
import { GRID_SIZE } from './constants';
import GridCell from './GridCell';

const GameGrid = (props) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
        <GridCell key={index} index={index} {...props} />
      ))}
    </Grid>
  );
};

export default GameGrid;
