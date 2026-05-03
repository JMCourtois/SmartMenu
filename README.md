# SmartMenu

SmartMenu is a multilingual restaurant menu and AI concierge pilot built with
Next.js App Router, TypeScript, Prisma, Clerk, Vercel Blob, Inngest, OpenAI, and
MiniMax.

## Local Development

```bash
pnpm install
cp .env.example .env.local
pnpm prisma:generate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Real secrets belong in `.env.local` locally and in Vercel Project Settings in
production. Do not commit `.env.local`.

## Checks

```bash
pnpm lint
pnpm test -- --run
pnpm build
```

## Deployment

See [docs/deploy-vercel.md](docs/deploy-vercel.md) for the Vercel + GitHub
deployment guide and environment variable checklist.
