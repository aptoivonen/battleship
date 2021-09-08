import "../scss/style.scss";
import GameFactory from "./gamefactory";
import DomDisplay from "./domdisplay/domdisplay";

function getFullyPlacedGame(inputGame) {
  return inputGame
    .placeShip({
      type: "carrier",
      location: [0, 0],
      direction: "eastwards",
    })
    .placeShip({
      type: "battleship",
      location: [0, 1],
      direction: "eastwards",
    })
    .placeShip({
      type: "battleship",
      location: [4, 1],
      direction: "eastwards",
    })
    .placeShip({
      type: "cruiser",
      location: [0, 2],
      direction: "eastwards",
    })
    .placeShip({
      type: "cruiser",
      location: [3, 2],
      direction: "eastwards",
    })
    .placeShip({
      type: "cruiser",
      location: [6, 2],
      direction: "eastwards",
    })
    .placeShip({
      type: "destroyer",
      location: [0, 3],
      direction: "eastwards",
    })
    .placeShip({
      type: "destroyer",
      location: [2, 3],
      direction: "eastwards",
    })
    .placeShip({
      type: "destroyer",
      location: [4, 3],
      direction: "eastwards",
    })
    .placeShip({
      type: "destroyer",
      location: [6, 3],
      direction: "eastwards",
    })
    .placeShip({
      type: "submarine",
      location: [0, 4],
      direction: "eastwards",
    })
    .placeShip({
      type: "submarine",
      location: [1, 4],
      direction: "eastwards",
    })
    .placeShip({
      type: "submarine",
      location: [2, 4],
      direction: "eastwards",
    })
    .placeShip({
      type: "submarine",
      location: [3, 4],
      direction: "eastwards",
    })
    .placeShip({
      type: "submarine",
      location: [4, 4],
      direction: "eastwards",
    });
}

// let game = getFullyPlacedGame(new GameFactory().create());
let game = new GameFactory().create();

const display = new DomDisplay(game, (newGame) => {
  game = newGame;
  display.syncGame(game);
});

const rootDom = document.querySelector("#game");
rootDom.appendChild(display.dom);
