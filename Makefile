ENV ?= development
NODE_ENV_VALUE = $(if $(filter production,$(ENV)),production,development)

COMPOSE_BASE = docker compose -f containers/docker-compose.yml
COMPOSE_DEV = APP_ENV=development NODE_ENV=development $(COMPOSE_BASE) -f containers/docker-compose.dev.yml
COMPOSE_PROD = APP_ENV=production NODE_ENV=production $(COMPOSE_BASE) -f containers/docker-compose.prod.yml
COMPOSE = APP_ENV=$(ENV) NODE_ENV=$(NODE_ENV_VALUE) $(COMPOSE_BASE)
COMPOSE_ENV = $(if $(filter development,$(ENV)),$(COMPOSE_DEV),$(if $(filter production,$(ENV)),$(COMPOSE_PROD),$(COMPOSE)))

FRONTEND_SERVICE = frontend
BACKEND_SERVICE = backend
NGINX_SERVICE = nginx
SOCKET_SERVICE = socket
CONTRACT_SERVICES = $(FRONTEND_SERVICE) $(BACKEND_SERVICE) $(SOCKET_SERVICE)

SETUP_SCRIPT = scripts/env/setup-env.sh
TUNNEL_SCRIPT = scripts/cloudflare/tunnel.sh
TUNNEL_QUICK_SCRIPT = scripts/cloudflare/tunnel-quick.sh
TUNNEL_STABLE_SCRIPT = scripts/cloudflare/tunnel-stable.sh

BACKEND_DIR = containers/backend/app
FRONTEND_DIR = containers/frontend/web
SOCKET_DIR = containers/socket/app

ENV_FILES = \
	containers/nginx/.env.$(ENV) \
	containers/backend/docker/.env.$(ENV) \
	containers/socket/docker/.env.$(ENV) \
	containers/cloudflared/.env.$(ENV) \
	containers/frontend/docker/.env.$(ENV) \
	containers/database/docker/.env.$(ENV)

GENERATED_ENVS = development production

ALL_ENV_FILES = \
	$(foreach env,$(GENERATED_ENVS),containers/nginx/.env.$(env)) \
	$(foreach env,$(GENERATED_ENVS),containers/backend/docker/.env.$(env)) \
	$(foreach env,$(GENERATED_ENVS),containers/socket/docker/.env.$(env)) \
	$(foreach env,$(GENERATED_ENVS),containers/cloudflared/.env.$(env)) \
	$(foreach env,$(GENERATED_ENVS),containers/frontend/docker/.env.$(env)) \
	$(foreach env,$(GENERATED_ENVS),containers/database/docker/.env.$(env))

.PHONY: all \
	dev dev-build dev-down dev-clean dev-logs dev-ps \
	prod prod-build prod-build-no-cache prod-down prod-clean prod-logs prod-ps \
	up down clean fclean re \
	logs logs-frontend logs-api logs-nginx logs-db logs-last logs-frontend-last logs-split \
	tunnel tunnel-logs tunnel-down \
	tunnel-stable tunnel-stable-down tunnel-stable-logs \
	tunnel-quick tunnel-quick-down tunnel-quick-logs \
	prod-tunnel-quick prod-tunnel-quick-down prod-tunnel-quick-logs \
	db-reset db-seed db-push db-setup prisma-generate \
	clean-env clean-all-env \
	ps restart rebuild-front rebuild-back rebuild-nginx rebuild-contracts switch-dev switch-prod shell-frontend shell-api shell-db shell-socket setup setup-dev setup-prod stop \
	node-modules node-modules-backend node-modules-frontend node-modules-socket \
	storybook storybook-build fclean-docker

#---- Default ----

all: dev switch-prod prod-tunnel-quick

#---- Setup ----

setup:
	APP_ENV=$(ENV) sh $(SETUP_SCRIPT) $(ENV)

setup-dev: ENV=development
setup-dev: setup

setup-prod: ENV=production
setup-prod: setup

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
	$(COMPOSE_ENV) up -d

down:
	$(COMPOSE_ENV) down

clean:
	$(COMPOSE_ENV) down --remove-orphans

fclean:
	$(COMPOSE_ENV) down -v --remove-orphans
	docker system prune -f

fclean-docker:
	docker compose down -v --remove-orphans 2>/dev/null || true
	docker system prune -af --volumes

re: setup
	$(COMPOSE_ENV) down --remove-orphans
	$(COMPOSE_ENV) up -d --build

ps:
	$(COMPOSE_ENV) ps

stop:
	$(COMPOSE_ENV) stop

restart:
	$(COMPOSE_ENV) restart

rebuild-front: setup
	$(COMPOSE_ENV) up -d --build $(FRONTEND_SERVICE)

rebuild-back: setup
	$(COMPOSE_ENV) up -d --build $(BACKEND_SERVICE)

rebuild-nginx: setup
	$(COMPOSE_ENV) up -d --build $(NGINX_SERVICE)

rebuild-contracts: setup
	$(COMPOSE_ENV) up -d --build $(CONTRACT_SERVICES)

switch-dev:
	$(COMPOSE_PROD) down --remove-orphans
	$(COMPOSE_DEV) up -d

switch-prod:
	$(COMPOSE_DEV) down --remove-orphans
	$(COMPOSE_PROD) up -d --build

#---- Logs ----

logs:
	$(COMPOSE_ENV) logs -f

logs-frontend:
	$(COMPOSE_ENV) logs -f frontend

logs-api:
	$(COMPOSE_ENV) logs -f backend

logs-nginx:
	$(COMPOSE_ENV) logs -f nginx

logs-db:
	$(COMPOSE_ENV) logs -f postgres

logs-socket:
	$(COMPOSE_ENV) logs -f socket

logs-last:
	$(COMPOSE_ENV) logs --tail=100

logs-frontend-last:
	$(COMPOSE_ENV) logs --tail=100 frontend

logs-split:
	-tmux kill-session -t logs 2>/dev/null || true
	tmux new-session -d -s logs
	tmux send-keys -t logs:0.0 '$(COMPOSE_DEV) logs -f frontend' C-m
	tmux split-window -h -t logs:0.0
	tmux send-keys -t logs:0.1 '$(COMPOSE_DEV) logs -f backend' C-m
	tmux select-layout -t logs:0 even-horizontal
	tmux attach -t logs

#---- Cloudflare tunnel ----

tunnel:
	sh $(TUNNEL_SCRIPT)

tunnel-logs:
	$(COMPOSE_DEV) logs -f cloudflared

tunnel-down: tunnel-quick-down

tunnel-stable:
	sh $(TUNNEL_STABLE_SCRIPT)

tunnel-stable-down: tunnel-quick-down

tunnel-stable-logs: tunnel-logs

# Quick (dashboard-free) tunnel
tunnel-quick:
	APP_ENV=development sh $(TUNNEL_QUICK_SCRIPT) development

tunnel-quick-down:
	$(COMPOSE_DEV) rm -sf cloudflared

tunnel-quick-logs:
	$(COMPOSE_DEV) logs -f cloudflared

prod-tunnel-quick:
	APP_ENV=production sh $(TUNNEL_QUICK_SCRIPT) production

prod-tunnel-quick-down:
	$(COMPOSE_PROD) rm -sf cloudflared

prod-tunnel-quick-logs:
	$(COMPOSE_PROD) logs -f cloudflared

#---- Env cleanup ----

clean-env:
	rm -f $(ENV_FILES) $(addsuffix .bak,$(ENV_FILES))

clean-all-env:
	rm -f $(ALL_ENV_FILES) $(addsuffix .bak,$(ALL_ENV_FILES))

#---- Shell access ----

shell-frontend:
	$(COMPOSE_ENV) exec frontend sh

shell-api:
	$(COMPOSE_ENV) exec backend sh

shell-db:
	$(COMPOSE_ENV) exec postgres sh

shell-socket:
	$(COMPOSE_ENV) exec socket sh

#---- Database management ----
# Development-only DB commands.

db-push:
	$(COMPOSE_DEV) exec backend npm run prisma:db:push:dev

prisma-generate:
	$(COMPOSE_DEV) run --rm backend npm run prisma:generate

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
