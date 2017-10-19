// @flow

import * as React from "react";

(function() {
  function outer(constant: number) {
    let variable = 2;

    // Should not hoist because it references a non-constant identifier.
    const shouldNotHoist = () => {
      variable;
      return constant;
    };

    variable = 3;

    // Use in JSXExpressionContainer to enable hoisting
    <div onClick={shouldNotHoist} />;

    return shouldNotHoist();
  }

  return outer(1);
})();
