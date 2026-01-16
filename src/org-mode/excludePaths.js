import fs from "node:fs";
import path from "node:path";

function loadExcludeRegexes(configPath = path.resolve(process.cwd(), "excludePaths.config.json")) {
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const patterns = JSON.parse(raw);
    return Array.isArray(patterns) ? patterns.map(p => new RegExp(p)) : [];
  } catch (_) {
    return [];
  }
}

export function createShouldIncludePathFromConfig(configPath) {
  const regexes = loadExcludeRegexes(configPath);
  
  return filepath => !regexes.some(rx => rx.test(filepath));
}
