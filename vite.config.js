import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        "/api/": {
          target: "https://jerins-parlour-server-gamma.vercel.app", // Backend URL
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      https: false,
    },
    build: {
      sourcemap: env.NODE_ENV !== "production",
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            daisyui: ["daisyui"],
          },
        },
      },
    },
    plugins: [react()],
  };
});
