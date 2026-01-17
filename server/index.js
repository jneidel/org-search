import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(projectRoot, ".env") });
const { default: handleTextFormats } = await import("./handleTextFormats.js"); // depends on env vars

const app = express();

app.get("/", handleTextFormats);

const distDir = path.resolve(projectRoot, "dist");
app.use(express.static(distDir));
app.get("/", (_, res) => { // react web app
  res.sendFile(path.join(distDir, "index.html"));
});

app.get("*", (_, res) => {
  res.sendStatus(404);
});

const port = Number(process.env.PORT || 4173);
console.log("Server started on http://localhost:" + port);
app.listen(port);
