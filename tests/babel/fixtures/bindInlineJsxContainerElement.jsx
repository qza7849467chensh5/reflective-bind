// @flow

import * as React from "react";

(function() {
  function foo() {}

  // Inline bind in JSXExpressionContainer should be converted.
  <div onClick={foo.bind(this)} />;
})();
