const CATEGORY_COLOR = {
  '0_inbox': 'my-bright-red',
  '1_project': 'my-bright-green',
  '2_areas': 'my-blue',
  '3_resources': 'my-yellow',
  '4_archive': 'my-light-red',
};

function Filepath({ path, onFilterSegment, filterMode }) {
  const parts = path.split("/");
  const dirParts = parts.slice(0, -1);
  const dirPath = dirParts.join("/");
  const filename = parts[parts.length - 1].replace(/\.org$/, '');

  const categoryKeys = new Set(Object.keys(CATEGORY_COLOR));
  const categoryIndex = dirParts.findIndex(seg => categoryKeys.has(seg));
  const categorySeg = categoryIndex >= 0 ? dirParts[categoryIndex] : '';

  let baseColor = CATEGORY_COLOR[categorySeg];
  const isDesignPath = dirParts.includes('.design');
  if (isDesignPath && categorySeg === '1_project') {
    baseColor = 'my-magenta';
  }
  const bgClass = baseColor ? `bg-${baseColor}/15` : '';

  const handleClick = (seg) => {
    if (onFilterSegment) onFilterSegment(seg);
  };

  return (
    <div>
      <div className="font-mono text-lg text-my-white break-words" title={dirPath}>
        <span className={`inline-block rounded-sm px-2 py-0.5 break-words ${bgClass}`}>
          {dirParts.map((seg, index) => {
            let segColor = 'text-my-white';

            const isCategory = index === categoryIndex;
            if (seg === '.design') {
              segColor = 'text-my-magenta';
            } else if (isCategory && baseColor) {
              segColor = `text-${baseColor}`;
            }

            const label = (isCategory && CATEGORY_COLOR[seg])
              ? seg.replace(/^\d+_/, '')
              : seg;

            const hoverClass = filterMode === 'exclude'
              ? 'hover:line-through hover:decoration-my-bright-red hover:underline-offset-2 cursor-pointer'
              : 'hover:underline hover:decoration-my-yellow hover:underline-offset-2 cursor-pointer';

            return (
              <span key={index}>
                <span
                  className={`${segColor} ${hoverClass}`}
                  onClick={() => handleClick(seg)}
                  title={filterMode === 'exclude' ? 'Exclude this segment' : 'Filter by this segment'}
                >
                  {label}
                </span>
                {index < dirParts.length - 1 && (
                  <span className="px-1 text-my-white/30">/{'\u200b'}</span>
                )}
              </span>
            );
          })}
        </span>
      </div>
      <div className="text-blue-400 font-semibold break-words">{filename}</div>
    </div>
  );
}

export default Filepath;

