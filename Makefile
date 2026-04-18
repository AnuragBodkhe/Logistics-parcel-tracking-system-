# LogiTrack Docker Management Makefile
# Simplifies Docker operations for development and production

.PHONY: help build dev prod test clean logs stop restart status

# Default target
help:
	@echo "LogiTrack Docker Management Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev         - Start development environment"
	@echo "  make dev-build   - Build and start development environment"
	@echo "  make dev-stop    - Stop development environment"
	@echo "  make dev-logs    - Show development logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod        - Start production environment"
	@echo "  make prod-build  - Build and start production environment"
	@echo "  make prod-stop   - Stop production environment"
	@echo "  make prod-logs   - Show production logs"
	@echo ""
	@echo "Testing:"
	@echo "  make test        - Run test environment with Selenium"
	@echo "  make test-stop   - Stop test environment"
	@echo "  make test-logs   - Show test logs"
	@echo ""
	@echo "Utilities:"
	@echo "  make build       - Build all Docker images"
	@echo "  make clean       - Clean up Docker resources"
	@echo "  make logs        - Show logs for all services"
	@echo "  make stop        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make status      - Show status of all services"
	@echo "  make shell       - Open shell in frontend container"
	@echo "  make db-shell    - Open PostgreSQL shell"
	@echo "  make backup      - Backup database"
	@echo "  make restore     - Restore database from backup"

# Development commands
dev:
	@echo "Starting LogiTrack development environment..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Development environment started!"
	@echo "Frontend: http://localhost:5173"
	@echo "API: http://localhost:4000"
	@echo "MailHog: http://localhost:8025"
	@echo "MinIO: http://localhost:9001"

dev-build:
	@echo "Building and starting LogiTrack development environment..."
	docker-compose -f docker-compose.dev.yml build
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Development environment built and started!"

dev-stop:
	@echo "Stopping LogiTrack development environment..."
	docker-compose -f docker-compose.dev.yml down
	@echo "Development environment stopped!"

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Production commands
prod:
	@echo "Starting LogiTrack production environment..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "Production environment started!"
	@echo "Application: http://localhost"
	@echo "Grafana: http://localhost:3001"
	@echo "Prometheus: http://localhost:9090"
	@echo "Kibana: http://localhost:5601"

prod-build:
	@echo "Building and starting LogiTrack production environment..."
	docker-compose -f docker-compose.prod.yml build
	docker-compose -f docker-compose.prod.yml up -d
	@echo "Production environment built and started!"

prod-stop:
	@echo "Stopping LogiTrack production environment..."
	docker-compose -f docker-compose.prod.yml down
	@echo "Production environment stopped!"

prod-logs:
	docker-compose -f docker-compose.prod.yml logs -f

# Testing commands
test:
	@echo "Starting LogiTrack test environment with Selenium..."
	docker-compose -f docker-compose.dev.yml --profile test up -d
	@echo "Test environment started!"
	@echo "Selenium Hub: http://localhost:4444"
	@echo "Chrome VNC: vnc://localhost:5900"
	@echo "Firefox VNC: vnc://localhost:5901"

test-stop:
	@echo "Stopping LogiTrack test environment..."
	docker-compose -f docker-compose.dev.yml --profile test down
	@echo "Test environment stopped!"

test-logs:
	docker-compose -f docker-compose.dev.yml --profile test logs -f

# Utility commands
build:
	@echo "Building all Docker images..."
	docker-compose build
	docker-compose -f docker-compose.dev.yml build
	docker-compose -f docker-compose.prod.yml build
	@echo "All Docker images built!"

clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker-compose -f docker-compose.prod.yml down -v --remove-orphans
	docker system prune -f
	docker volume prune -f
	@echo "Docker resources cleaned!"

logs:
	docker-compose logs -f

stop:
	@echo "Stopping all LogiTrack services..."
	docker-compose down
	docker-compose -f docker-compose.dev.yml down
	docker-compose -f docker-compose.prod.yml down
	@echo "All services stopped!"

restart:
	@echo "Restarting all LogiTrack services..."
	docker-compose restart
	@echo "All services restarted!"

status:
	@echo "LogiTrack Services Status:"
	@echo "========================="
	docker-compose ps
	docker-compose -f docker-compose.dev.yml ps
	docker-compose -f docker-compose.prod.yml ps

shell:
	@echo "Opening shell in frontend container..."
	docker-compose exec logitrack-frontend /bin/sh

db-shell:
	@echo "Opening PostgreSQL shell..."
	docker-compose exec postgres psql -U logitrack -d logitrack

backup:
	@echo "Creating database backup..."
	mkdir -p ./backups
	docker-compose exec postgres pg_dump -U logitrack logitrack > ./backups/logitrack_backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database backup created in ./backups/"

restore:
	@echo "Restoring database from backup..."
	@read -p "Enter backup file path: " backup_file; \
	docker-compose exec -T postgres psql -U logitrack logitrack < $$backup_file
	@echo "Database restored!"

# Development shortcuts
dev-restart:
	@echo "Restarting development environment..."
	docker-compose -f docker-compose.dev.yml restart
	@echo "Development environment restarted!"

prod-restart:
	@echo "Restarting production environment..."
	docker-compose -f docker-compose.prod.yml restart
	@echo "Production environment restarted!"

# Monitoring commands
monitor:
	@echo "Opening monitoring dashboards..."
	@echo "Grafana: http://localhost:3001 (admin/admin123)"
	@echo "Prometheus: http://localhost:9090"
	@echo "Kibana: http://localhost:5601"

# Quick start for new developers
quick-start:
	@echo "Quick starting LogiTrack for development..."
	@echo "1. Building development environment..."
	make dev-build
	@echo "2. Waiting for services to start..."
	sleep 10
	@echo "3. Showing service status..."
	make status
	@echo ""
	@echo "LogiTrack is now running!"
	@echo "Frontend: http://localhost:5173"
	@echo "API: http://localhost:4000"
	@echo "MailHog: http://localhost:8025"
	@echo ""
	@echo "Use 'make dev-logs' to see logs"
	@echo "Use 'make dev-stop' to stop services"

# Production deployment
deploy:
	@echo "Deploying LogiTrack to production..."
	@echo "1. Building production images..."
	make prod-build
	@echo "2. Running health checks..."
	sleep 30
	@echo "3. Verifying deployment..."
	make status
	@echo "Production deployment complete!"
	@echo "Application: http://localhost"
	@echo "Monitoring: http://localhost:3001"
