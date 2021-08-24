import BasicBoard from "./basicboard";

class AiBoard {
  #game;
  #dispatch;
  #basicBoard;

  constructor(game, dispatch) {
    this.#game = game;
    this.#dispatch = dispatch;
    this.#basicBoard = new BasicBoard({
      game,
      dispatch,
      boardIndex: 1,
      titleText: "Computer's Board",
      boardClassName: "ai-board",
      showShips: false,
    });
    this.#basicBoard.setupGridClickHandler(this.#clickHandler.bind(this));
  }

  get dom() {
    return this.#basicBoard.dom;
  }

  syncGame(game) {
    this.#game = game;
    this.#basicBoard.syncGame(game);
  }

  #clickHandler(event) {
    const cell = event.target.closest(".board-cell");
    if (cell) {
      const column = parseInt(cell.dataset.x, 10);
      const row = parseInt(cell.dataset.y, 10);
      this.#dispatch(this.#game.attack([column, row]));
    }
  }
}

export default AiBoard;
