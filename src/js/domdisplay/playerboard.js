import findKey from "lodash/findKey";
import BasicBoard from "./basicboard";
import { createElement } from "./utils";

class PlayerBoard {
  #game;
  #dispatch;
  #basicBoard;
  #shipPlacementInfo;

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
    this.#shipPlacementInfo = {};
    this.#shipPlacementInfo.shipDirectionSelection = "eastwards";
    this.#createDom();
    this.#basicBoard.setupGridClickHandler(this.#clickHandler.bind(this));
    this.#basicBoard.dom
      .querySelector("#board-placement-radios")
      .addEventListener("change", this.#shipDirectionHandler.bind(this));
  }

  get dom() {
    return this.#basicBoard.dom;
  }

  syncGame(game) {
    this.#game = game;
    this.#basicBoard.syncGame(game);
    this.#updatePlacementUI();
    this.#updateShips();
  }

  #createDom() {
    const wrapper = this.#basicBoard.dom.querySelector(".board-wrapper");
    const placement = createElement("div", "board-placement hide show");
    const placementTitle = createElement("span", "board-placement-title", {
      textContent: "Place",
    });
    placementTitle.appendChild(
      createElement("span", "board-placement-type", {
        id: "board-placement-type",
      })
    );
    placementTitle.appendChild(
      createElement("span", "board-placement-number", {
        id: "board-placement-number",
      })
    );
    placement.appendChild(placementTitle);
    const placementControls = createElement(
      "fieldset",
      "board-placement-radios",
      { id: "board-placement-radios" }
    );
    placement.appendChild(placementControls);
    const placementGroup1 = createElement("div", "board-placement-radio-group");
    placementControls.appendChild(placementGroup1);
    const radio1 = createElement("input", "", { checked: "checked" });
    radio1.setAttribute("type", "radio");
    radio1.setAttribute("value", "eastwards");
    radio1.setAttribute("name", "direction");
    radio1.setAttribute("id", "eastwards-direction-radio");
    placementGroup1.appendChild(radio1);
    const label1 = createElement("label", "board-placement-label", {
      textContent: "Horizontal",
    });
    label1.setAttribute("for", "eastwards-direction-radio");
    placementGroup1.appendChild(label1);
    const placementGroup2 = createElement("div", "board-placement-radio-group");
    placementControls.appendChild(placementGroup2);
    const radio2 = createElement("input", "");
    radio2.setAttribute("type", "radio");
    radio2.setAttribute("value", "northwards");
    radio2.setAttribute("name", "direction");
    radio2.setAttribute("id", "northwards-direction-radio");
    placementGroup2.appendChild(radio2);
    const label2 = createElement("label", "board-placement-label", {
      textContent: "Vertical",
    });
    label2.setAttribute("for", "northwards-direction-radio");
    placementGroup2.appendChild(label2);
    wrapper.appendChild(placement);
  }

  #updatePlacementUI() {
    if (this.#game.getStatus() !== "placement") {
      this.#basicBoard.dom
        .querySelector(".board-placement")
        .classList.remove("show");
      return;
    }
    this.#basicBoard.dom
      .querySelector(".board-placement")
      .classList.add("show");
    const gameShipInfo = this.#game.getShipInfo();
    const shipTypeToPlace = findKey(
      gameShipInfo,
      (shipInfo) =>
        this.#findNumberOfPlayerShips(shipInfo.length) < shipInfo.numberOfShips
    );
    const playerNumberOfShips = this.#findNumberOfPlayerShips(
      gameShipInfo[shipTypeToPlace].length
    );
    this.#shipPlacementInfo.shipTypeToPlace = shipTypeToPlace;
    this.#shipPlacementInfo.playerNumberOfShips = playerNumberOfShips;
    this.#shipPlacementInfo.numberOfShips =
      gameShipInfo[shipTypeToPlace].numberOfShips;
    this.dom.querySelector("#board-placement-type").textContent =
      this.#makePlacementTypeString();
    this.dom.querySelector("#board-placement-number").textContent =
      this.#makePlacementNumberString();
  }

  #makePlacementTypeString() {
    return ` ${this.#shipPlacementInfo.shipTypeToPlace}`;
  }

  #makePlacementNumberString() {
    return ` ${this.#shipPlacementInfo.playerNumberOfShips + 1} of ${
      this.#shipPlacementInfo.numberOfShips
    }`;
  }

  #updateShips() {
    const shipElements = this.#basicBoard.dom
      .querySelector(".board-grid")
      .querySelectorAll(".ship");
    shipElements.forEach((shipElement) =>
      shipElement.parentElement.removeChild(shipElement)
    );
    const { ships } = this.#game.getBoards()[0];
    ships.forEach((ship) => {
      const shipElement = createElement("div", "ship");
      const shipType = this.#findShipType(ship.positions.length);
      shipElement.classList.add(`ship--${shipType}`);
      const shipDirection = this.#findShipDirection(ship.positions);
      shipElement.classList.add(`ship--${shipDirection}`);
      shipElement.style.setProperty("--column", ship.positions[0][0]);
      shipElement.style.setProperty("--row", ship.positions[0][1]);
      if (ship.isSunk()) {
        shipElement.classList.add("ship--sunk");
      }
      this.#basicBoard.dom
        .querySelector(".board-grid")
        .appendChild(shipElement);
    });
  }

  #findShipType(shipLength) {
    const type =
      findKey(this.#game.getShipInfo(), { length: shipLength }) || "";
    return type;
  }

  #findShipDirection(shipPositions) {
    if (shipPositions.length === 1) {
      return "eastwards";
    }
    const dx = shipPositions[1][0] - shipPositions[0][0];
    if (dx > 0) return "eastwards";
    return "northwards";
  }

  #findNumberOfPlayerShips(shipLength) {
    const { ships } = this.#game.getBoards()[0];
    return ships.reduce(
      (acc, cur) => (cur.positions.length === shipLength ? acc + 1 : acc),
      0
    );
  }

  #clickHandler(event) {
    if (this.#game.getStatus() !== "placement") {
      return;
    }
    const cell = event.target.closest(".board-cell");
    if (!cell) {
      return;
    }
    const column = parseInt(cell.dataset.x, 10);
    const row = parseInt(cell.dataset.y, 10);
    const placementObject = {
      type: this.#shipPlacementInfo.shipTypeToPlace,
      location: [column, row],
      direction: this.#shipPlacementInfo.shipDirectionSelection,
    };
    if (!this.#game.canPlaceShip(placementObject)) {
      return;
    }
    this.#dispatch(this.#game.placeShip(placementObject));
  }

  #shipDirectionHandler(event) {
    if (this.#game.getStatus() !== "placement") {
      return;
    }
    this.#shipPlacementInfo.shipDirectionSelection = event.target.value;
  }
}

export default PlayerBoard;
