# Deploy SmartMenu to Vercel

This project can be public on GitHub while secrets stay private in Vercel project
environment variables. Do not commit `.env.local` or real API keys.

## 1. Push the project to GitHub

Create a GitHub repository, then push this project:

```bash
git remote add origin git@github.com:<your-user-or-org>/<your-repo>.git
git push -u origin main
```

If the repo already has an `origin`, update it instead:

```bash
git remote set-url origin git@github.com:<your-user-or-org>/<your-repo>.git
git push -u origin main
```

## 2. Create the Vercel project from GitHub

1. Open [Vercel new project](https://vercel.com/new).
2. Import the GitHub repo.
3. Framework preset: `Next.js`.
4. Install command: `pnpm install`.
5. Build command: `pnpm build`.
6. Output directory: leave empty/default.

Vercel will build every push to the production branch and create preview
deployments for pull requests or other branches.

## 3. Add environment variables in Vercel

Open:

```txt
Vercel Project -> Settings -> Environment Variables
```

Add these keys. Use the same names as `.env.example`:

```txt
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
OPENAI_API_KEY
MINIMAX_API_KEY
MINIMAX_BASE_URL
MINIMAX_MODEL
INNGEST_EVENT_KEY
INNGEST_SIGNING_KEY
BLOB_READ_WRITE_TOKEN
NEXT_PUBLIC_APP_URL
```

Recommended scoping:

| Variable | Scope | Public? |
| --- | --- | --- |
| `DATABASE_URL` | Production, Preview, Development | No |
| `DIRECT_URL` | Production, Preview, Development | No |
| `CLERK_SECRET_KEY` | Production, Preview, Development | No |
| `OPENAI_API_KEY` | Production, Preview, Development | No |
| `MINIMAX_API_KEY` | Production, Preview, Development | No |
| `INNGEST_EVENT_KEY` | Production, Preview, Development | No |
| `INNGEST_SIGNING_KEY` | Production, Preview, Development | No |
| `BLOB_READ_WRITE_TOKEN` | Production, Preview, Development | No |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Production, Preview, Development | Yes, browser-visible |
| `NEXT_PUBLIC_APP_URL` | Production, Preview, Development | Yes, browser-visible |
| `MINIMAX_BASE_URL` | Production, Preview, Development | No |
| `MINIMAX_MODEL` | Production, Preview, Development | No |

Anything starting with `NEXT_PUBLIC_` is included in the browser bundle. Never put
private tokens, API keys, database URLs, or secrets in a `NEXT_PUBLIC_` variable.

## 4. Use Vercel integrations where possible

For production, create/provision:

- Neon Postgres for `DATABASE_URL` and `DIRECT_URL`.
- Vercel Blob for `BLOB_READ_WRITE_TOKEN`.
- Clerk for the publishable and secret keys.
- Inngest for event/signing keys.
- OpenAI and MiniMax keys manually from their dashboards.

After adding variables, redeploy the latest commit from Vercel or push a new
commit to GitHub.

## 5. Pull Vercel env vars locally

Install and log into the CLI:

```bash
pnpm dlx vercel login
pnpm dlx vercel link
pnpm dlx vercel env pull .env.local --yes
```

`.env.local` is ignored by Git. It should stay local and private.

## 6. Validate before production

Run:

```bash
pnpm install
pnpm prisma:generate
pnpm lint
pnpm test -- --run
pnpm build
```

Then deploy a preview:

```bash
pnpm dlx vercel
```

When the preview looks good, deploy production:

```bash
pnpm dlx vercel --prod
```

## 7. Rotate leaked keys

If a key was pasted into chat, committed, or exposed in a screenshot, rotate it
in the provider dashboard before using it in Vercel.
