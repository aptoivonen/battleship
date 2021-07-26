import ShipFactory from "./shipfactory";
import Ship from "./ship";

// common shipFactory for all tests
const shipFactory = new ShipFactory();

test("all ship types return a ship", () => {
  const carrier = shipFactory.create("carrier");
  const battleship = shipFactory.create("battleship");
  const cruiser = shipFactory.create("cruiser");
  const destroyer = shipFactory.create("destroyer");
  const submarine = shipFactory.create("submarine");
  expect(carrier).toEqual(expect.any(Ship));
  expect(battleship).toEqual(expect.any(Ship));
  expect(cruiser).toEqual(expect.any(Ship));
  expect(destroyer).toEqual(expect.any(Ship));
  expect(submarine).toEqual(expect.any(Ship));
});

test("wrong ship type throws RangeError", () => {
  expect(() => {
    shipFactory.create("nosuchship");
  }).toThrow(RangeError);
  expect(() => {
    shipFactory.create("nosuchship");
  }).toThrow("no such ship type");
});

describe("ship types have correct lengths", () => {
  test("carriers to have length 5", () => {
    const carrier = shipFactory.create("carrier");
    expect(carrier).toHaveLength(5);
  });

  test("battleships to have length 4", () => {
    const battleship = shipFactory.create("battleship");
    expect(battleship).toHaveLength(4);
  });

  test("cruisers to have length 3", () => {
    const cruiser = shipFactory.create("cruiser");
    expect(cruiser).toHaveLength(3);
  });

  test("destroyers to have length 2", () => {
    const destroyer = shipFactory.create("destroyer");
    expect(destroyer).toHaveLength(2);
  });

  test("submarines to have length 1", () => {
    const submarine = shipFactory.create("submarine");
    expect(submarine).toHaveLength(1);
  });
});
