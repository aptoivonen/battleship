import Stats from "./stats";
import Boards from "./boards";
import Restart from "./restart";
import { createElement } from "./utils";

class DomDisplay {
  #game;
  #dispatch;
  #dom;
  #childComponents;

  constructor(game, dispatch) {
    this.#game = game;
    this.#dispatch = dispatch;
    this.#childComponents = [];
    this.#createDom();
    this.syncGame(game);
  }

  get dom() {
    return this.#dom;
  }

  syncGame(game) {
    if (game === this.#game) {
      return;
    }
    this.#game = game;
    this.#childComponents.forEach((component) => component.syncGame(game));
  }

  #createDom() {
    const game = this.#game;
    const dispatch = this.#dispatch;

    const dom = createElement("div", "game-container");
    const gameSection = createElement("section", "game-section");
    this.#childComponents.push(new Stats(game, dispatch));
    this.#childComponents.push(new Boards(game, dispatch));
    this.#childComponents.push(new Restart(game, dispatch));

    this.#childComponents.forEach((component) =>
      gameSection.appendChild(component.dom)
    );
    dom.appendChild(gameSection);

    this.#dom = dom;
  }
}

export default DomDisplay;
