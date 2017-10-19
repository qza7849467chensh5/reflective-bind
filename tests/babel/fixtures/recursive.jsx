// @flow

import * as React from "react";

(function() {
  const shouldNotHoist = () => shouldNotHoist();

  // Use in JSXExpressionContainer to enable hoisting
  <div onClick={shouldNotHoist} />;
})();
