import { useState, useEffect } from 'react';
import Matches from './Matches';
import queryElasticSearch from './queryElasticsearch';
import Filter from './Filter';

function App() {
  const [searchData, setSearchData] = useState(null);
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(window.location.search).get('query'));

  useEffect(() => {
    if (searchQuery) {
      history.pushState({ query: searchQuery }, searchQuery, "?query=" + searchQuery);
      queryElasticSearch(searchQuery).then(data => setSearchData(data));
    }
  }, [searchQuery]);

  const onChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <h1>Org Search</h1>
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
