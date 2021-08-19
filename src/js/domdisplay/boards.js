import PlayerBoard from "./playerboard";
import AiBoard from "./aiboard";
import { createElement } from "./utils";

class Boards {
  #dom;
  #childComponents;

  constructor(game, dispatch) {
    this.#childComponents = [];
    this.#createDom(game, dispatch);
    this.syncGame(game);
  }

  get dom() {
    return this.#dom;
  }

  syncGame(game) {
    this.#childComponents.forEach((component) => component.syncGame(game));
  }

  #createDom(game, dispatch) {
    const dom = createElement("div", "boards-section");
    this.#childComponents.push(new AiBoard(game, dispatch));
    this.#childComponents.push(new PlayerBoard(game, dispatch));

    this.#childComponents.forEach((component) =>
      dom.appendChild(component.dom)
    );

    this.#dom = dom;
  }
}

export default Boards;
