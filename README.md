## Environment
- Linux (Ubuntu 20.04 or newer)
- Docker
- Docker-compose | docker compose (plugin version)
- Node 18
- yarn

## Config paths
```
- /config/
- /scripts/deployment/config/
```

## Installation

In bash console:

```bash
# Start docker service
$ sudo service docker start

# Run installation script
$ yarn run env:install
```

## Running the application

```bash
# Start project in selected mode
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Useful commands

```bash
# Prepare environment
$ yarn run env:local:start

# Stop environment
$ yarn run env:local:stop

# Run migrations
$ yarn run typeorm:run

# Revert migrations
$ yarn run typeorm:revert

# Generate migration
$ yarn run typeorm:generate <migration-name>

# Lint code
$ yarn run format && yarn run lint
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Related Docs

- [Architecture](./docs/architecture.md)
- [Query](./docs/query.md)
- [Tasks](./docs/tasks.md)

## IDEA

Auction/Marketplace

## In progress
 - Main application flow modules (Auth, Core Logic, Payments, ...)
 - Swagger
