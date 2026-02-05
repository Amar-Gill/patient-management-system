# Patient Management System Demo

Built with [NuxtHub](https://hub.nuxt.com) and [NuxtUI](https://ui.nuxt.com).

- [Documentation](https://hub.nuxt.com)

## Features

- Register patients with [NuxtHub Database](https://hub.nuxt.com/docs/features/database) from `hub:db` (Drizzle ORM)
- Show list of patients in table format, with filters for name, address and status.

## Setup

Make sure to install the dependencies with [pnpm](https://pnpm.io).

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

## Deploy

### Vercel

On the Vercel dashboard -> Storage, create a Turso SQLite database, Redis database, and Vercel Blob store

```bash
npm run deploy-vercel
```

Link the newly created resources to your project and re-deploy.

You can also connect using your git repository to leverage Vercel's CI/CD pipeline.

### Cloudflare

```bash
npm run deploy-cloudflare
```

Wrangler will create the necessary resources on your Cloudflare account.

You can also connect using your git repository to leverage Cloudflare's CI/CD pipeline.
