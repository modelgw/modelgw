# Model Gateway

Gateway and load balancer between your apps and LLM inference endpoints.

## Run via Docker

```sh
docker network create modelgw
docker run --detach --restart=always --network modelgw --name modelgw \
-e DATABASE_URL="postgresql://modelgw:modelgw@postgresql:5432/modelgw?schema=public" \
-e PRISMA_FIELD_ENCRYPTION_KEY="k1.aesgcm256.VYU1Jlyf1Yu9QGDVvVjgaf8QEP1SIhOReuiPBSbeyZA=" \
-e JWT_SECRET="jwtsecret" \
-e ADMIN_EMAIL="email@example.com" \
-e ADMIN_PASSWORD="password" \
-p 4000:4000 \
-p 4001:4001 \
modelgw/modelgw:latest
```

## Environment Variables

- `GATEWAY_PORT` - Gateway port - this is where your apps connect (Default 4001).
- `ADMIN_PORT` - The port exposed to connect with the [admin application](https://github.com/modelgw/modelgw-admin) (Default 4000).
- `DATABASE_URL` - The database connection URL.
- `CORS_ALLOWED_ORIGINS` - (Optional) Comma separated Allowed Origins. (See [CORS Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS))
- `PRISMA_FIELD_ENCRYPTION_KEY` - encryption key used to encrypt/decrypt your API keys. Can be generate at [https://cloak.47ng.com].
- `JWT_SECRET` - random secret used to sign JWT.
- `ADMIN_EMAIL` - email address used for logging in.
- `ADMIN_PASSWORD` - password used for logging in.


## Setup

### Database

Set up PostgreSQL database, user and privileges.

```sql
CREATE DATABASE modelgw;
CREATE USER modelgw WITH ENCRYPTED PASSWORD 'modelgw';
GRANT ALL PRIVILEGES ON DATABASE modelgw TO modelgw;
ALTER USER modelgw CREATEDB;
```

## Development

Create `.env` or use environment variables to run in dev mode:

```sh
DATABASE_URL="postgresql://modelgw:modelgw@localhost:5432/modelgw?schema=public"
ADMIN_PORT=4000
GATEWAY_PORT=4001
CORS_ALLOWED_ORIGINS="http://localhost:3000"
```

### Built-in Scripts

- `npm run prepare` - Generates GraphQL and Prisma Client code.
- `npm run build` - Compiles the project. Emits files referenced in with the compiler settings from tsconfig.build.json.
- `npm test` - Prepares and runs the unit tests.
- `npm start` - Prepares and starts the development server by automatically restarting the node application when file changes in the `src` directory are detected. Best for the first run (requires: `npm run infrastructure:up`).
- `npm run dev:test` - Runs the unit tests.
- `npm run dev` - Starts the development server by automatically restarting the node application when a file changes in the `src` directory are detected (requires: `npm run infrastructure:up`, `npm run prepare`).
- `npm run lint` - Identifying and reporting on patterns found in the project code, to make the code more consistent and avoid bugs.
- `npm run format` - Formats all files supported by Prettier in the project directory and its subdirectories.
- `npm run prisma:format` - Formats the Prisma schema file, which includes validating, formatting, and persisting the schema.
- `npm run prisma:migrate:reset` - Drops and recreates the database, which results in data loss (for development only).
- `npm run prisma:migrate:dev` - Updates your database using migrations during development and creates the database if it does not exist (for development only).
- `npm run prisma:generate` - Generates Prisma Client code.
- `npm run prisma:deploy` - Applies all pending migrations, and creates the database if it does not exist. Primarily used in non-development environments (for production only).


## Monitoring

An endpoint `/health` can be used for monitoring. It returns HTTP status code `200` if everything is working, `503` otherwise. Response body contains JSON with detail information.

## Build

### Build Docker image

```sh
docker build -t modelgw/modelgw:latest --progress=plain .
```
