import GameBoardFactory from "./gameboardfactory";
import GameBoard from "./gameboard";
import ShipFactory from "./shipfactory";
import shipLookupTable from "./shiplookuptable";
import numberOfShipsTable from "./numberofshipstable";
import Ship from "./ship";
import { makeRandomMock } from "./testutils";

// common shipFactory for all tests
const shipFactory = new ShipFactory();

test("creates gameboard objects for 'player' and 'ai'", () => {
  const playerBoard = new GameBoardFactory(
    shipFactory,
    makeRandomMock()
  ).create("player");
  expect(playerBoard).toEqual(expect.any(GameBoard));

  const aiBoard = new GameBoardFactory(shipFactory, makeRandomMock()).create(
    "ai"
  );
  expect(aiBoard).toEqual(expect.any(GameBoard));
});

test("throws TypeError if type doesn't exist", () => {
  expect(() => {
    new GameBoardFactory(shipFactory, makeRandomMock()).create("nosuchplayer");
  }).toThrow(new TypeError("no such player type"));
});

test("throws TypeError if arguments to constructor were not supplied", () => {
  expect(() => {
    new GameBoardFactory().create("player");
  }).toThrow(
    new TypeError(
      "cannot create a gameBoardFactory: too few arguments; 2 are required"
    )
  );
});

describe("creates 1 carrier, 2 battleships, 3 cruisers, 4 destroyers, 5 submarines for player and ai", () => {
  const [
    numberOfCarriers,
    numberOfBattleships,
    numberOfCruisers,
    numberOfDestroyers,
    numberOfSubmarines,
  ] = [
    numberOfShipsTable["carrier"],
    numberOfShipsTable["battleship"],
    numberOfShipsTable["cruiser"],
    numberOfShipsTable["destroyer"],
    numberOfShipsTable["submarine"],
  ];
  test("correct number of ship spaces", () => {
    const playerBoard = new GameBoardFactory(
      shipFactory,
      makeRandomMock()
    ).create("player");
    const aiBoard = new GameBoardFactory(shipFactory, makeRandomMock()).create(
      "ai"
    );
    const playerBoardArray = playerBoard.getBoard().split("");
    const aiBoardArray = aiBoard.getBoard().split("");
    const onlyShips = (char) => char === "s";
    const playerNumberOfShipSpaces = playerBoardArray.filter(onlyShips).length;
    const aiNumberOfShipSpaces = aiBoardArray.filter(onlyShips).length;
    const [
      carrierLength,
      battleshipLength,
      cruiserLength,
      destoyerLength,
      submarineLength,
    ] = [
      shipLookupTable["carrier"],
      shipLookupTable["battleship"],
      shipLookupTable["cruiser"],
      shipLookupTable["destroyer"],
      shipLookupTable["submarine"],
    ];

    const expectedNumberOfShipSpaces =
      numberOfCarriers * carrierLength +
      numberOfBattleships * battleshipLength +
      numberOfCruisers * cruiserLength +
      numberOfDestroyers * destoyerLength +
      numberOfSubmarines * submarineLength;
    expect(playerNumberOfShipSpaces).toBe(expectedNumberOfShipSpaces);
    expect(aiNumberOfShipSpaces).toBe(expectedNumberOfShipSpaces);
  });

  test("calls GameBoard class correct number of times for each ship type", () => {
    const shipFactoryCreateMock = jest.fn(() => {
      return new Ship(1);
    });
    const shipFactoryMock = {
      create: shipFactoryCreateMock,
    };
    new GameBoardFactory(shipFactoryMock, makeRandomMock()).create("player");
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
