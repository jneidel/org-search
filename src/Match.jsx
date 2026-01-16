function Match({ match }) {
  let htmlOutput = match.replace(/{(https?:\/\/.+)}\[(.+)]/, "<a href='$1' target=_blank>$2</a>")
    .replace(/(href='.+)@@(.+)@\/@(.+')/, "$1$2$3")
    // .replace(/\[(.+)]\((https?:\/\/[^\)]+\))/, "<a href='$2'>$1</a>")

  return (<>
    <p className={`my-1 text-my-white/80`}
      dangerouslySetInnerHTML={{ __html: htmlOutput
        .replaceAll("@@", "<span class='underline decoration-my-yellow decoration-2 underline-offset-2'>")
        .replaceAll("@/@", "</span>")
      }}>
    </p>
  </>)
}

export default Match
