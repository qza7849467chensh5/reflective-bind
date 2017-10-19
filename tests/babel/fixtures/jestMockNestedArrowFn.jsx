// @flow

import * as React from "react";

(function() {
  jest.mock("foo", () => {
    // eslint-disable-next-line no-unused-vars
    const shouldNotHoist = () => {};
    <div onClick={shouldNotHoist} />;
  });
})();
