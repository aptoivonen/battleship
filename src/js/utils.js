const positionFromIndex = (i, boardWidth) => [
  i % boardWidth,
  Math.floor(i / boardWidth),
];

export { positionFromIndex };
