// @flow

import * as React from "react";

(function() {
  let a = 1;

  // Should not hoist because it references a non-constant identifier.
  const shouldNotHoist = () => {
    return a;
  };

  a = 10;

  // Use in JSXExpressionContainer to enable hoisting
  <div onClick={shouldNotHoist} />;

  return shouldNotHoist();
})();
