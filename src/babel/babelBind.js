// @flow

import reflectiveBind from "../reflectiveBind";

/**
 * The babel transform will turn any calls to x.bind(...args) to
 * babelBind(x, ...args). If x is a function, we want to do a reflective bind,
 * otherwise we want to "revert" it back to the previous x.bind(...args) call.
 */
export default function(x: any, ...args: any) {
  if (typeof x === "function" && x.bind === Function.prototype.bind) {
    return reflectiveBind(x, ...args);
  } else {
    return x.bind(...args);
  }
}
