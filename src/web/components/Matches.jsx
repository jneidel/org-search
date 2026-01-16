import Match from "./Match";
import Filepath from "./Filepath";
import { shouldIncludePath } from "../excludePaths";

function Matches({ file, matches, onFilterSegment, filterMode }) {
  const path = file.substring(1);

  if (!shouldIncludePath(path)) return null;

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

