dev:
	COMPOSE_BAKE=true docker compose -f docker-compose.dev.yml up --build & cd shared && pnpm watch

down:
	 docker compose down -v

rebuild:
	 docker compose build --no-cache

clean: down
	docker system prune -f

.PHONY: dev rebuild clean
