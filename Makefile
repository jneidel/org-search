all: dev

dev:
	${BROWSER} http://localhost:5173/ >/dev/null 2>&1 &
	npm run dev

dist: index.html src
	npm run build

deploy: dist
	rsync -av dist home:appdata/org-search/
