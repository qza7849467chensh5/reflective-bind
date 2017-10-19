// @flow

(function() {
  jest.mock("foo", () => {
    // eslint-disable-next-line no-unused-vars
    const shouldNotHoist = () => {};
  });

  jest.mock("foo", function() {
    // eslint-disable-next-line no-unused-vars
    const shouldNotHoist = () => {};
  });
})();
