docker compose -f ./containers/docker-compose.yml up --build
tree -L 5 -I "node_modules|.next|dev"