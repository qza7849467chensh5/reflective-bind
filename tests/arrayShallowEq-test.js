// @flow

import arrayShallowEq from "../src/arrayShallowEq";

describe("arrayShallowEq", () => {
  it("returns true for the same array", () => {
    const a = [1, 1];
    expect(arrayShallowEq(a, a)).toBe(true);
  });

  it("returns true for shallow equal array", () => {
    const a = [1, 1];
    const b = [1, 1];
    expect(arrayShallowEq(a, b)).toBe(true);
  });

  it("returns false for deeply equal array", () => {
    const a = [1, {foo: "bar"}];
    const b = [1, {foo: "bar"}];
    expect(arrayShallowEq(a, b)).toBe(false);
  });

  it("returns false for unequal arrays", () => {
    const a = [1];
    const b = [1, 1];
    expect(arrayShallowEq(a, b)).toBe(false);
  });
});
