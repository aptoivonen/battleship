import { createElement } from "./utils";

const titleText = "Computer's Board";

class AiBoard {
  #game;
  #dom;
  #boardWidth;
  #boardHeight;

  constructor(game) {
    this.#boardWidth = 10;
    this.#boardHeight = 10;
    this.#game = game;
    this.#createDom();
    this.syncGame(game);
  }

  get dom() {
    return this.#dom;
  }

  syncGame(game) {
    this.#game = game;
    for (let row = 0; row < this.#boardHeight; row++) {
      for (let column = 0; column < this.#boardWidth; column++) {
        this.#setGameCell(this.#findCell(row, column), row, column);
      }
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
        grid.appendChild(this.#setGameCell(cell, row, column));
      }
    }

    this.#dom = dom;
  }

  #setGameCell(cell, row, column) {
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

  #findCell(row, column) {
    return this.#dom.querySelector(`[data-x="${column}"][data-y="${row}"]`);
  }
}

export default AiBoard;
