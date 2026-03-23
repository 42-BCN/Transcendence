COMPOSE = docker compose -f containers/docker-compose.yml

SETUP_SCRIPT = scripts/env/setup-env.sh

.PHONY: all up down clean fclean re \
	logs logs-frontend logs-api logs-nginx logs-db logs-last logs-frontend-last logs-split \
	db-reset db-seed db-bootstrap \
	ps restart shell-frontend shell-api shell-db setup stop

#---- Default ----

all: up

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

#---- Database management ----

db-bootstrap:
	$(COMPOSE) exec backend npm run bootstrap

db-seed: db-bootstrap
	$(COMPOSE) exec backend npm run seed

db-reset:
	$(COMPOSE) exec backend npm run reset
