# monzod

## 0.3.0

### Minor Changes

- f9e55ab: add bson schema support for zod nullable and null types
- ee070c4: add bson schema support for zod dates
- 1004f95: add bson schema support for zod enums
- 4a3088b: add bson schema support for zod numbers
- 4636976: add bson schema support for zod array, tuple and set types
- 437fa92: add bson schema support for zod booleans

## 0.2.0

### Minor Changes

- 01f811b: improve readme to reflect the current state of the library
- 845a71b: add initial support for bson schema conversion

### Patch Changes

- f832e3a: fix `undefined` and `object` types being recognized as `ObjectId` types
- 8a3cc3c: add e2e tests
- 75bc136: extend readme to include installation, basic usage and mapping sections.
- af9e0c1: improve bson type validation to use injected metadata instead of instanceOf
- fc85ae8: update package.json to match the readme

## 0.1.2

### Patch Changes

- 13fe5ad: rename publish script to rename to prevent publishing before the package is built.

## 0.1.1

### Patch Changes

- 1e6d7af: fix package.json not including distribution files

## 0.1.0

### Minor Changes

- e995332: Add methods for mapping ObjectId fields to string, to make it easy to map entity schemas to dtos.
