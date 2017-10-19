// @flow

// NOTE: restricting the transform to only JSXExpressionContainer makes this
// test obsolete, but it is a good test case to have if we decide to loosen up
// the restrictions on which arrow functions we transform.

(function() {
  const obj = {
    foo() {
      return () => this.value;
    },
    value: 1,
  };

  const ignoreThisCtx = {value: 10};
  const test = obj.foo().bind(ignoreThisCtx);

  return test();
})();
