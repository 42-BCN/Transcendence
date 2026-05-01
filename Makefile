ENV ?= development
NODE_ENV_VALUE = $(if $(filter production,$(ENV)),production,development)

COMPOSE_BASE = docker compose -f containers/docker-compose.yml
COMPOSE_DEV = APP_ENV=development NODE_ENV=development $(COMPOSE_BASE) -f containers/docker-compose.dev.yml
COMPOSE_DEMO = APP_ENV=demo NODE_ENV=production $(COMPOSE_BASE) -f containers/docker-compose.demo.yml
COMPOSE_PROD = APP_ENV=production NODE_ENV=production $(COMPOSE_BASE) -f containers/docker-compose.prod.yml
COMPOSE = APP_ENV=$(ENV) NODE_ENV=$(NODE_ENV_VALUE) $(COMPOSE_BASE)

SETUP_SCRIPT = scripts/env/setup-env.sh

BACKEND_DIR = containers/backend/app
FRONTEND_DIR = containers/frontend/web
SOCKET_DIR = containers/socket/app

ENV_FILES = \
	containers/nginx/.env.$(ENV) \
	containers/backend/docker/.env.$(ENV) \
	containers/frontend/docker/.env.$(ENV) \
	containers/database/docker/.env.$(ENV)

GENERATED_ENVS = development demo production

ALL_ENV_FILES = \
	$(foreach env,$(GENERATED_ENVS),containers/nginx/.env.$(env)) \
	$(foreach env,$(GENERATED_ENVS),containers/backend/docker/.env.$(env)) \
	$(foreach env,$(GENERATED_ENVS),containers/frontend/docker/.env.$(env)) \
	$(foreach env,$(GENERATED_ENVS),containers/database/docker/.env.$(env))

.PHONY: all \
	dev dev-build dev-down dev-clean dev-logs dev-ps \
	demo demo-db-setup demo-reset demo-down demo-clean demo-logs demo-ps demo-build demo-build-no-cache \
	prod prod-build prod-build-no-cache prod-down prod-clean prod-logs prod-ps \
	up down clean fclean re \
	logs logs-frontend logs-api logs-nginx logs-db logs-last logs-frontend-last logs-split \
	db-reset db-seed db-push db-setup \
	clean-env clean-all-env \
	ps restart shell-frontend shell-api shell-db shell-socket setup stop \
	node-modules node-modules-backend node-modules-frontend node-modules-socket \
	storybook storybook-build

#---- Default ----

all: dev

#---- Setup ----

setup:
	@APP_ENV=$(ENV) sh $(SETUP_SCRIPT) $(ENV)

#---- Development ----

dev: ENV=development
dev: setup
	$(COMPOSE_DEV) up -d --build
	$(MAKE) db-setup

dev-up: ENV=development
dev-up: setup
	$(COMPOSE_DEV) up -d --build

dev-build: ENV=development
dev-build: setup
	$(COMPOSE_DEV) build

dev-down:
	$(COMPOSE_DEV) down --remove-orphans

dev-clean:
	$(COMPOSE_DEV) down -v --remove-orphans

dev-logs:
	$(COMPOSE_DEV) logs -f

dev-ps:
	$(COMPOSE_DEV) ps

#---- Demo ----
# Demo means:
# APP_ENV=demo           -> uses .env.demo files
# NODE_ENV=production    -> runs the app like production
# demo-db-setup uses NODE_ENV=development intentionally because seed blocks production.

demo: ENV=demo
demo: setup
	$(COMPOSE_DEMO) up -d --build

demo-db-setup: ENV=demo
demo-db-setup: setup
	APP_ENV=demo NODE_ENV=development $(COMPOSE_BASE) up -d postgres redis
	APP_ENV=demo NODE_ENV=development $(COMPOSE_BASE) run --rm backend npm ci
	APP_ENV=demo NODE_ENV=development $(COMPOSE_BASE) run --rm backend npm run prisma:db:push
	APP_ENV=demo NODE_ENV=development $(COMPOSE_BASE) run --rm backend npm run db:seed

demo-reset: ENV=demo
demo-reset:
	$(COMPOSE_DEMO) down -v --remove-orphans
	$(MAKE) demo-db-setup
	$(MAKE) demo

demo-down:
	$(COMPOSE_DEMO) down --remove-orphans

demo-clean:
	$(COMPOSE_DEMO) down -v --remove-orphans

demo-logs:
	$(COMPOSE_DEMO) logs -f

demo-ps:
	$(COMPOSE_DEMO) ps

demo-build: ENV=demo
demo-build: setup
	$(COMPOSE_DEMO) build

demo-build-no-cache: ENV=demo
demo-build-no-cache: setup
	$(COMPOSE_DEMO) build --no-cache

#---- Production ----

prod: ENV=production
prod: setup
	$(COMPOSE_PROD) up -d --build

prod-build: ENV=production
prod-build: setup
	$(COMPOSE_PROD) build

prod-build-no-cache: ENV=production
prod-build-no-cache: setup
	$(COMPOSE_PROD) build --no-cache

prod-down:
	$(COMPOSE_PROD) down --remove-orphans

prod-clean:
	$(COMPOSE_PROD) down -v --remove-orphans

prod-logs:
	$(COMPOSE_PROD) logs -f

prod-ps:
	$(COMPOSE_PROD) ps

#---- Generic containers ----

up: setup
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

clean:
	$(COMPOSE) down -v --remove-orphans

fclean: clean
	docker image prune -af
	docker volume prune -af
	docker system prune -af --volumes

re: fclean all

ps:
	$(COMPOSE) ps

stop:
	$(COMPOSE) stop

restart:
	$(COMPOSE) restart

#---- Logs ----

logs:
	$(COMPOSE) logs -f

logs-frontend:
	$(COMPOSE) logs -f frontend

logs-api:
	$(COMPOSE) logs -f backend

logs-nginx:
	$(COMPOSE) logs -f nginx

logs-db:
	$(COMPOSE) logs -f postgres

logs-last:
	$(COMPOSE) logs --tail=100

logs-frontend-last:
	$(COMPOSE) logs --tail=100 frontend

logs-split:
	-tmux kill-session -t logs 2>/dev/null || true
	tmux new-session -d -s logs
	tmux send-keys -t logs:0.0 '$(COMPOSE_DEV) logs -f frontend' C-m
	tmux split-window -h -t logs:0.0
	tmux send-keys -t logs:0.1 '$(COMPOSE_DEV) logs -f backend' C-m
	tmux select-layout -t logs:0 even-horizontal
	tmux attach -t logs

#---- Env cleanup ----

clean-env:
	rm -f $(ENV_FILES) $(addsuffix .bak,$(ENV_FILES))

clean-all-env:
	rm -f $(ALL_ENV_FILES) $(addsuffix .bak,$(ALL_ENV_FILES))

#---- Shell access ----

shell-frontend:
	$(COMPOSE) exec frontend sh

shell-api:
	$(COMPOSE) exec backend sh

shell-db:
	$(COMPOSE) exec postgres sh

shell-socket:
	$(COMPOSE) exec socket sh

#---- Database management ----
# Development-only DB commands.

db-push:
	$(COMPOSE_DEV) exec backend npm run prisma:db:push:dev

db-seed:
	$(COMPOSE_DEV) exec backend npm run db:seed:dev

db-reset:
	$(COMPOSE_DEV) exec backend npm run db:reset:dev
	$(COMPOSE_DEV) exec backend npm run db:seed:dev

db-setup: db-push db-seed

#---- Node modules management ----

node-modules-backend:
	@echo "Installing backend dependencies..."
	$(COMPOSE_DEV) exec backend npm ci || (echo "Note: npm ci already completed in entrypoint" && exit 0)

node-modules-frontend:
	@echo "Installing frontend dependencies..."
	$(COMPOSE_DEV) exec frontend npm ci || (echo "Note: npm ci already completed in entrypoint" && exit 0)

node-modules-socket:
	@echo "Installing socket dependencies..."
	$(COMPOSE_DEV) exec socket npm ci || (echo "Note: npm ci already completed in entrypoint" && exit 0)

node-modules: node-modules-backend node-modules-frontend node-modules-socket

#---- Storybook ----

storybook:
	$(COMPOSE_DEV) --profile storybook up storybook

storybook-build:
	$(COMPOSE_DEV) run --rm frontend npm run build-storybook