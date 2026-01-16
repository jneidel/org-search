# Org Search

> search for my note-taking system

This app provides a way do a full-text search over my whole note-taking system instantly.
The search is powered by an Elasticsearch that gets populated by [fscrawler](https://github.com/dadoonet/fscrawler) which ingests all of my org-mode notes, PDFs and more.

By default you get serve a react app web interface:

![Search screen with normal result](./docs/result.png)

This search can be narrowed down with include and exclude filters:

![Search screen with path exclusion](./docs/exclude.png)

![Search screen with path inclusion](./docs/include.png)

If you pass `?format=org` and a `&query=..` you get the same output formatted in org-mode:

![Output formatted as org-mode](./docs/format-org.png)

If you pass `?format=ansi` and a `&query=..` you get a colorized version of the org-mode output:

![Output formatted as colorized org-mode](./docs/format-ansi-detail.png)

![Output formatted as colorized org-mode](./docs/format-ansi-overview.png)

Write it to a file:
```sh
curl -Ss "http://localhost:5173/?query=query&format=ansi" >org-search.org
```

And evaluate this elisp snippet to colorize the current buffer:
```elisp
(require 'ansi-color)
(ansi-color-apply-on-region (point-min) (point-max))
```

## Stack

- React for the web UI
- Tailwind for styling
- Vite as the server and transpiler
- Elasticsearch as the search index
- [fscrawler](https://github.com/dadoonet/fscrawler) for indexing my file system of notes for Elasticsearch
- (kibana for managing Elasticsearch)

## Configuration
### Elasticsearch

To setup CORS with elasticsearch I had to add this configuration to my es
docker compose file:

```
- http.cors.enabled=true
- http.cors.allow-origin=https://org-search.neidel.xyz
- http.cors.allow-credentials=true
- http.cors.allow-headers=X-Requested-With,Content-Type,Content-Length,Authorization
- http.cors.allow-methods=OPTIONS,HEAD,GET,POST,PUT,DELETE
```

Because I'm not using authentication on my local network I also have:

```
- xpack.security.enabled=false
```

### Excluded paths

Paths that should never be matched can be configured in `excludePaths.config.json`.
Each entry is a JavaScript `RegExp` pattern to be excluded.
