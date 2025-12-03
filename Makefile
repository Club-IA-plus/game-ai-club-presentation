.PHONY: dev-run dev-kill dev-build help

help:
	@echo "Commandes disponibles:"
	@echo "  make dev-build  - Construit l'image Docker"
	@echo "  make dev-run    - Lance le conteneur en mode développement"
	@echo "  make dev-kill   - Arrête et supprime le conteneur"

dev-build:
	docker compose build

dev-run:
	docker compose up -d
	@echo "Jeu disponible sur http://localhost:8080"

dev-kill:
	docker compose down

