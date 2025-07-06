import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: "gzip",
    }),
  ],
  esbuild: {
    drop: ["console", "debugger"],
  },
  server: {
    open: true,
  },
});
