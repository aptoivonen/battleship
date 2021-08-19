import GameFactory from "../gamefactory";
import { createElement } from "./utils";

class Restart {
  #dispatch;
  #dom;

  constructor(_, dispatch) {
    this.#dispatch = dispatch;
    this.#createDom();
  }

  get dom() {
    return this.#dom;
  }

  syncGame() {}

  #createDom() {
    const dom = createElement("button", "restart-btn");
    dom.textContent = "Restart";
    dom.addEventListener("click", this.#startNewGame.bind(this));

    this.#dom = dom;
  }

  #startNewGame() {
    this.#dispatch(new GameFactory().create());
  }
}

export default Restart;
