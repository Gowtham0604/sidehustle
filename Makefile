.DEFAULT_GOAL := help

.PHONY: help frontend-install frontend-dev frontend-build backend-test

help:
	@echo "Available targets: frontend-install, frontend-dev, frontend-build, backend-test"

frontend-install:
	npm --prefix frontend install

frontend-dev:
	npm --prefix frontend run dev

frontend-build:
	npm --prefix frontend run build

backend-test:
	cd backend && go test ./...
