## Dependencies
- Linux (Ubuntu 20.04 or newer)
- Docker
- Docker-compose
- Node 16

## Installation

```bash
# 1. Install dependencies
$ yarn install

# 2. Prepare environment
$ yarn run env:local:start

# 2.1 (Optionally) Edit configuration

# 3. Run migrations
yarn run typeorm:run
```

## Running the app

```bash
# Start project in selected mode
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
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
