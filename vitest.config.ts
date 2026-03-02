import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.tsx", "src/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html"],
      exclude: ["src/app/**", "src/components/**"],
    },
  },
});
