import { resolve } from "node:path";
import { defineConfig } from "vite";

const pages = ["index.html", "connexion.html", "dashboard.html", "medecin.html"];

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? "/les-ptits-anges-an-o-test/" : "/",
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page.replace(".html", ""), resolve(import.meta.dirname, page)])
      )
    }
  }
});
