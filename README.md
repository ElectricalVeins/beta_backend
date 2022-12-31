## Environment
- Linux (Ubuntu 20.04 or newer)
- Docker
- Docker-compose | docker compose
- Node 16
- yarn

## Installation

In WSL console:

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

# IDEAS

- Агрегатор разных апи. Для каждого апи нужен будет адаптер. При выборе апи на фронте, через фабрику на бэке коннектить апи с апи_ключами и показывать какую-то инфу. Данные про выбранное апи можно хранить в токене, на основании которого будут создаваться адаптеры, обрабатываться инфа и отображаться на фронте. Фронт не будет знать подробностей каждого апи. Он будет отображать инфу в одном и том же виде.

- Аукцион. Нужно создать баланс юзеру, таблицу лотов, историю ставок и т.д. Нужен aws s3 для хранения фот. Возможность ввести тип лота(аукцион, продажа).