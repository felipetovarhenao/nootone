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
  //       target: "https://dxbtnxd6vjk30.cloudfront.net/",
  //       changeOrigin: true,
  //       rewrite: (path) => `https://dxbtnxd6vjk30.cloudfront.net/${path}`,
  //     },
  //   },
  // },
});
