import { createElement } from "./utils";

class BasicBoard {
  #game;
  #dispatch;
  #dom;
  #boardIndex;
  #showShips;

  constructor({
    game,
    dispatch,
    boardIndex,
    titleText,
    boardClassName,
    showShips,
  }) {
    this.#game = game;
    this.#dispatch = dispatch;
    this.#boardIndex = boardIndex;
    this.#showShips = showShips;
    this.#createDom({
      boardWidth: game.getBoards()[boardIndex].width,
      boardHeight: game.getBoards()[boardIndex].height,
      titleText,
      boardClassName,
    });
    this.syncGame(game);
  }

  get dom() {
    return this.#dom;
  }

  syncGame(game) {
    this.#game = game;
    for (const cell of this.#getCells()) {
      this.#decorateGameCell(cell);
    }
  }

  setupGridClickHandler(handler) {
    this.#dom.querySelector(".board-grid").addEventListener("click", handler);
  }

  #createDom({ boardWidth, boardHeight, titleText, boardClassName }) {
    const dom = createElement("div", `board ${boardClassName}`);
    const title = createElement("p", "board-title");
    title.textContent = titleText;
    dom.appendChild(title);
    const wrapper = createElement("div", "board-wrapper");
    dom.appendChild(wrapper);
    const grid = createElement("div", "board-grid");
    wrapper.appendChild(grid);
    for (let row = 0; row < boardHeight; row++) {
      for (let column = 0; column < boardWidth; column++) {
        const cell = createElement("div");
        cell.dataset.x = column;
        cell.dataset.y = row;
        grid.appendChild(this.#decorateGameCell(cell));
      }
    }

    this.#dom = dom;
  }

  #decorateGameCell(cell) {
    const board = this.#game.getBoards()[this.#boardIndex];
    const row = parseInt(cell.dataset.y, 10);
    const column = parseInt(cell.dataset.x, 10);
    const hasShip = this.#hasShip(board, column, row);
    const hasShot = this.#hasShot(board, column, row);
    let className = "board-cell";
    className += hasShot
      ? hasShip
        ? " board-cell--hit"
        : " board-cell--miss"
      : "";

    cell.setAttribute("class", className);
    return cell;
  }

  #hasShot(board, column, row) {
    let hasShot = false;
    if (board.findHit([column, row])) {
      hasShot = true;
    }
    return hasShot;
  }

  #hasShip(board, column, row) {
    const { ships } = board;
    let hasShip = false;
    for (const ship of ships) {
      if (ship.hasPosition([column, row])) {
        hasShip = true;
        break;
      }
    }
    return hasShip;
  }

  *#getCells() {
    for (const cell of this.#dom.querySelectorAll(".board-cell")) {
      yield cell;
    }
  }
}

export default BasicBoard;
