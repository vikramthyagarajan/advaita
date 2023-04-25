import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    build: {
      outDir: "dist",
    },
    server: {
      port: 3000,
    },
    plugins: [react(), viteTsconfigPaths()],
  };
});
