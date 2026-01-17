const localFileRoot = (typeof process !== 'undefined' && process.env.LOCAL_FILE_ROOT)
  || import.meta.env.LOCAL_FILE_ROOT;

export const toRelativePath = p => (typeof p === "string" && p.startsWith("/")) ? p.slice(1) : p;

export const sanitizeHeadingsToEmphasis = s => s
  .split(/\r?\n/)
  .map(line => line.replace(/^(\*+)\s*(.+)$/, (_m, _stars, rest) => `*${rest}*`))
  .join("\n");

export function srcLanguageForPath(path) {
  const m = path.match(/\.([^.\/]+)$/);
  const ext = m ? m[1].toLowerCase() : "";
  const map = {
    org: "org",
    md: "markdown",
    markdown: "markdown",
    txt: "text",
    js: "js",
    jsx: "js",
    ts: "ts",
    tsx: "ts",
    json: "json",
    sh: "sh",
    bash: "bash",
    zsh: "sh",
    py: "python",
    rb: "ruby",
    go: "go",
    rs: "rust",
    java: "java",
    kt: "kotlin",
    css: "css",
    scss: "scss",
    html: "html",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    ini: "conf",
    conf: "conf",
    sql: "sql",
  };
  return map[ext] || "text";
}

export const labelWithoutExtension = p => {
  const parts = p.split("/");
  const last = parts.pop() || "";
  const withoutExt = last.replace(/\.[^./]+$/, "");
  return [...parts, withoutExt].join("/");
};

export function formatOutput({ results, query, shouldIncludePath, formatHeadline, transformContentHighlights }) {
  const output = [];
  if (query)
    output.push(`* Results for "${query}"`);

  results
    .filter(({ file }) => !!shouldIncludePath ? shouldIncludePath(file) : true)
    .forEach(({ file, matches }) => {
      const relativePath = toRelativePath(file);
      const headline = `** [[file:${localFileRoot}/${relativePath}][${formatHeadline(relativePath)}]]`;
      output.push(headline);

      const language = srcLanguageForPath(file);
      output.push(`#+begin_src ${language}`);
    
      (matches || []).forEach(m => {
        const content = sanitizeHeadingsToEmphasis(
          transformContentHighlights(m)
        );
        output.push(content);
      });
    
      output.push("#+end_src\n");
    });

  return output.join("\n");
}
