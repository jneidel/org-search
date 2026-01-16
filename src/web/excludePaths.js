import patterns from "../../excludePaths.config.json";

const regexPatterns = patterns.map((pattern) => new RegExp(pattern));

export function shouldIncludePath(path) {
  for (const matcher of regexPatterns) {
    if (matcher.test(path))
      return false;
  }
  return true;
}
