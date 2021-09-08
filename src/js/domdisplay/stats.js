import { createElement } from "./utils";

const statusTexts = {
  placement: "Player, place Your ships!",
  initial: "Start playing by attacking Computer's board",
  running: "Battle!",
  lost: "You have lost the game",
  won: "You have won the game",
};

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

  #setStatusText(statusCode) {
    this.#status.textContent = statusTexts[statusCode];
    for (const className of this.#status.classList.values()) {
      if (className.startsWith("stats-section-text--")) {
        this.#status.classList.remove(className);
      }
    }
    this.#status.classList.add(`stats-section-text--${statusCode}`);
  }
}

export default Stats;
