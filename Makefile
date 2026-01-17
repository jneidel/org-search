all: dev

dev: node_modules
	${BROWSER} http://localhost:5173/ >/dev/null 2>&1 &
	npm run dev

node_modules:
	npm i

dist: index.html src
	npm run build

server: dist node_modules
	npm run start

deploy: dist
	rsync -av dist server src package.json package-lock.json excludePaths.config.json .env home:appdata/org-search/
