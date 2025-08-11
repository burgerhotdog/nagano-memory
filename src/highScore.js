export const getHighScore = () => {
  return parseInt(localStorage.getItem('highScore') || '0', 10);
};

export const saveHighScore = (score) => {
  localStorage.setItem('highScore', score);
};
