import { createElement } from "./utils";

const titleText = "Player's Board";

class PlayerBoard {
  #game;
  #dom;
  #boardWidth;
  #boardHeight;

  constructor(game) {
    this.#boardWidth = game.getBoards()[0].width;
    this.#boardHeight = game.getBoards()[0].height;
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
    const dom = createElement("div", "board player-board");
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
    const playerBoard = this.#game.getBoards()[0];
    const { ships } = playerBoard;
    let hasShip = false;
    for (const ship of ships) {
      if (ship.hasPosition([column, row])) {
        hasShip = true;
        break;
      }
    }
    let hasShot = false;
    if (playerBoard.findHit([column, row])) {
      hasShot = true;
    }
    let className = "board-cell";
    if (hasShip) {
      className += " board-cell--ship";
    }
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

export default PlayerBoard;
