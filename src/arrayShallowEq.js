// @flow

export default function arrayShallowEq(a: Array<mixed>, b: Array<mixed>) {
  if (a === b) {
    return true;
  }

  if (a.length === b.length) {
    for (let i = 0, n = a.length; i < n; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
}
