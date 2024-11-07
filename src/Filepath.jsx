function Filepath({ path, category }) {
  const filename = path.split("/")[path.split("/").length-1];
  const middleParts = path.split("/").slice(1, path.split("/").length-1).join("/");

  return (
    <>
      <span
        className='mb-2 align-middle'>
        <p className="inline">{category}</p>
        { middleParts ? <p className="text-xs px-1 inline-block align-middle">/ {middleParts.replaceAll("/", " / ")} /</p> : " / " }
        <p className="inline">{filename}</p>
      </span>
      <button className="px-2 py-1 text-sm bg-red-800 hover:text-zinc-950 hover:border-amber-400 rounded-md mx-2"
        onClick={() => {navigator.clipboard.writeText("$ORG/" + path)}}>
        file</button>
      <button className="px-2 py-1 text-sm bg-red-800 hover:text-zinc-950 hover:border-amber-400 rounded-md"
        onClick={() => {navigator.clipboard.writeText(path.split("/").slice(0, -1).join("/"))}}>
        dir</button>
    </>
  )
}

export default Filepath
