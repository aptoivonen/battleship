import sample from "lodash/sample";
import Game from "./game";

class GameFactory {
  create() {
    return new Game(Math.random, sample);
  }
}

export default GameFactory;
