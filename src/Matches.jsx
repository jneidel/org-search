import Match from "./Match";
import Filepath from "./Filepath";

function checkIfExclude( path ) {
  return !(
    path.match("/cache/") ||
      path.match("/.git/") ||
      path.match(/\.lock$/) ||
      path.match(/\.js$/) ||
      path.match("/css/") ||
      path.match("/html/") ||
      path.match("/js/") ||
      path.match("/accountability buddy/") ||
      path.match("/outlook emails/") ||
      path.match("package-lock.json$")
  );
}

function Matches({ file, matches, onFilterSegment, filterMode }) {
  const path = file.substring(1);

  if (!checkIfExclude(path)) return null;

  return (
    <>
      <div className="mb-6 p-4 text-left">
        <Filepath path={path} onFilterSegment={onFilterSegment} filterMode={filterMode} />

        {matches.map((match, index) =>
           (<Match match={match} key={index} />)
        )}
      </div>
      <hr className="my-6 border-zinc-500/30" />
    </>
  );
}

export default Matches;
