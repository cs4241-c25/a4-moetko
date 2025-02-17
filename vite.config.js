import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: "https://a4-moetko.vercel.app",
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
});
