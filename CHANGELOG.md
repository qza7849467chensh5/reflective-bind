# Reflective Bind Change Log

All notable changes to this project will be documented in this file.

## Unreleased

## 0.2.4
* Bump js-yaml from 3.10.0 to 3.14.0
* Bump handlebars from 4.0.12 to 4.7.6
* Bump sshpk from 1.13.1 to 1.16.1
* Bump diff from 3.4.0 to 3.5.0
* Bump lodash from 4.17.4 to 4.17.19
* Bump mixin-deep from 1.3.1 to 1.3.2
* Bump merge from 1.2.0 to 1.2.1

## 0.2.3
* Don't hoist handle non-computed object property identifiers

## 0.2.2
* Upgrade to babel 7
* Fix hanging `babelBind` identifier from babel 7 upgrade (https://github.com/flexport/reflective-bind/issues/26)

## 0.2.1
* Fix hanging identifiers when applying the lodash babel plugin after this plugin

## 0.2.0
* Better handling of duplicate hoisted function arguments
* Publish shallowReflectiveEqual

## 0.1.0
* Add "propRegex" option to only transform matching prop names.

## 0.0.4

* Add "log" option to log general transform info and warnings.
* Log info about which inline functions are transformed.
* Log warnings about sub-optimial code and how to fix it.
* Don't transform inline functions on `ref` prop.
* Don't transform arrow functions defined at the top level.
* Don't transform `fn[bind](...)`
* Use reflective equality when comparing reflectively bound arguments.
* Don't transform functions referencing a variable that is re-assigned in a
  different function.

## 0.0.3

* Support non-constant reference in arrow function as long as there is no
  reassignment to the variable after the arrow function.
* Don't transform inline functions on JSX html literals.

## 0.0.2

Initial release
