COMPOSE = docker compose -f src/docker-compose.yml

#---- Logs ----

logs:
	$(COMPOSE) logs -f

logs-web:
	$(COMPOSE) logs -f web

logs-api:
	$(COMPOSE) logs -f backend

logs-nginx:
	$(COMPOSE) logs -f nginx

logs-db:
	$(COMPOSE) logs -f postgres

logs-last:
	$(COMPOSE) logs --tail=100

logs-web-last:
	$(COMPOSE) logs --tail=100 web

logs-split:
	-tmux kill-session -t logs 2>/dev/null || true
	tmux new-session -d -s logs
	tmux send-keys -t logs:0.0 '$(COMPOSE) logs -f web' C-m
	tmux split-window -h -t logs:0.0
	tmux send-keys -t logs:0.1 '$(COMPOSE) logs -f backend' C-m
	tmux select-layout -t logs:0 even-horizontal
	tmux attach -t logs

#---- Containers ----

ps:
	$(COMPOSE) ps

restart:
	$(COMPOSE) restart

#---- Shell access ----

shell-web:
	$(COMPOSE) exec web sh

shell-api:
	$(COMPOSE) exec backend sh

shell-db:
	$(COMPOSE) exec postgres sh