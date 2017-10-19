// @flow

import babelBind from "../../src/babel/babelBind";
import {isReflective} from "../../src";

describe("babelBind", () => {
  it("calls reflective bind for normal functions", () => {
    function foo() {}
    const result = babelBind(foo, null);
    expect(isReflective(result)).toBe(true);
  });

  it("calls custom bind function if bind has been overriden", () => {
    function foo() {}
    (foo: any).bind = (...args: any) => 1;
    const result = babelBind(foo, null);
    expect(isReflective(result)).toBe(false);
    expect(result).toBe(1);
  });

  it("calls custom bind function for non-functions", () => {
    const foo = {
      bind: (...args: any) => 1,
    };
    const result = babelBind(foo, null);
    expect(isReflective(result)).toBe(false);
    expect(result).toBe(1);
  });

  it("calls custom bind function for classes", () => {
    class Foo {
      bind(...args: any) {
        return 1;
      }
    }
    const result = babelBind(new Foo(), null);
    expect(isReflective(result)).toBe(false);
    expect(result).toBe(1);
  });
});
