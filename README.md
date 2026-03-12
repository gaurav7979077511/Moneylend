# LendTrack

LendTrack is a production-ready loan management web app built for fintech-style tracking of lenders, loans, and installments.

## Stack
- Next.js 14 App Router
- Tailwind CSS + Framer Motion (glassmorphism UI)
- Prisma ORM + PostgreSQL (Vercel NeonDB)
- React Hook Form + Zod validation
- Sonner toast notifications

## Features
- Dashboard with total lent/received/outstanding, active lenders/loans, charts and recent installments
- Lender CRUD with search
- Loan creation, lender filter, overdue highlight, and details page with repayment progress
- Installment tracking with remaining balance and progress bars
- API routes with validation
- Loading skeletons and smooth transitions

## Environment Variables
Create `.env` (or copy from `.env.example`):

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler/DB?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

### Neon alignment notes
- Use the pooled Neon URL for `DATABASE_URL` (runtime queries).
- Use the unpooled Neon URL for `DATABASE_URL_UNPOOLED` (Prisma migrations/direct connections).
- If you already have Vercel-style `POSTGRES_*` env vars, map them to these two variables.

## Local Development
```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

## Deployment on Vercel
1. Push repository to GitHub.
2. Import project in Vercel.
3. Add `DATABASE_URL` from Neon in Vercel Project Settings.
4. Add `DATABASE_URL_UNPOOLED` from Neon (non-pooler host).
5. Run Prisma migrations during build by adding this build command:
   - `prisma generate && prisma migrate deploy && next build`
6. Deploy.

## Suggested production checks
```bash
npm run lint
npm run build
```
