import "../scss/style.scss";
import GameFactory from "./gamefactory";
import DomDisplay from "./domdisplay/domdisplay";

let game = new GameFactory().create();

const display = new DomDisplay(game, (newGame) => {
  game = newGame;
  display.syncGame(game);
});

const rootDom = document.querySelector("#game");
rootDom.appendChild(display.dom);
