// @flow

(function() {
  // Should not hoist any of these arrow functions.
  [].map(a => {
    return () => a;
  });
})();
