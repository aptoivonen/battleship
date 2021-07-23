const shipLookupTable = {
  carrier: [5],
  battleship: [4],
  cruiser: [3],
  destroyer: [2],
  submarine: [1],
};
Object.setPrototypeOf(shipLookupTable, null);
Object.freeze(shipLookupTable);

export default shipLookupTable;
