import GameBoardFactory from "./gameboardfactory";
import GameBoard from "./gameboard";
import ShipFactory from "./shipfactory";
import shipLookupTable from "./shiplookuptable";
import numberOfShipsTable from "./numberofshipstable";
import Ship from "./ship";

// common shipFactory for all tests
const shipFactory = new ShipFactory();
// randoms
const randoms = [
  0.3919558927805378, 0.19892293738538835, 0.21277705062867447,
  0.5887127394911915, 0.168602308584608, 0.9670477961732985,
  0.25392549191372416, 0.40918011393434794, 0.5680136498412085,
  0.7165882990792429, 0.9336095219902588, 0.04516006665961103,
  0.9147263060152049, 0.9732954150922256, 0.5793720270410425,
  0.43025799560536526, 0.6639296960546723, 0.015564951672467853,
  0.42028857527591257, 0.6607999588979612, 0.33974297759491223,
  0.6079729089252114, 0.8608457991381447, 0.5964984354288743,
  0.7822899102065971, 0.9605097569847153, 0.7070936772764271,
  0.3395379011645068, 0.19594836440660335, 0.9677806357986548,
  0.5676430461993018, 0.9665183792625585, 0.4004483377813406,
  0.24590462289433468, 0.22139026994889477, 0.489099994923196,
  0.9460778044611196, 0.33067689231829545, 0.10868543695538813,
  0.9697232912383167, 0.33254215019961375, 0.8816157147748271,
  0.655866168151127, 0.38290832206067527, 0.5419766664621535,
  0.21924724609000934, 0.3277627087701346, 0.943422247632215,
  0.47622173772819354, 0.9271493431150127, 0.9939057911699423,
  0.6674922436742854, 0.25735935101614893, 0.3035646774514479,
  0.33578324841676466, 0.6181222256242496, 0.24949607034926802,
  0.5936940461763452, 0.542999545037322, 0.5694761179735222, 0.731306400545951,
  0.2007062101860254, 0.1945489313764206, 0.7074215919202562,
  0.22979089018810173, 0.9337727817936804, 0.8891972650760605,
  0.029554783828776743, 0.39540959001045195, 0.861241411796942,
  0.4209989412969024, 0.15028373693927666, 0.8740951098704903,
  0.1161570949983961, 0.013404386802180257, 0.546060270708486,
  0.3153824698381028, 0.07769890920693034, 0.6615684650905433,
  0.022585395014869447, 0.8451589297017513, 0.8029995317020049,
  0.6643367472004452, 0.13576866557071765, 0.9195590162183106,
  0.833383282563101, 0.036072338853521235, 0.36239580263846205,
  0.6181289171352484, 0.6664769891864056, 0.23210510944467877,
  0.8919614019921367, 0.41369760657029364, 0.9448201527856924,
  0.6417930100123381, 0.577345910766451, 0.8565755053829971, 0.8170736484294908,
  0.07329179407680331, 0.8348694728421096,
];
function makeRandomMock() {
  let mock = jest.fn();
  for (const random of randoms) {
    mock = mock.mockReturnValueOnce(random);
  }
  return mock;
}

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
