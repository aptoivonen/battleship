import ShipFactory from "../shipfactory";
import Ship from "../ship";

// common shipFactory for all tests
const shipFactory = new ShipFactory();

describe("create", () => {
  test("all ship types with correct location and direction return a ship", () => {
    const carrier = shipFactory.create("carrier", [0, 0], "eastwards");
    const battleship = shipFactory.create("battleship", [0, 0], "eastwards");
    const cruiser = shipFactory.create("cruiser", [0, 0], "eastwards");
    const destroyer = shipFactory.create("destroyer", [0, 0], "eastwards");
    const submarine = shipFactory.create("submarine", [0, 0], "eastwards");
    expect(carrier).toEqual(expect.any(Ship));
    expect(battleship).toEqual(expect.any(Ship));
    expect(cruiser).toEqual(expect.any(Ship));
    expect(destroyer).toEqual(expect.any(Ship));
    expect(submarine).toEqual(expect.any(Ship));
  });

  test("wrong ship type throws RangeError", () => {
    expect(() => {
      shipFactory.create("nosuchship", [0, 0], "eastwards");
    }).toThrow(new RangeError("no such ship type"));
  });

  test("wrong direction throws RangeError", () => {
    expect(() => {
      shipFactory.create("carrier", [0, 0], "nosuchdirection");
    }).toThrow(new RangeError("no such ship direction"));
  });

  test("wrong location value throws TypeError", () => {
    expect(() => {
      shipFactory.create("carrier", null, "eastwards");
    }).toThrow(new TypeError("location must be an array x and y coordinates"));
  });

  test("positions go in the right direction", () => {
    const carrier = shipFactory.create("cruiser", [0, 0], "southwards");
    const { positions } = carrier;
    expect(positions[0]).toEqual([0, 0]);
    expect(positions[1]).toEqual([0, 1]);
    expect(positions[2]).toEqual([0, 2]);
  });

  describe("ship types have correct lengths", () => {
    test("carriers to have length 5", () => {
      const carrier = shipFactory.create("carrier", [0, 0], "eastwards");
      expect(carrier.positions).toHaveLength(5);
    });

    test("battleships to have length 4", () => {
      const battleship = shipFactory.create("battleship", [0, 0], "eastwards");
      expect(battleship.positions).toHaveLength(4);
    });

    test("cruisers to have length 3", () => {
      const cruiser = shipFactory.create("cruiser", [0, 0], "eastwards");
      expect(cruiser.positions).toHaveLength(3);
    });

    test("destroyers to have length 2", () => {
      const destroyer = shipFactory.create("destroyer", [0, 0], "eastwards");
      expect(destroyer.positions).toHaveLength(2);
    });

    test("submarines to have length 1", () => {
      const submarine = shipFactory.create("submarine", [0, 0], "eastwards");
      expect(submarine.positions).toHaveLength(1);
    });
  });
});
