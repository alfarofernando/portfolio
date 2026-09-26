import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

const githubPagesSpaFallback = () => {
  let outputDirectory;

  return {
    name: "github-pages-spa-fallback",
    apply: "build",
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      copyFileSync(resolve(outputDirectory, "index.html"), resolve(outputDirectory, "404.html"));
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), githubPagesSpaFallback()],
  base: "/portfolio/",
});
