function getNonHitPositions(board) {
  const allNonHitPositions = [];
  for (let row = 0; row < board.height; row++) {
    for (let column = 0; column < board.width; column++) {
      const newPosition = [column, row];
      if (!board.findHit(newPosition)) {
        allNonHitPositions.push(newPosition);
      }
    }
  }
  return allNonHitPositions;
}

function perfomAiMove(playerBoard, sampleFn) {
  const targetPosition = sampleFn(getNonHitPositions(playerBoard));
  return playerBoard.receiveAttack(targetPosition);
}

export default perfomAiMove;
