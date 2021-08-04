import GameBoardFactory from "./gameboardfactory";
import GameBoard from "./gameboard";
import ShipFactory from "./shipfactory";
import { makeRandomMock, makeArraySampleMock } from "./testutils";

// common shipFactory for all tests
const shipFactory = new ShipFactory();

describe("create", () => {
  test("throws TypeError if arguments to constructor were not supplied", () => {
    expect(() => {
      new GameBoardFactory().create("player");
    }).toThrow(
      new TypeError(
        "cannot create a gameBoardFactory: too few arguments; 3 are required"
      )
    );
  });

  test("creates gameboard objects for 'player' and 'ai'", () => {
    const playerBoard = new GameBoardFactory(
      shipFactory,
      makeRandomMock(),
      makeArraySampleMock()
    ).create("player");
    expect(playerBoard).toEqual(expect.any(GameBoard));

    const aiBoard = new GameBoardFactory(
      shipFactory,
      makeRandomMock(),
      makeArraySampleMock()
    ).create("ai");
    expect(aiBoard).toEqual(expect.any(GameBoard));
  });

  test("throws TypeError if type doesn't exist", () => {
    expect(() => {
      new GameBoardFactory(
        shipFactory,
        makeRandomMock(),
        makeArraySampleMock()
      ).create("nosuchplayer");
    }).toThrow(new TypeError("no such player type"));
  });
});

describe("creates 1 carrier, 2 battleships, 3 cruisers, 4 destroyers, 5 submarines", () => {
  const [
    numberOfCarriers,
    numberOfBattleships,
    numberOfCruisers,
    numberOfDestroyers,
    numberOfSubmarines,
  ] = [1, 2, 3, 4, 5];

  test("correct number of ships", () => {
    const board = new GameBoardFactory(
      shipFactory,
      makeRandomMock(),
      makeArraySampleMock()
    ).create("player");

    expect(board.ships).toHaveLength(
      numberOfCarriers +
        numberOfBattleships +
        numberOfCruisers +
        numberOfDestroyers +
        numberOfSubmarines
    );
  });

  test("calls ShipFactory.create() correct number of times for each ship type", () => {
    const shipFactoryCreateMock = jest
      .fn()
      .mockReturnValueOnce(shipFactory.create("carrier", [0, 0], "eastwards"))
      .mockReturnValueOnce(
        shipFactory.create("battleship", [0, 1], "eastwards")
      )
      .mockReturnValueOnce(
        shipFactory.create("battleship", [4, 1], "eastwards")
      )
      .mockReturnValueOnce(shipFactory.create("cruiser", [0, 2], "eastwards"))
      .mockReturnValueOnce(shipFactory.create("cruiser", [3, 2], "eastwards"))
      .mockReturnValueOnce(shipFactory.create("cruiser", [6, 2], "eastwards"))
      .mockReturnValueOnce(shipFactory.create("destroyer", [0, 3], "eastwards"))
      .mockReturnValueOnce(shipFactory.create("destroyer", [2, 3], "eastwards"))
      .mockReturnValueOnce(shipFactory.create("destroyer", [4, 3], "eastwards"))
      .mockReturnValueOnce(shipFactory.create("destroyer", [6, 3], "eastwards"))
      .mockReturnValueOnce(shipFactory.create("submarine", [0, 4], "eastwards"))
      .mockReturnValueOnce(shipFactory.create("submarine", [1, 4], "eastwards"))
      .mockReturnValueOnce(shipFactory.create("submarine", [2, 4], "eastwards"))
      .mockReturnValueOnce(shipFactory.create("submarine", [3, 4], "eastwards"))
      .mockReturnValueOnce(
        shipFactory.create("submarine", [4, 4], "eastwards")
      );
    const shipFactoryMock = {
      create: shipFactoryCreateMock,
    };
    new GameBoardFactory(
      shipFactoryMock,
      makeRandomMock(),
      makeArraySampleMock()
    ).create("player");
    const shipTypeCount = shipFactoryCreateMock.mock.calls.reduce(
      (acc, fnCall) => {
        const type = fnCall[0];
        acc[type] = type in acc ? acc[type] + 1 : 1;
        return acc;
      },
      {}
    );
    expect(shipTypeCount.carrier).toBe(numberOfCarriers);
    expect(shipTypeCount.battleship).toBe(numberOfBattleships);
    expect(shipTypeCount.cruiser).toBe(numberOfCruisers);
    expect(shipTypeCount.destroyer).toBe(numberOfDestroyers);
    expect(shipTypeCount.submarine).toBe(numberOfSubmarines);
  });
});
