import ShipFactory from "./shipfactory";
import GameBoardFactory from "./gameboardfactory";
import pubsub from "./pubsub";

class Game {
  #random;
  #playerBoard;
  #aiBoard;
  #pubsub;

  constructor(randomizeFn) {
    this.#random = randomizeFn;
    const gameBoardFactory = new GameBoardFactory(
      new ShipFactory(),
      this.#random
    );
    this.#playerBoard = gameBoardFactory.create("player");
    this.#aiBoard = gameBoardFactory.create("ai");
    this.#pubsub = pubsub;
  }

  attack([x, y]) {
    let result = false;
    try {
      const newAiBoard = this.#aiBoard.receiveAttack([x, y]);
      if (newAiBoard !== this.#aiBoard) {
        result = true;
        this.#aiBoard = newAiBoard;
        this.#pubsub.publish("playermove", true);
      }
      // eslint-disable-next-line no-empty
    } catch (RangeError) {}

    return result;
  }

  getBoards() {
    return [this.#playerBoard.getBoard(), this.#aiBoard.getBoard()];
  }

  subscribe(topic, fn) {
    this.#pubsub.subscribe(topic, fn);
  }

  unsubscribe(topic, fn) {
    this.#pubsub.unsubscribe(topic, fn);
  }
}

export default Game;
