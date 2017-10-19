// @flow

import * as React from "react";

(function() {
  const Component = props => {};

  // Should add `Component` as a parameter to the hoisted function, but not
  // `div`.
  const hoistable = () => {
    <Component>
      <div>1</div>
    </Component>;
  };

  // Use in JSXExpressionContainer to enable hoisting
  <div onClick={hoistable} />;
})();
