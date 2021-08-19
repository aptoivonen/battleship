import { createElement } from "./utils";

class Stats {
  #game;
  #dom;
  #status;

  constructor(game) {
    this.#game = game;
    this.#createDom();
    this.syncGame(game);
  }

  get dom() {
    return this.#dom;
  }

  syncGame(game) {
    this.#game = game;
    this.#setStatusText(this.#game.getStatus());
  }

  #createDom() {
    const dom = createElement("div", "stats-section");
    this.#status = createElement("span", "stats-section-text");
    dom.appendChild(this.#status);

    this.#dom = dom;
  }

  #setStatusText(statusText) {
    this.#status.textContent = statusText;
    for (const className of this.#status.classList.values()) {
      if (className.startsWith("stats-section-text--")) {
        this.#status.classList.remove(className);
      }
    }
    this.#status.classList.add(`stats-section-text--${statusText}`);
  }
}

export default Stats;
