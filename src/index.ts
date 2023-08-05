import * as types from "./types";
export * from "./types";

import * as convert from "./convert";
export * from "./convert";

export const mz = {
  ...types,
  ...convert,
};
