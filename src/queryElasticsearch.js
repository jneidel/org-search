async function queryElasticSearch(searchString) {
  // query notes: https://chatgpt.com/c/672ce793-a0c4-800c-a1c9-1905a8d4817d
  const query = {
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
        "should": searchString.split( ).map(word => (
          {
            "multi_match": {
              "query": word,
              "fields": ["content"],
              "type": "phrase_prefix",
              "boost": 2
            }
          }
        )),
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
        "*": {}
      }
    }
  };

  // "https://es.neidel.xyz/org_ngram/_search"
  const data = await fetch("https://es.neidel.xyz/org/_search", {
    method: "POST",
    mode: "cors",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  }).then(res => res.json())
    .then(data => data.hits.hits)
    .then(hits => hits.map(hit => {
      return {
        file: hit.fields["path.virtual.fulltext"][0],
        matches: hit.highlight.content,
      }
    }))

  return data;
}

export default queryElasticSearch;
