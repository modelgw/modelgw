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
PRISMA_FIELD_ENCRYPTION_KEY="k1.aesgcm256.VYU1Jlyf1Yu9QGDVvVjgaf8QEP1SIhOReuiPBSbeyZA="
JWT_SECRET=jwtsecret
ADMIN_EMAIL=<your email>
ADMIN_PASSWORD=<your password>
```

### 🚀 Starting in dev mode

Install dependencies and start dev mode:

```sh
npm ci
npx nx serve modelgw | pino-pretty
```

## 🧰 Built-in Scripts

- `nx build modelgw` - Builds the project.
- `nx test modelgw` - Prepares and runs the unit tests.
- `nx serve modelgw` - Starts the development server by automatically restarting the node application when a file changes in the `src` directory are detected.
- `nx lint modelgw` - Identifying and reporting on patterns found in the project code, to make the code more consistent and avoid bugs.
- `nx codegen-generate modelgw` - Generates types from GraphQL.
- `nx run prisma-reset` - Drops and recreates the database, which results in data loss (for development only).
- `nx run prisma-migrate` - Updates your database using migrations during development and creates the database if it does not exist (for development only).
- `nx prisma-generate modelgw` - Generates Prisma Client code.
- `nx prisma-deploy modelgw` - Applies all pending migrations, and creates the database if it does not exist. For production use.
- `nx show project modelgw` - See all available targets to run for a project.
- `nx container modelgw` - Build Docker image locally.

## 📜 License

This project is licensed under the MIT License.
