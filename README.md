[![Build Status](https://travis-ci.org/flexport/reflective-bind.svg?branch=master)](https://travis-ci.org/flexport/reflective-bind)
[![codecov](https://codecov.io/gh/flexport/reflective-bind/branch/master/graph/badge.svg)](https://codecov.io/gh/flexport/reflective-bind)

# Reflective Bind

The `reflective-bind/babel` plugin enables you freely use inline arrow functions in the render method of React components without worrying about deoptimizing pure components.

## Motivation

Using inline functions (arrow functions and `Function.prototype.bind`) in render will [deoptimize pure child components]((https://flexport.engineering/optimizing-react-rendering-part-1-9634469dca02)). As a result, many React developers encourage you to [never use inline functions](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md) in your render function. However, others think that [avoiding them is premature optimization](https://cdb.reacttraining.com/react-inline-functions-and-performance-bdff784f5578). With reflective bind you can use inline functions and have optimized pure components.

## Installation

```
npm install --save reflective-bind
```

## Using the babel plugin

Add it to the top of your plugin list in `.babelrc` (just has to come before other plugins that transform arrow functions and `bind` calls):

```
"plugins": [
  "reflective-bind/babel",
  ...
]
```

And implement `shouldComponentUpdate` in your component:

```js
import {shouldComponentUpdate} from "reflective-bind";

class MyComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shouldComponentUpdate(this, nextProps, nextState);
  }
  ...
}
```

If you’re already using `React.PureComponent` and want to avoid updating all of your components, consider monkey patching `shouldComponentUpdate` 🙊

```js
import React from "react";
import {shouldComponentUpdate} from "reflective-bind";

React.PureComponent.prototype.shouldComponentUpdate = function(
  nextProps,
  nextState
) {
  return shouldComponentUpdate(this, nextProps, nextState);
};
```

If for some reason you want the babel plugin to skip processing a specific file, add the following to the file.

```js
// @no-reflective-bind-babel
```

### Dependencies
The babel plugin will add ES6 import declarations to your code. This shouldn’t be an issue if you’re using using `babel-preset-env` or `babel-preset-es2015`, but just make sure that some plugin/preset can transform the import declarations to your needs.

### What the plugin does

The plugin simply transforms inline functions into calls to `reflectiveBind`, and the `shouldComponentUpdate` helper function uses `reflectiveEqual` in the shallow comparison equality check.

## Using reflectiveBind manually

Binding your function with `reflectiveBind` simply stores the original function, the context (thisArg), and the args on the bound function instance. This allows you to check if two reflectively bound functions are equal.

```js
import reflectiveBind, {reflectiveEqual} from "reflective-bind";

function baseFn(msg) {
  alert(msg);
}

const fn1 = reflectiveBind(baseFn, undefined, "hello");
const fn2 = reflectiveBind(baseFn, undefined, "hello");

fn1 === fn2 // false
reflectiveEqual(fn1, fn2) // true

const fn3 = reflectiveBind(baseFn, undefined, "world");
reflectiveEqual(fn1, fn3) // false
```

Note that `reflectiveEqual` only works for reflectively bound functions.

```js
reflectiveEqual(1, 1) // false
reflectiveEqual(baseFn, baseFn) // false
```

We also expose a `isReflective` helper function that lets you check if something is a reflectively bound function.

### Flow types

All exported functions are flow typed out of the box. `reflectiveBind` is typed with function overloading:

```
// Function with 0 args
declare function reflectiveBind<A>(f: () => A, ctx: mixed): () => A;

// Function with 1 arg
declare function reflectiveBind<A, B>(f: (A) => B, ctx: mixed): A => B;

declare function reflectiveBind<A, B>(f: (A) => B, ctx: mixed, a: A): () => B;

...
```

We currently support `reflectiveBind` calls up to 4 args:

```js
reflectiveBind(baseFn, ctx, a, b, c, d);
```

## Babel plugin examples

The following examples of inline functions can all be transformed into calls to `reflectiveBind`:

```js
function MyComponent(props) {
  const msg = "Hello " + props.user.name.first;
  return <PureChild onClick={() => alert(msg)} />
}
```

```js
function MyComponent(props) {
  // Supports Function.prototype.bind
  const handleClick = props.callback.bind(undefined, "yay");
  return <PureChild onClick={handleClick} />
}
```

```js
function MyComponent(props) {
  // Supports multiple assignments / reassignments
  let handleClick = () => {...};
  
  if (...) {
      handleClick = () => {...};
  } else if (...) {
      handleClick = () => {...};
  }

  return <PureChild onClick={handleClick} />
}
```

```js
function MyComponent(props) {
  // Supports ternary expressions
  const handleClick = props.condition
    ? () => {...}
    : () => {...};

  return <PureChild onClick={handleClick} />
}
```

```js
class MyComponent extends React.Component {
  render() {
    // For class components, referencing `this.props.___` and `this.state.___`
    // from within your arrow function is supported, but we recommend you to
    // extract these references out to a const, especially if you are
    // accessing deeply nested attributes (e.g. `this.props.user.name.first`).
    
    // PureChild will re-render whenever `user` changes.
    const decentHandler = () => alert(this.props.user.name.first);
    
    // PureChild re-render ONLY when the first name changes.
    const firstName = this.props.user.name.first;
    const betterHandler = () => alert(firstName);
    
    return (
      <div>
        <PureChild onClick={decentHandler} />
        <PureChild onClick={betterHandler} />
      </div>
    );
  }
}
```

### Unsupported cases

There are a few edge cases that can cause an arrow function to not be transformed. Nothing breaks, you just won’t have optimized code.

- Your arrow function should not close over variables whose value is set after the arrow function.

```js
function MyComponent(props) {
  let foo = 1;
  
  const badHandleClick = () => {
    // Referencing `foo` will deopt since it is reassigned after
    // this arrow function.
    alert(foo);
  };
  
  foo = 2;

  return <PureChild onClick={badHandleClick} />
}
```

- Your arrow function must be defined inline the JSX, or at most 1 reference away.

```js
function MyComponent(props) {
  // This arrow function won't be optimized because `fn` is not referenced
  // in the JSX.
  const fn = () => {...};
  const badHandleClick = fn;
                    
  // This will be optimized since `goodHandleClick` is referenced in the JSX.
  const goodHandleClick = () => {...};
                    
  return (
    <div>
      <PureChild onClick={badHandleClick} />
      
      <PureChild onClick={goodHandleClick} />
      
      {/* This will be optimized since it is defined directly in the JSX */}
      <PureChild onClick={() => {...}} />
    </div>
  );
}
```

- For maximum optimization, avoid accessing nested attributes in your arrow function. Prefer to pull the values out to a const and close over it in your arrow function.

```js
function MyComponent(props) {
  
  const badHandleClick = () => {
    // Referencing nested attributes inside the arrow function will cause
    // PureChild to re-render whenever the outermost object changes. In this
    // case, `props` will change every render, which will cause PureChild to
    // always re-render.
    alert(props.user.name.first);
  };
  
  const firstName = props.user.name.first;
  const goodHandleClick = () => {
    // To avoid referencing nested attributes inside the arrow function,
    // simply extract it out to a const, and reference the const.
    alert(firstName);
  };
  
  return (
    <div>
      <PureChild onClick={badHandleClick} />
      <PureChild onClick={goodHandleClick} />
    </div>
  );
}
```
