// @flow

// Originally copied from
// https://github.com/facebook/fbjs/blob/v0.8.16/src/core/__tests__/shallowEqual-test.js

import reflectiveBind, {reflectiveEqual} from "../src";
import shallowReflectiveEqual from "../src/shallowReflectiveEqual";

describe("shallowReflectiveEqual", () => {
  it("returns false if either argument is null", () => {
    expect(shallowReflectiveEqual(null, {})).toBe(false);
    expect(shallowReflectiveEqual({}, null)).toBe(false);
  });

  it("returns true if both arguments are null or undefined", () => {
    expect(shallowReflectiveEqual(null, null)).toBe(true);
    expect(shallowReflectiveEqual(undefined, undefined)).toBe(true);
  });

  it("returns true if arguments are not objects and are equal", () => {
    expect(shallowReflectiveEqual(1, 1)).toBe(true);
  });

  it("returns true if arguments are shallow equal", () => {
    expect(shallowReflectiveEqual({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3})).toBe(
      true
    );
  });

  it("returns true when comparing NaN", () => {
    expect(shallowReflectiveEqual(NaN, NaN)).toBe(true);

    expect(
      shallowReflectiveEqual(
        {a: 1, b: 2, c: 3, d: NaN},
        {a: 1, b: 2, c: 3, d: NaN}
      )
    ).toBe(true);
  });

  it("returns false if arguments are not objects and not equal", () => {
    expect(shallowReflectiveEqual(1, 2)).toBe(false);
  });

  it("returns false if only one argument is not an object", () => {
    expect(shallowReflectiveEqual(1, {})).toBe(false);
  });

  it("returns false if first argument has too many keys", () => {
    expect(shallowReflectiveEqual({a: 1, b: 2, c: 3}, {a: 1, b: 2})).toBe(
      false
    );
  });

  it("returns false if second argument has too many keys", () => {
    expect(shallowReflectiveEqual({a: 1, b: 2}, {a: 1, b: 2, c: 3})).toBe(
      false
    );
  });

  it("returns false if arguments are not shallow equal", () => {
    function foo(bar) {}
    const fn1 = reflectiveBind(foo, null, 1);
    const fn2 = reflectiveBind(foo, null, 2);
    expect(reflectiveEqual(fn1, fn2)).toBe(false);
    expect(
      shallowReflectiveEqual({a: 1, b: fn1, c: {}}, {a: 1, b: fn2, c: {}})
    ).toBe(false);
  });

  it("returns true if an attribute is reflectively, but not strictly, equal", () => {
    function foo(bar) {}
    const fn1 = reflectiveBind(foo, null, 1);
    const fn2 = reflectiveBind(foo, null, 1);
    expect(reflectiveEqual(fn1, fn2)).toBe(true);
    expect(
      shallowReflectiveEqual({a: 1, b: fn1, c: {}}, {a: 1, b: fn2, c: {}})
    ).toBe(false);
  });
});
