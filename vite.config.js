import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function orgTextPlugin() {
  return {
    name: "org-text-endpoint",
    configureServer(server) {
      import("./server/handleTextFormats.js").then(m => {
        server.middlewares.use(m.default);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (!env.ES_HOST) {
    env.ES_HOST = "https://es.neidel.xyz";
  }
  if (!env.ES_INDEX) {
    env.ES_INDEX = "org";
  }
  if (!env.LOCAL_FILE_ROOT) {
    env.LOCAL_FILE_ROOT = "/home/jneidel/org";
  }

  if (!process.env.ES_HOST) {
    process.env.ES_HOST = env.ES_HOST;
  }
  if (!process.env.ES_INDEX) {
    process.env.ES_INDEX = env.ES_INDEX;
  }
  if (!process.env.LOCAL_FILE_ROOT) {
    process.env.LOCAL_FILE_ROOT = env.LOCAL_FILE_ROOT;
  }
  
  return {
    plugins: [
      react(),
      orgTextPlugin(),
    ],
    server: {
      proxy: {
        "/es": {
          target: env.ES_HOST,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/es/, ""),
          configure: proxy => {
            proxy.on("proxyReq", proxyReq => {
              try {
                if (typeof proxyReq.removeHeader === "function") {
                  proxyReq.removeHeader("origin");
                  proxyReq.removeHeader("referer");
                }
              } catch (_) {}
            });
          },
        },
      },
    },
    envPrefix: ["VITE_", "ES_", "LOCAL_"],
  };
});
