# Next.js bank app
<img width="679" height="596" alt="bank app" src="https://github.com/user-attachments/assets/b32c0635-7f54-4262-a2b9-417516f930bb" />

A minimal bank-style money transfer app built with **Next.js 16**, **TypeScript** and **Server Actions**. Users log in with a pre-created account, see their balance and recent transfers, and send money to other accounts. It is a learning and portfolio project, not meant for production use.

**Live demo:** https://bank-iuzfeu847-eric-e532.vercel.app/

| Email            | Password  |
| ---------------- | --------- |
| `ana@bank.dev`   | `pass123` |
| ` john@bank.dev` | `pass123` |

The demo database is shared, so balances change as people try it out.

## Architecture and running locally

**Stack:** Next.js 16 (App Router, Server Actions, Cache Components), React 19, TypeScript, Prisma 7 with PostgreSQL, Zod for input validation, `jose` for JWT and `bcryptjs` for password hashing.

The code is split into layers so that business rules don't depend on the framework or the database:

```text
src/
├── domain/         # types, domain errors, money helpers (amounts stored as integer cents)
├── repositories/   # repository interfaces + Prisma implementations
├── services/       # business rules (TransferService, AuthService)
├── lib/            # Prisma client, JWT, session cookie, bcrypt adapter
├── app/            # pages, forms and Server Actions
├── container.ts    # composition root: wires implementations into services
└── proxy.ts        # redirects unauthenticated users to /login
```

Authentication uses a signed JWT (HS256) stored in an `httpOnly`, `sameSite=lax` cookie that is `secure` in production. Every Server Action checks the session itself, and the source account always comes from the session, never from the form.

**Concurrency Handling:** The app handles concurrent transfers with pessimistic row-level locking: inside a database transaction, the involved accounts are locked with SELECT ... FOR UPDATE, ordered by id to prevent deadlocks. The Unit of Work pattern guarantees that all repository operations of a transfer run atomically in a single transaction, and, together with repository interfaces, keeps the service layer independent of Prisma.

**Database Design**
<img width="1956" height="1665" alt="banco-next-er-diagram" src="https://github.com/user-attachments/assets/0cba3d34-eff1-4fe0-9b09-b9415bdd8c23" />

## Local Setup

**Prerequisites:** Node.js 20.9+ and Docker.

1. Install the dependencies (this also generates the Prisma client):

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/db"
   JWT_SECRET="replace-with-a-random-string-of-at-least-32-characters"
   ```

   You can generate a secret with `openssl rand -base64 48`.

3. Start PostgreSQL, apply the migrations and seed the test users:

   ```bash
   docker compose up -d
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Start the dev server and open http://localhost:3000:

   ```bash
   npm run dev
   ```

## WIPs

- [ ] **Create unit tests** with Vitest:
  - Money parsing and formatting (`parseAmountToCents`, `formatCents`).
  - `TransferService` and `AuthService`, using in-memory repository fakes instead of the database.
  - JWT signing and verification, including expired and tampered tokens.
  - Server Actions: input validation and error handling.
