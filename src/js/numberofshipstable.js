const numberOfShipsTable = {
  carrier: 1,
  battleship: 2,
  cruiser: 3,
  destroyer: 4,
  submarine: 5,
};
Object.setPrototypeOf(numberOfShipsTable, null);
Object.freeze(numberOfShipsTable);

export default numberOfShipsTable;
