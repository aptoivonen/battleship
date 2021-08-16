import GameFactory from "../gamefactory";
import Game from "../game";

test("produces a Game object", () => {
  const game = new GameFactory().create();
  expect(game).toEqual(expect.any(Game));
});
