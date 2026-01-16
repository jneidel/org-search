import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import handleTextFormats from "./handleTextFormats.js";

const app = express();

app.get("/", handleTextFormats);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
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
