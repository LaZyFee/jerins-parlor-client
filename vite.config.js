export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        "/api/": {
          target: env.VITE_API_BASE_URL || "http://localhost:5000", // Backend URL
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