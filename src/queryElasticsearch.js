function buildQueries(searchString) {
  /* Query summary:
  - A content match is required
  - Exact matches are boosted above prefixes
  - Boost order (highest → lowest):
    file.filename (exact term >> wildcard contains) > path.virtual.fulltext (phrase >> prefix) > content (phrase >> prefix)
   */
  const words = searchString.split(/\s+/).filter(Boolean);
  const primaryQuery = {
    "fields": [
      {
        "field": "path.virtual.fulltext"
      }
    ],
    "size": 50,
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "query": {
      "bool": {
        "must": [
          {
            "constant_score": {
              "filter": {
                "bool": {
                  "should": [
                    { "match_phrase": { "content": { "query": searchString } } },
                    ...words.map(word => ({
                      "multi_match": {
                        "query": word,
                        "fields": ["content"],
                        "type": "phrase_prefix",
                        "lenient": true
                      }
                    }))
                  ],
                  "minimum_should_match": 1
                }
              }
            }
          }
        ],
        "should": [
          { "term": { "file.filename": { "value": searchString, "boost": 20 } } },
          ...words.filter(w => w.length >= 3).map(word => ({
            "wildcard": { "file.filename": { "value": `*${word}*`, "boost": 12, "case_insensitive": true } }
          })),
          { "match_phrase": { "path.virtual.fulltext": { "query": searchString, "boost": 2.5 } } },
          ...words.map(word => ({
            "multi_match": {
              "query": word,
              "fields": ["path.virtual.fulltext^2"],
              "type": "phrase_prefix",
              "boost": 1.5,
              "lenient": true
            }
          })),
          { "match_phrase": { "content": { "query": searchString, "boost": 0.5 } } },
          ...words.map(word => ({
            "multi_match": {
              "query": word,
              "fields": ["content"],
              "type": "phrase_prefix",
              "boost": 0.2,
              "lenient": true
            }
          }))
        ]
      }
    },
    "highlight": {
      "max_analyzed_offset": 1000000,
      "pre_tags": [
        "@@"
      ],
      "post_tags": [
        "@/@"
      ],
      "fields": {
        "content": {}
      }
    }
  };

  const fallbackQuery = {
    "fields": [
      {
        "field": "path.virtual.fulltext"
      }
    ],
    "size": 50,
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "query": {
      "bool": {
        "should": words.map(word => ({
          "multi_match": {
            "query": word,
            "fields": ["content"],
            "type": "phrase_prefix",
            "boost": 2,
            "lenient": true
          }
        })),
        "minimum_should_match": 1
      }
    },
    "highlight": {
      "max_analyzed_offset": 1000000,
      "pre_tags": [
        "@@"
      ],
      "post_tags": [
        "@/@"
      ],
      "fields": {
        "content": {}
      }
    }
  };

  return { primaryQuery, fallbackQuery };
}

function resolveElasticsearchHost() {
  const isNode = typeof window === "undefined";
  if (isNode) {
    return (process.env.ES_HOST);
  }
  if (import.meta.env && import.meta.env.DEV) {
    return "/es";
  }

  return (import.meta.env && import.meta.env.ES_HOST);
}
function resolveElasticsearchIndex() {
  return (typeof process !== 'undefined' && process.env?.ES_INDEX)
    || import.meta.env.ES_INDEX;
}

async function runQuery(query) {
  const esHost = resolveElasticsearchHost();
  const esIndex = resolveElasticsearchIndex();

  return fetch(`${esHost}/${esIndex}/_search`, {
    body: JSON.stringify(query),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then(r => r.json())
    .then(j => j?.hits?.hits || [])
    .catch(() => []);
}

async function queryElasticSearch(searchString) {
  const { primaryQuery, fallbackQuery } = buildQueries(searchString);

  const mapHits = hits => hits.map(hit => {
    const contentHighlights = hit?.highlight?.content || [];
    if (contentHighlights.length === 0)
      return null;
    
    return {
      file: hit.fields["path.virtual.fulltext"][0],
      matches: contentHighlights
    };
  }).filter(Boolean);

  let hits = await runQuery(primaryQuery);
  let data = mapHits(hits);
  if (!Array.isArray(data) || data.length === 0) {
    console.log("fallback");
    hits = await runQuery(fallbackQuery);
    data = mapHits(hits);
  }
  return data;
}

export async function queryLastChangedFile() {
  const query = {
    size: 1,
    sort: [
      { "file.indexing_date": { order: "desc" } }
    ],
    _source: [
      "file.filename",
      "file.indexing_date"
    ]
  };

  return runQuery(query)
    .then(hits => hits[0]?._source?.file)
    .then(({ filename, indexing_date }) => {
      const date = new Date(indexing_date);
      const secondsElapsed = Date.now() - date.getTime();

      if (secondsElapsed > 45*60*1000) { // 45 min
        return {};
      } else {
        const minutesAgo = Math.floor(secondsElapsed/60/1000) + " min ago";

        return {
          filename,
          minutesAgo
        };
      }
    });
}

export default queryElasticSearch;
