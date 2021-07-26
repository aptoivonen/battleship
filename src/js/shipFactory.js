import Ship from "./ship";
import shipLookupTable from "./shiplookuptable";

class ShipFactory {
  create(type) {
    const constructorArguments = shipLookupTable[type];
    if (!constructorArguments) {
      throw new RangeError("no such ship type");
    }
    return new Ship(...constructorArguments);
  }
}

export default ShipFactory;
