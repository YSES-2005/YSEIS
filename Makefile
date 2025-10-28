dev:
	COMPOSE_BAKE=true docker compose up --build

down:
	COMPOSE_BAKE=true docker compose down

rebuild:
	COMPOSE_BAKE=true docker compose build --no-cache

clean: down
	docker system prune -f

.PHONY: dev rebuild clean
