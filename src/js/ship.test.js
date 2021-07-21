import { expect } from "@jest/globals";
import Ship from "./ship";

test("ship has correct length after creation", () => {
  const result = new Ship(5);
  expect(result).toHaveLength(5);
});

test("ship does not start the game sunk", () => {
  const result = new Ship(5).isSunk();
  expect(result).toEqual(expect.any(Boolean));
  expect(result).toBe(false);
});

test("ship is sunk after correct hits", () => {
  const ship = new Ship(3);
  ship.hit(0);
  ship.hit(1);
  ship.hit(2);
  const result = ship.isSunk();
  expect(result).toEqual(expect.any(Boolean));
  expect(result).toBe(true);
});

test("ship is not sunk after too few hits", () => {
  const ship = new Ship(3);
  ship.hit(0);
  ship.hit(1);
  const result = ship.isSunk();
  expect(result).toEqual(expect.any(Boolean));
  expect(result).toBe(false);
});

test("ship is not sunk after hits in the same place", () => {
  const ship = new Ship(3);
  ship.hit(0);
  ship.hit(0);
  ship.hit(0);
  const result = ship.isSunk();
  expect(result).toEqual(expect.any(Boolean));
  expect(result).toBe(false);
});

test("ship is not sunk after a hit outside its length", () => {
  const ship = new Ship(3);
  ship.hit(0);
  ship.hit(1);
  ship.hit(3);
  const result = ship.isSunk();
  expect(result).toEqual(expect.any(Boolean));
  expect(result).toBe(false);
});
