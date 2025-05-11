# Monorepo Template (NestJS + React)

🚀 Production-ready monorepo template with NestJS backend and React frontend

## Features

- **Backend**: NestJS API with TypeORM setup
- **Frontend**: React with Vite
- **Monorepo**: Managed with Nx for optimal build times
- **Testing**: Jest configured for both backend and frontend
- **Linting**: ESLint and Prettier pre-configured

## Getting Started

1. Clone this repository
2. Install dependencies:
```sh
pnpm install
```
3. Start development servers:
```sh
pnpm dev
```

## Project Structure

```
monorepo-template/
├── apps/
│   ├── api/         # NestJS backend
│   └── client/      # React frontend
├── libs/            # Shared libraries
└── tools/           # Development scripts
```

## Backend Development

To generate a new NestJS module:
```sh
pnpm generate:api
```

## Frontend Development

To generate a new React component:
```sh
pnpm generate:client
```

## Deployment

Build production bundles:
```sh
pnpm build
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
