import { createElement } from "./utils";

const titleText = "Computer's Board";

class AiBoard {
  #game;
  #dispatch;
  #dom;
  #boardWidth;
  #boardHeight;

  constructor(game, dispatch) {
    this.#boardWidth = game.getBoards()[0].width;
    this.#boardHeight = game.getBoards()[0].height;
    this.#game = game;
    this.#dispatch = dispatch;
    this.#createDom();
    this.#setupHandlers();
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

  #createDom() {
    const dom = createElement("div", "board ai-board");
    const title = createElement("p", "board-title");
    title.textContent = titleText;
    dom.appendChild(title);
    const grid = createElement("div", "board-grid");
    dom.appendChild(grid);
    for (let row = 0; row < this.#boardHeight; row++) {
      for (let column = 0; column < this.#boardWidth; column++) {
        const cell = createElement("div");
        cell.dataset.x = column;
        cell.dataset.y = row;
        grid.appendChild(this.#decorateGameCell(cell));
      }
    }

    this.#dom = dom;
  }

  #setupHandlers() {
    this.#dom
      .querySelector(".board-grid")
      .addEventListener("click", this.#clickHandler.bind(this));
  }

  #decorateGameCell(cell) {
    const row = parseInt(cell.dataset.y, 10);
    const column = parseInt(cell.dataset.x, 10);
    const aiBoard = this.#game.getBoards()[1];
    const { ships } = aiBoard;
    let hasShip = false;
    for (const ship of ships) {
      if (ship.hasPosition([column, row])) {
        hasShip = true;
        break;
      }
    }
    let hasShot = false;
    if (aiBoard.findHit([column, row])) {
      hasShot = true;
    }
    let className = "board-cell";
    className += hasShot
      ? hasShip
        ? " board-cell--hit"
        : " board-cell--miss"
      : "";

    cell.setAttribute("class", className);
    return cell;
  }

  *#getCells() {
    for (const cell of this.#dom.querySelector(".board-grid").children) {
      yield cell;
    }
  }

  #clickHandler(event) {
    const cell = event.target.closest(".board-cell");
    if (cell) {
      const column = parseInt(cell.dataset.x, 10);
      const row = parseInt(cell.dataset.y, 10);
      this.#attack(column, row);
    }
  }

  #attack(column, row) {
    this.#dispatch(this.#game.attack([column, row]));
  }
}

export default AiBoard;
