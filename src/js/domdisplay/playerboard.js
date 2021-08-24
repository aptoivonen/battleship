import BasicBoard from "./basicboard";

class PlayerBoard {
  #game;
  #dispatch;
  #basicBoard;

  constructor(game, dispatch) {
    this.#game = game;
    this.#dispatch = dispatch;
    this.#basicBoard = new BasicBoard({
      game,
      dispatch,
      boardIndex: 0,
      titleText: "Player's Board",
      boardClassName: "player-board",
      showShips: true,
    });
  }

  get dom() {
    return this.#basicBoard.dom;
  }

  syncGame(game) {
    this.#game = game;
    this.#basicBoard.syncGame(game);
  }
}

export default PlayerBoard;
