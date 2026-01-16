function Filepath({ path }) {
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  const dirPath = parts.slice(0, -1).join("/");
  const displayFilename = filename.replace(/\.org$/, '');

  return (
    <div>
      <div className="font-mono text-lg text-my-white truncate" title={dirPath}>{dirPath}</div>
      <div className="text-blue-400 font-semibold break-words">{displayFilename}</div>
    </div>
  )
}

export default Filepath
