# Org Search

> Full-text search for my note-taking system. Web and Emacs frontends.

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

You can write it to a file:
```sh
curl -Ss "http://localhost:5173/?query=query&format=ansi" >org-search.org
```

Or use this elisp function to query you and open the colorized results in Emacs (with clickable links.)
```elisp
(defun org-search (query)
  "Full-text search whole my note-taking system through https://org-search.neidel.xyz
Results are formatted in a colorized org-mode buffer."
  (interactive (list (read-string "Search query: ")))
  (let* ((buf (get-buffer-create "*org-search*"))
         (url (format "https://org-search.neidel.xyz/?query=%s&format=ansi"
                      (url-hexify-string query))))
    (with-current-buffer buf
      (erase-buffer)
      (let ((exit-code (call-process "curl" nil t nil "-Ss" url)))
        (unless (and (integerp exit-code) (zerop exit-code))
          (error "curl failed (exit %s)." exit-code)))
      (org-mode)
      (require 'ansi-color)
      (ansi-color-apply-on-region (point-min) (point-max))
      (goto-char (point-min)))
    (pop-to-buffer buf)))
```

## Stack

- React for the web UI
- Tailwind for styling
- Vite as transpiler and local development server
- Node.js as a production server
- Elasticsearch as the search index
- [fscrawler](https://github.com/dadoonet/fscrawler) for indexing my file system of notes for Elasticsearch
- (kibana for managing Elasticsearch)

## Development

To run locally:
```sh
make
```

To deploy I use:
```sh
make deploy
```

The files are synced into a docker container setup like this:
```sh
docker run -d --name org-search --network br0 --ip 192.168.178.33 -v /mnt/user/appdata/org-search:/app node:25-alpine sh -lc "cd /app && npm ci && PORT=80 npm start"
```

Nginx proxy manager then turns ip into a full-fledged domain with HTTPS.

### Configuration

**Environment variables:**

Required variables for a `.env`:
- `ES_HOST`: Elasticsearch base URL used for queries.
- `ES_INDEX`: Elasticsearch index used for queries.
- `LOCAL_FILE_ROOT`: Filesystem root used to build clickable links.

Example values:
```env
ES_HOST=https://es.neidel.xyz
ES_INDEX=org
LOCAL_FILE_ROOT=/home/jneidel/org
```

**Excluded paths:**

Paths that should never be matched can be configured in `excludePaths.config.json`.
Each entry is a JavaScript `RegExp` pattern to be excluded.

### Elasticsearch & fscrawler
This is my docker compose:
```docker
services:
  es:
    image: elasticsearch:8.13.0
    ports:
      - 9200:9200
      - 9300:9300
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ELASTICSEARCH_USERNAME=search
      - ELASTICSEARCH_PASSWORD=...
      - http.cors.enabled=true
      - http.cors.allow-origin=https://org-search.neidel.xyz
      - http.cors.allow-credentials=true
      - http.cors.allow-headers=X-Requested-With,Content-Type,Content-Length,Authorization
      - http.cors.allow-methods=OPTIONS,HEAD,GET,POST,PUT,DELETE
    volumes:
      - /mnt/user/appdata/elasticsearch/data:/usr/share/elasticsearch/data
    restart: always
    networks:
      br0:
        ipv4_address: 192.168.178.8
    labels:
      net.unraid.docker.icon: "https://cdn.freebiesupply.com/logos/large/2x/elasticsearch-logo-png-transparent.png"

  kibana:
    image: kibana:8.13.0
    entrypoint: ["echo", "Service disabled. Comment me out to enable."]
    depends_on:
      - es
    environment:
      - server.publicBaseUrl=kibana.neidel.xyz
      - ELASTICSEARCH_HOSTS=http://192.168.178.8:9200
      - ELASTICSEARCH_USERNAME=search
      - ELASTICSEARCH_PASSWORD=...
    ports:
      - 5601:5601
    volumes:
      - /mnt/user/appdata/kibana/data:/usr/share/kibana/data
    networks:
      br0:
        ipv4_address: 192.168.178.25
    labels:
      net.unraid.docker.icon: "https://www.kindpng.com/picc/m/544-5447437_kibana-logo-png-transparent-png.png"

  fscrawler:
    image: dadoonet/fscrawler:latest
    depends_on:
      - es
    volumes:
      - /mnt/user/appdata/fscrawler:/root/.fscrawler
      - /mnt/user/syncthing/org:/tmp/es:ro
    command: org
    # If you want to start again reindexing from scratch instead of monitoring the changes, stop FSCrawler, restart it with the --restart option
    # environment:
    #  - FS_JAVA_OPTS="-DLOG_LEVEL=debug -DDOC_LEVEL=debug" # debugging
    restart: always
    labels:
      net.unraid.docker.icon: "https://vectorified.com/images/elasticsearch-icon-35.png"
    networks:
      br0:
        ipv4_address: 192.168.178.24

networks:
  br0:
    external: true
    name: br0
```

Nginx proxy manager turns the local IPs of Elasticsearch into their HTTPS domain variants (only accessible on the local network.)

fscrawler is further configured in `/mnt/user/appdata/fscrawler/org/_settings.yaml`:
```yaml
name: "org"
fs:
  indexed_chars: 100%
  lang_detect: true
  continue_on_error: true
  ocr:
    enabled: false
    language: "eng+deu"
    pdf_strategy: "ocr_and_text"
  excludes:
  - "*.stversions*"
  - "*node_modules*"
  - "*.epub"
  - "*.pdf"
  - "*.lock"
elasticsearch:
  urls:
    - "http://192.168.178.8:9200"
  username: "search"
  password: "..."
  ssl_verification: false
```
