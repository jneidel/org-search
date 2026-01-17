import { useState, useEffect } from "react";
import Matches from "./Matches";
import queryElasticSearch, { queryLastChangedFile } from "../../queryElasticsearch";
import Filter from "./Filter";

function App() {
  const [searchData, setSearchData] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const [searchQuery, setSearchQuery] = useState(params.get("query"));

  useEffect(() => {
    if (!searchQuery) return;

    const nextParams = new URLSearchParams();
    nextParams.set("query", searchQuery);
    history.pushState({ query: searchQuery }, searchQuery, `?${nextParams.toString()}`);

    queryElasticSearch(searchQuery).then(data => setSearchData(data));
  }, [searchQuery]);

  const onChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const [lastChanged, setLastChanged] = useState(null);
  useEffect(() => {
    queryLastChangedFile().then(file => setLastChanged(file));
  }, []);

  return (
    <>
      <h1>Org Search</h1>

      {lastChanged && lastChanged.filename && lastChanged.minutesAgo && (
        <div className="text-xs text-gray-400 mt-4 mb-1">
          {`Most recent change: "${lastChanged.filename}" ${lastChanged.minutesAgo}`}
        </div>
      )}

      <input
        autoFocus
        value={searchQuery}
        onChange={onChange}
        type="text"
        className="m-4 p-2 text-xl"
        tabIndex="1"
      />

      <Filter data={searchData}>
        {({ filteredData, onFilterSegment, filterMode }) => (
          <>
            {filteredData && (
              filteredData.map((result, index) => {
                const { file, matches } = result;

                return (
                  <Matches
                    file={file}
                    matches={matches}
                    key={index}
                    onFilterSegment={onFilterSegment}
                    filterMode={filterMode}
                  />
                );
              })
            )}
          </>
        )}
      </Filter>
    </>
  );
}

export default App;
