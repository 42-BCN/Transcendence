COMPOSE = docker compose -f containers/docker-compose.yml

SETUP_SCRIPT = scripts/env/setup-env.sh

BACKEND_DIR = containers/backend/app
BACKEND_PACKAGE_FILES = $(BACKEND_DIR)/package.json $(BACKEND_DIR)/package-lock.json
DB_SCHEMA_FILES = $(BACKEND_DIR)/prisma/schema.prisma $(BACKEND_DIR)/prisma.config.ts
DB_SEED_FILES = $(DB_SCHEMA_FILES) $(BACKEND_DIR)/scripts/seed.ts

DB_PUSH_STAMP = .make/db-push.stamp
DB_SEED_STAMP = .make/db-seed.stamp
NODE_MODULES_BACKEND_STAMP = .make/backend-node-modules.stamp

FRONTEND_DIR = containers/frontend/web
FRONTEND_PACKAGE_FILES = $(FRONTEND_DIR)/package.json $(FRONTEND_DIR)/package-lock.json
NODE_MODULES_FRONTEND_STAMP = .make/frontend-node-modules.stamp

SOCKET_DIR = containers/socket/app
SOCKET_PACKAGE_FILES = $(SOCKET_DIR)/package.json $(SOCKET_DIR)/package-lock.json
NODE_MODULES_SOCKET_STAMP = .make/socket-node-modules.stamp


.PHONY: all up down clean fclean re \
	logs logs-frontend logs-api logs-nginx logs-db logs-last logs-frontend-last logs-split \
	db-reset db-seed db-push db-setup \
	ps restart shell-frontend shell-api shell-db shell-socket setup stop

#---- Default ----

all: up db-setup
setup:
	@sh $(SETUP_SCRIPT)

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
	rm -rf .make

re: fclean all

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

logs-socket:
	$(COMPOSE) logs -f socket

logs-last:
	$(COMPOSE) logs --tail=100

logs-frontend-last:
	$(COMPOSE) logs --tail=100 frontend

logs-split:
	-tmux kill-session -t logs 2>/dev/null || true
	tmux new-session -d -s logs
	tmux send-keys -t logs:0.0 '$(COMPOSE) logs -f frontend' C-m
	tmux split-window -h -t logs:0.0
	tmux send-keys -t logs:0.1 '$(COMPOSE) logs -f backend' C-m
	tmux select-layout -t logs:0 even-horizontal
	tmux attach -t logs

#---- Containers ----

ps:
	$(COMPOSE) ps

stop:
	$(COMPOSE) stop

restart:
	$(COMPOSE) restart

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

.make:
	mkdir -p .make

$(DB_PUSH_STAMP): $(DB_SCHEMA_FILES) $(NODE_MODULES_BACKEND_STAMP) | .make
	$(COMPOSE) exec backend npm run prisma:db:push
	touch $@

$(DB_SEED_STAMP): $(DB_SEED_FILES) $(DB_PUSH_STAMP) $(NODE_MODULES_BACKEND_STAMP) | .make
	$(COMPOSE) exec backend npm run db:seed
	touch $@

db-push: $(DB_PUSH_STAMP)

db-seed: $(DB_SEED_STAMP)

db-reset:
	$(COMPOSE) exec backend npm run db:reset
	$(COMPOSE) exec backend npm run db:seed
	rm -f $(DB_PUSH_STAMP) $(DB_SEED_STAMP)

db-setup: db-seed

#---- Node modules management ----
$(NODE_MODULES_BACKEND_STAMP): $(BACKEND_PACKAGE_FILES) | .make
	$(COMPOSE) exec backend npm ci
	touch $@

$(NODE_MODULES_FRONTEND_STAMP): $(FRONTEND_PACKAGE_FILES) | .make
	$(COMPOSE) exec frontend npm ci
	touch $@

$(NODE_MODULES_SOCKET_STAMP): $(SOCKET_PACKAGE_FILES) | .make
	$(COMPOSE) exec socket npm ci
	touch $@

node-modules-backend: $(NODE_MODULES_BACKEND_STAMP)
node-modules-frontend: $(NODE_MODULES_FRONTEND_STAMP)
node-modules-socket: $(NODE_MODULES_SOCKET_STAMP)
