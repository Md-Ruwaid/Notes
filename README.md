# Noted

A notes app with a React/Vite client and an Express/MongoDB API.

## Requirements

- Node.js 20.19+ or 22.12+
- pnpm
- A MongoDB connection string

## First-time setup

Install each app's dependencies from the repository root:

```sh
pnpm --dir client install
pnpm --dir server install
```

Create `.env` in the project root if it does not already exist. You can start
from `.env.example`, then set `MONGO_URI` to your MongoDB connection string:

```sh
cp .env.example .env
```

The root `.env` is ignored by Git. Keep credentials there and never commit them.
Available settings:

| Variable | Default | Used by |
| --- | --- | --- |
| `MONGO_URI` | — | API database connection (required) |
| `PORT` | `5000` | API server |
| `VITE_API_URL` | `http://localhost:5000` | Client API URL override in `client/.env` |

## Run locally

Create a client environment file only if you need a non-default API URL:

```sh
cp client/.env.example client/.env
```

Start the API and client in separate terminals, from the repository root:

```sh
pnpm --dir server dev
```

```sh
pnpm --dir client dev
```

Open <http://localhost:5173>. The API health check is at
<http://localhost:5000/health>.

The API connects to MongoDB before it starts listening. If the connection
fails, check `MONGO_URI` and your MongoDB network access settings.

## Checks

```sh
pnpm --dir client lint
pnpm --dir client build
pnpm --dir server test
```

The server test command uses Node's built-in test runner; no API tests are
currently defined.
