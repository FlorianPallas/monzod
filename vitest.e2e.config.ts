import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    dir: "test/e2e",
    setupFiles: ["./test/e2e/index.ts"],
  },
});
