import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/nootone/",
  assetsInclude: ["**/*.ogg", "**/*.mp3"],
  // server: {
  //   proxy: {
  //     "/instruments": {
  //       target: "https://d2cq0goacowtde.cloudfront.net/nootone/",
  //       changeOrigin: true,
  //       rewrite: (path) => `https://d2cq0goacowtde.cloudfront.net/nootone/${path}`,
  //     },
  //   },
  // },
});
