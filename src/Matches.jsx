import Filepath from './Filepath';
import Match from './Match';

function checkIfExclude( path ) {
  return !(
    path.match("/cache/") ||
      path.match("/.git/") ||
      path.match( /\.lock$/ ) ||
      path.match( /\.js$/ ) ||
      path.match("/css/") ||
      path.match("/html/") ||
      path.match("/js/") ||
      path.match("/accountability buddy/")
  )
}

function Matches({ file, matches }) {
  const path = file.substring(1);

  let orgSystem = "org";
  let category = path.split("/")[0];
  if (category === "mac_org" || category === "jobdirecto_org") {
    orgSystem = category;
    category = path.split("/")[1];
  }

  if ( checkIfExclude(path) ) {
    return (<>
      <div className='border-solid border-red-800 border-2 mb-6 p-4 rounded'>
        <Filepath path={path} category={category} />

        {matches.map((match, index) => {
          return (<Match match={match} key={index} />)
        })}
      </div>
    </>)
  }
}

export default Matches
