# 🚀 Model Gateway

The ultimate gateway and load balancer bridging your apps with LLM inference endpoints. Experience seamless integration and top-tier performance.

![Model Gateway High-level architecture](https://modelgw.com/docs/img/diagram/hl-component.svg)

## [📚 Documentation ➡️ https://modelgw.com/docs](https://modelgw.com/docs)

## 🌟 Features

- High-performance load balancing
- Seamless integration with various LLM inference endpoints
- Scalable and robust architecture
- User-friendly configuration

## 🛠️ Development

### 🗄️ Database

Set up PostgreSQL database, user and privileges.

```sql
CREATE DATABASE modelgw;
CREATE USER modelgw WITH ENCRYPTED PASSWORD 'modelgw';
GRANT ALL PRIVILEGES ON DATABASE modelgw TO modelgw;
ALTER USER modelgw CREATEDB;
```

### ⚙️ Configuration

Create `.env` or use environment variables to run in dev mode:

```sh
DATABASE_URL="postgresql://modelgw:modelgw@localhost:5432/modelgw?schema=public"
ADMIN_PORT=4000
GATEWAY_PORT=4001
```

### 🚀 Starting in dev mode

Install dependencies and start dev mode:

```sh
npm ci
npm run dev | pino-pretty
```

## 🧰 Built-in Scripts

- `npm run build` - Compiles the project. Emits files referenced in with the compiler settings from tsconfig.build.json.
- `npm test` - Prepares and runs the unit tests.
- `npm start` - Prepares and starts the development server by automatically restarting the node application when file changes in the `src` directory are detected.
- `npm run dev` - Starts the development server by automatically restarting the node application when a file changes in the `src` directory are detected.
- `npm run lint` - Identifying and reporting on patterns found in the project code, to make the code more consistent and avoid bugs.
- `npm run format` - Formats all files supported by Prettier in the project directory and its subdirectories.
- `npm run prisma:format` - Formats the Prisma schema file, which includes validating, formatting, and persisting the schema.
- `npm run prisma:migrate:reset` - Drops and recreates the database, which results in data loss (for development only).
- `npm run prisma:migrate:dev` - Updates your database using migrations during development and creates the database if it does not exist (for development only).
- `npm run prisma:generate` - Generates Prisma Client code.
- `npm run prisma:deploy` - Applies all pending migrations, and creates the database if it does not exist. For production use.

## 🛠️ Build

### 🐳 xBuild Docker image locally

```sh
docker build -t modelgw/modelgw:latest --progress=plain .
```

## 📜 License

This project is licensed under the MIT License.
