import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    dir: "src",
    coverage: {
      reporter: ['text', 'html', 'clover', 'json', 'lcov'],
    }
  },
});
