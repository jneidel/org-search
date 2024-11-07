function Match({ match }) {
  let htmlOutput = match.replace(/{(https?:\/\/.+)}\[(.+)]/, "<a href='$1' target=_blank>$2</a>")
    .replace(/(href='.+)@@(.+)@\/@(.+')/, "$1$2$3")
    // .replace(/\[(.+)]\((https?:\/\/[^\)]+\))/, "<a href='$2'>$1</a>")

  return (<>
    <p className="my-1"
      dangerouslySetInnerHTML={{ __html: htmlOutput
        .replaceAll("@@", "<span class='px-1 bg-amber-400 text-zinc-950'>")
        .replaceAll("@/@", "</span>")
      }}>
    </p>
  </>)
}

export default Match
