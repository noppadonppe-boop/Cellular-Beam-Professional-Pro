import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "dist/server",
    lib: { entry: "worker/index.ts", formats: ["es"], fileName: () => "index.js" },
    rolldownOptions: { output: { codeSplitting: false } },
    minify: true,
  },
});
