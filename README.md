# Org Search

> Search for my note-taking system

A frontend to elasticsearch, which indexes my note-taking system.

![Search screen](./docs/screenshot.png)

## Stack

- react + tailwind for the frontend powered by vite
- elasticsearch
- [fscrawler](https://github.com/dadoonet/fscrawler) for indexing my file system of notes in elasticsearch
- (kibana for managing elasticsearch)

## Configure elasticsearch

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
