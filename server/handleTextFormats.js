import formatAnsi from "../src/org-mode/formats/formatAnsi.js";
import formatOrg from "../src/org-mode/formats/formatOrg.js";
import queryElasticSearch from "../src/queryElasticsearch.js";
import { createShouldIncludePathFromConfig } from "../src/org-mode/excludePaths.js";

async function handleTextFormats(req, res, next) {
  const shouldIncludePath = createShouldIncludePathFromConfig();
  
  try {
    if (!req.url)
      return next(); // react web app
          
    const url = new URL(req.url, "http://localhost");
    const query = url.searchParams.get("query");

    const format = url.searchParams.get("format");
    const wantsOrg = format === "org";
    const wantsAnsi = format === "ansi";
          
    const isGet = (req.method || "").toUpperCase() === "GET";
    if (!isGet || !(wantsOrg || wantsAnsi) || !query)
      return next(); // react web app

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");

    const results = await queryElasticSearch(query);
    if (!Array.isArray(results) || results.length === 0) {
      res.end(`* No matches for query "${query}"\n`);
      return;
    }

    const formatFunc = wantsAnsi ? formatAnsi : formatOrg;
    const responseText = await formatFunc({ results, query, shouldIncludePath });
    res.end(responseText);
  } catch (err) {
    res.statusCode = 500;
    res.end("Error generating org output.\n\n" + err + "\n");
  }
}

export default handleTextFormats;
