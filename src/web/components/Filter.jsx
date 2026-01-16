import { useState } from 'react';

function Filter({ data, children }) {
  const [activeSegments, setActiveSegments] = useState([]);
  const [filterMode, setFilterMode] = useState('include');

  const addFilterSegment = (segment) => {
    setActiveSegments(previous => previous.includes(segment) ? previous : [...previous, segment]);
  };

  const removeFilterSegment = (segment) => {
    setActiveSegments(previous => previous.filter(s => s !== segment));
  };

  const clearAllFilters = () => {
    setActiveSegments([]);
  };

  const segmentLabel = (segment) => segment.replace(/^\d+_/, '');

  const matchesSegment = (file, segment) => {
    return file.includes(`/${segment}/`);
  };

  const filteredData = Array.isArray(data) && activeSegments.length > 0
    ? data.filter(item => (
        filterMode === 'include'
          ? activeSegments.every(seg => matchesSegment(item.file, seg))  // include
          : activeSegments.every(seg => !matchesSegment(item.file, seg)) // exclude
    ))
    : data;

  return (
    <>
      {activeSegments.length > 0 && (
        <div className="mb-4 text-left">
          <div className="mb-2 text-sm text-my-white/80">Active {filterMode === "include" ? "filters" : "exclusions"}</div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {activeSegments.map(segment => (
                <button
                  key={segment}
                  onClick={() => removeFilterSegment(segment)}
                  className={`px-2 py-1 rounded-sm cursor-pointer ${
                    filterMode === 'include'
                      ? 'bg-my-blue/15 text-my-blue hover:bg-my-blue/25'
                      : 'bg-my-bright-red/15 text-my-bright-red hover:bg-my-bright-red/25'
                  }`}
                  title="Remove filter"
                >
                  {segmentLabel(segment)} ×
                </button>
              ))}
              <button
                onClick={clearAllFilters}
                className="px-2 py-1 rounded-sm bg-my-grey/40 text-my-white/80 hover:bg-my-grey/60 cursor-pointer"
                title="Clear all filters"
              >
                Clear all
              </button>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => setFilterMode(mode => mode === 'include' ? 'exclude' : 'include')}
                className={`px-3 py-1 rounded-sm cursor-pointer ${
                  filterMode === 'include'
                    ? 'bg-my-blue/15 text-my-blue hover:bg-my-blue/25'
                    : 'bg-my-bright-red/15 text-my-bright-red hover:bg-my-bright-red/25'
                }`}
                title="Toggle include/exclude mode"
              >
                {filterMode === 'include' ? 'Include' : 'Exclude'}
              </button>
            </div>
          </div>
        </div>
      )}

      {typeof children === 'function' ? children({
        filteredData,
        onFilterSegment: addFilterSegment,
        filterMode,
      }) : null}
    </>
  );
}

export default Filter;

