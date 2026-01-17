import { labelWithoutExtension, formatOutput } from "./textFormats.js";

const COLORS = {
  grey: 234,
  white: 252,
  blue: 26,
  brightGreen: 47,
  lightRed: 203,
  brightRed: 160,
  yellow: 220,
  magenta: 197,
};

const CATEGORY_COLOR = {
  '0_inbox': { fg: COLORS.white, bg: COLORS.brightRed },
  '1_project': { fg: COLORS.grey, bg: COLORS.brightGreen },
  '2_areas': { fg: COLORS.white, bg: COLORS.blue },
  '3_resources': { fg: COLORS.grey, bg: COLORS.yellow },
  '4_archive': { fg: COLORS.grey, bg: COLORS.lightRed },
};

const ANSI = {
  reset: "\u001b[0m",
  fgGrey256: `\u001b[38;5;${COLORS.grey}m`,
  bgYellow256: `\u001b[48;5;${COLORS.yellow}m`,
};

const toAnsiHighlight = s => s
  .replaceAll("@@", `${ANSI.fgGrey256}${ANSI.bgYellow256}`)
  .replaceAll("@/@", ANSI.reset);

const colorizeHeadline = (relativePath) => {
  const segments = relativePath.split("/");
  const dirParts = segments.slice(0, -1);
  const categoryKeys = new Set(Object.keys(CATEGORY_COLOR));
  const categoryIndex = dirParts.findIndex(seg => categoryKeys.has(seg));
  const categorySeg = categoryIndex >= 0 ? dirParts[categoryIndex] : '';
  let color = categorySeg ? CATEGORY_COLOR[categorySeg] : null;
  const isDesignPath = dirParts.includes('.design');
  if (isDesignPath && categorySeg === '1_project') {
    color = { fg: COLORS.grey, bg: COLORS.magenta };
  }

  const headlinePlain = labelWithoutExtension(relativePath);
  if (!color)
    return headlinePlain;
  
  return `\u001b[38;5;${color.fg}m\u001b[48;5;${color.bg}m${headlinePlain}${ANSI.reset}`;
};

function formatHeadline(relativeFilename) {
  return colorizeHeadline(relativeFilename);
}

async function formatAnsi({ results, query, shouldIncludePath }) {
  return await formatOutput({ results, query, shouldIncludePath, formatHeadline, transformContentHighlights: toAnsiHighlight });
}

export default formatAnsi;
