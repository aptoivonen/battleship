const positionFromIndex = (i, board) => [
  i % board.width,
  Math.floor(i / board.width),
];

export { positionFromIndex };
