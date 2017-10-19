// @flow

import shallowReflectiveEqual from "./shallowReflectiveEqual";

export default function shouldComponentUpdate(
  // Different versions of flow have different types for React components.
  // Using `any` to cover all of them, and just assume that a valid component
  // is provided.
  component: any,
  nextProps: {},
  nextState: {}
): boolean {
  return (
    !shallowReflectiveEqual(component.props, nextProps) ||
    !shallowReflectiveEqual(component.state, nextState)
  );
}
