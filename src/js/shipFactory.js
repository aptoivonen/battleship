import Ship from "./ship";

const shipLookupTable = {
  carrier: [5],
  battleship: [4],
  cruiser: [3],
  destroyer: [2],
  submarine: [1],
};
Object.setPrototypeOf(shipLookupTable, null);

const shipFactory = {
  create(type) {
    const constructorArguments = shipLookupTable[type];
    if (!constructorArguments) {
      throw new RangeError("no such ship type");
    }
    return new Ship(...constructorArguments);
  },
};

export default shipFactory;
