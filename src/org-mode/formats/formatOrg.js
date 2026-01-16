import { labelWithoutExtension, formatOutput } from "./textFormats.js";

const toOrgHighlight = s => s.replaceAll("@@", "_").replaceAll("@/@", "_");

function formatHeadline(relativeFilename) {
  return labelWithoutExtension(relativeFilename);
}

function formatOrg({ results, query, shouldIncludePath }) {
  return formatOutput({ results, query, shouldIncludePath, formatHeadline, transformContentHighlights: toOrgHighlight });
}

export default formatOrg;
