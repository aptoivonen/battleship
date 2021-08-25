import Ship from "./ship";

const shipLookupTable = {
  carrier: { length: 5 },
  battleship: { length: 4 },
  cruiser: { length: 3 },
  destroyer: { length: 2 },
  submarine: { length: 1 },
};
Object.setPrototypeOf(shipLookupTable, null);
Object.freeze(shipLookupTable);

const directionLookupTable = {
  northwards: ([locationX, locationY], index) => [locationX, locationY - index],
  eastwards: ([locationX, locationY], index) => [locationX + index, locationY],
  southwards: ([locationX, locationY], index) => [locationX, locationY + index],
  westwards: ([locationX, locationY], index) => [locationX - index, locationY],
};
Object.setPrototypeOf(directionLookupTable, null);

function generatePositions(location, shipLength, directionFunction) {
  const positions = [];
  for (let i = 0; i < shipLength; i++) {
    positions.push(directionFunction(location, i));
  }
  return positions;
}

class ShipFactory {
  create(type, location, direction) {
    if (!(type in shipLookupTable)) {
      throw new RangeError("no such ship type");
    }
    if (!location || !Array.isArray(location)) {
      throw new TypeError("location must be an array x and y coordinates");
    }
    if (!(direction in directionLookupTable)) {
      throw new RangeError("no such ship direction");
    }
    const shipLength = shipLookupTable[type].length;
    const directionFunction = directionLookupTable[direction];
    const positions = generatePositions(
      location,
      shipLength,
      directionFunction
    );
    return new Ship(positions);
  }
}

export default ShipFactory;
