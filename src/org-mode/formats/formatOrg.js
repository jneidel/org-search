import { labelWithoutExtension, formatOutput } from "./textFormats.js";

const toOrgHighlight = s => s.replaceAll("@@", "_").replaceAll("@/@", "_");

function formatHeadline(relativeFilename) {
  return labelWithoutExtension(relativeFilename);
}

async function formatOrg({ results, query, shouldIncludePath }) {
  return await formatOutput({ results, query, shouldIncludePath, formatHeadline, transformContentHighlights: toOrgHighlight });
}

export default formatOrg;
