import { defineConfig } from "vite";

// Static site; root is the project folder, assets served from /assets and /src.
export default defineConfig({
  root: ".",
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: "dist",
    target: "es2020",
  },
});
