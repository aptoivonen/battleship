import Game from "./game";

class GameFactory {
  create() {
    return new Game(Math.random);
  }
}

export default GameFactory;
