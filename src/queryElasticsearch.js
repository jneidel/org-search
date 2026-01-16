async function queryElasticSearch(searchString) {
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

  const ES_BASE = import.meta.env.DEV ? "/es" : "https://es.neidel.xyz";
  const runQuery = async q => fetch(`${ES_BASE}/org/_search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(q),
  }).then(res => res.json())
    .then(data => data.hits.hits)
    .then(hits => hits.map(hit => {
      const contentHighlights = hit?.highlight?.content ?? [];
      if (contentHighlights.length === 0)
        return null;

      return {
        file: hit.fields["path.virtual.fulltext"][0],
        matches: contentHighlights
      };
    }).filter(Boolean))
    .catch(() => []);

  let data = await runQuery(primaryQuery);
  if (!Array.isArray(data) || data.length === 0) {
    data = await runQuery(fallbackQuery);
  }
  return data;
}

export default queryElasticSearch;
