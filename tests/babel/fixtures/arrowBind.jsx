// @flow

import * as React from "react";

(function() {
  const hoistable = (a, b, c) => a + b + c;

  // Use in JSXExpressionContainer to enable hoisting
  <div onClick={hoistable} />;

  return hoistable
    .bind(null, 1)
    .bind(null, 2)
    .bind(null, 3)();
})();
