import GameBoardFactory from "../gameboardfactory";
import GameBoard from "../gameboard";
import ShipFactory from "../shipfactory";
import { makeRandomMock, makeArraySampleMock } from "./testutils";

// common shipFactory for all tests
const shipFactory = new ShipFactory();

let gameBoardFactory;

beforeEach(() => {
  gameBoardFactory = new GameBoardFactory(
    shipFactory,
    makeRandomMock(),
    makeArraySampleMock()
  );
});

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

describe("getNumberOfShipsInfo", () => {
  test("returns correct info object", () => {
    expect(
      new GameBoardFactory(
        shipFactory,
        makeRandomMock(),
        makeArraySampleMock()
      ).getNumberOfShipsInfo()
    ).toEqual(
      expect.objectContaining({
        carrier: 1,
        battleship: 2,
        cruiser: 3,
        destroyer: 4,
        submarine: 5,
      })
    );
  });
});

describe("create board for ai", () => {
  const [
    numberOfCarriers,
    numberOfBattleships,
    numberOfCruisers,
    numberOfDestroyers,
    numberOfSubmarines,
  ] = [1, 2, 3, 4, 5];

  test("correct number of ships: creates 1 carrier, 2 battleships, 3 cruisers, 4 destroyers, 5 submarines", () => {
    const board = new GameBoardFactory(
      shipFactory,
      makeRandomMock(),
      makeArraySampleMock()
    ).create("ai");

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
    ).create("ai");
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

describe("create board for player", () => {
  test("starts with 'placement' status", () => {
    const board = new GameBoardFactory(
      shipFactory,
      makeRandomMock(),
      makeArraySampleMock()
    ).create("player");

    expect(board.getStatus()).toBe("placement");
  });

  test("no ships at the beginning", () => {
    const board = new GameBoardFactory(
      shipFactory,
      makeRandomMock(),
      makeArraySampleMock()
    ).create("player");

    expect(board.ships).toHaveLength(0);
  });
});

describe("canPlaceShip", () => {
  test("returns false for ship out of bounds", () => {
    const initialBoard = gameBoardFactory.create("player");
    const result = gameBoardFactory.canPlaceShip(initialBoard, {
      type: "carrier",
      location: [0, 0],
      direction: "westwards",
    });
    expect(result).toBe(false);
  });

  test("returns true for ship within bounds", () => {
    const initialBoard = gameBoardFactory.create("player");
    const result = gameBoardFactory.canPlaceShip(initialBoard, {
      type: "carrier",
      location: [0, 0],
      direction: "eastwards",
    });
    expect(result).toBe(true);
  });

  test("returns false for ship collision", () => {
    const initialBoard = gameBoardFactory.create("player");
    const oneCarrierBoard = gameBoardFactory.placeShip(initialBoard, {
      type: "carrier",
      location: [0, 0],
      direction: "eastwards",
    });
    const result = gameBoardFactory.canPlaceShip(oneCarrierBoard, {
      type: "carrier",
      location: [0, 4],
      direction: "northwards",
    });
    expect(result).toBe(false);
  });

  test("returns false for second carrier", () => {
    const initialBoard = gameBoardFactory.create("player");
    const oneCarrierBoard = gameBoardFactory.placeShip(initialBoard, {
      type: "carrier",
      location: [0, 0],
      direction: "eastwards",
    });
    const result = gameBoardFactory.canPlaceShip(oneCarrierBoard, {
      type: "carrier",
      location: [0, 1],
      direction: "eastwards",
    });
    expect(result).toBe(false);
  });
});

describe("placeShip", () => {
  test("after adding ship player board has one ship", () => {
    const initialBoard = gameBoardFactory.create("player");
    const resultBoard = gameBoardFactory.placeShip(initialBoard, {
      type: "carrier",
      location: [0, 0],
      direction: "eastwards",
    });
    expect(resultBoard.ships).toHaveLength(1);
  });

  test("after adding one ship player board has status 'placement'", () => {
    const initialBoard = gameBoardFactory.create("player");
    const resultBoard = gameBoardFactory.placeShip(initialBoard, {
      type: "carrier",
      location: [0, 0],
      direction: "eastwards",
    });
    expect(resultBoard.getStatus()).toBe("placement");
  });

  test("after adding all 5+4+3+2+1 ships board has status 'initial'", () => {
    const initialBoard = gameBoardFactory.create("player");
    let resultBoard = gameBoardFactory.placeShip(initialBoard, {
      type: "carrier",
      location: [0, 0],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "battleship",
      location: [0, 1],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "battleship",
      location: [4, 1],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "cruiser",
      location: [0, 2],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "cruiser",
      location: [3, 2],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "cruiser",
      location: [6, 2],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "destroyer",
      location: [0, 3],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "destroyer",
      location: [2, 3],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "destroyer",
      location: [4, 3],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "destroyer",
      location: [6, 3],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "submarine",
      location: [0, 4],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "submarine",
      location: [1, 4],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "submarine",
      location: [2, 4],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "submarine",
      location: [3, 4],
      direction: "eastwards",
    });
    resultBoard = gameBoardFactory.placeShip(resultBoard, {
      type: "submarine",
      location: [4, 4],
      direction: "eastwards",
    });
    expect(resultBoard.getStatus()).toBe("initial");
  });
});
