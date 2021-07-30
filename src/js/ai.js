const positionFromIndex = (i, playerBoard) => [
  i % playerBoard.width,
  Math.floor(i / playerBoard.width),
];

function perfomAiMove(playerBoard, randomizeFn) {
  const possiblePositions = playerBoard
    .getBoard()
    .split("")
    .map((char, i) => ({ char, pos: positionFromIndex(i, playerBoard) }))
    .filter((obj) => /[.s]/.test(obj.char))
    .map((obj) => obj.pos);
  const randomIndex = Math.floor(randomizeFn() * possiblePositions.length);
  const newTarget = possiblePositions[randomIndex];
  return playerBoard.receiveAttack(newTarget);
}

export default perfomAiMove;
