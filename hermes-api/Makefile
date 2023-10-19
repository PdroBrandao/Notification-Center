build-base-dev: ## Build base image
	@docker build --target development -t hermes-api .

build-base-prod: ## Build base image
	@docker build --target production -t hermes-api .

run-dev:  ## start services: Development Environment
	@docker-compose up -d

update-dev:  ## recreate services before start: Development Environment
	@docker-compose up -d --force-recreate --remove-orphans --build

update-prod:  ## recreate services before start: Production Environment
	@docker-compose --file production.yaml up -d --force-recreate --no-deps --remove-orphans --build


help:  ## Mostra comandos disponíveis.
	@echo
	 "Comandos disponíveis:"
	@echo
	@sed -n -E -e 's|^([a-z-]+):.+## (.+)|\1@\2|p' $(MAKEFILE_LIST) | column -s '@' -t
