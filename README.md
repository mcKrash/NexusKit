# ⚡ NexusKit

> Generate production-ready SaaS applications in minutes — not weeks.

[![NPM Version](https://img.shields.io/npm/v/nexuskit-cli.svg)](https://www.npmjs.com/package/nexuskit-cli)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

---

## 🚀 What is NexusKit?

**NexusKit** is a CLI tool that scaffolds a complete, production-ready SaaS application in a single command. Stop copy-pasting boilerplate — NexusKit wires up authentication, payments, database, email, admin dashboard, security, and deployment configs so you can start shipping features on day one.

```bash
npx nexuskit-cli my-app
```

That's it. Your SaaS is ready.

---

## ✨ What You Get

| Feature | Options |
|---|---|
| 🔐 **Authentication** | NextAuth.js, Clerk, Supabase Auth |
| 💳 **Payments** | Stripe, Paddle, Lemon Squeezy |
| 🗄️ **Database** | PostgreSQL, MySQL, MongoDB (via Prisma) |
| 📧 **Email** | Resend, SendGrid, Postmark |
| 🛡️ **Admin Dashboard** | Users, analytics, full management UI |
| 🔒 **Security** | Rate limiting, CORS, input validation (OWASP) |
| 🚢 **Deployment** | Docker, Vercel, Fly.io, GitHub Actions CI/CD |

---

## 📦 Quick Start

### Requirements
- Node.js >= 18.0.0
- npm / yarn / pnpm

### Generate your app

```bash
# Using npx (no install needed)
npx nexuskit-cli my-app

# Or install globally
npm install -g nexuskit-cli
nexuskit-cli my-app
```

### Interactive wizard

NexusKit will guide you through setup:

```
? Project name: my-saas-app
? Authentication provider: NextAuth.js
? Database: PostgreSQL (Prisma)
? Payment provider: Stripe
? Email service: Resend
? Admin dashboard: Yes
? Deployment target: Vercel + Docker
```

Then sit back — NexusKit generates everything in seconds.

---

## 📁 Generated Project Structure

```
my-app/
├── app/
│   ├── (auth)/           # Login, signup pages
│   ├── (admin)/          # Admin dashboard
│   ├── api/
│   │   ├── auth/         # Auth endpoints
│   │   └── payments/     # Stripe webhooks & checkout
│   └── pricing/          # Pricing page
├── lib/
│   ├── auth.ts           # Auth configuration
│   ├── stripe.ts         # Stripe client
│   ├── db.ts             # Prisma client
│   └── email.ts          # Email service
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── middleware.ts          # Auth + rate limiting
├── docker-compose.yml
├── .github/workflows/    # CI/CD pipeline
└── .env.example
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js / Clerk / Supabase
- **Payments:** Stripe / Paddle / Lemon Squeezy
- **Email:** React Email + Resend / SendGrid / Postmark
- **Security:** OWASP-compliant middleware

---

## 🔧 CLI Options

```bash
nexuskit-cli <project-name> [options]

Options:
  -t, --template <name>   Use a preset template
  --auth <provider>       Set auth provider (nextauth|clerk|supabase)
  --db <type>             Set database (postgresql|mysql|mongodb)
  --payments <provider>   Set payment provider (stripe|paddle|lemonsqueezy)
  --skip-install          Skip npm install
  --skip-git              Skip git initialization
  -v, --version           Show version
  -h, --help              Show help
```

---

## 📋 After Generation

```bash
cd my-app

# 1. Copy and fill environment variables
cp .env.example .env.local

# 2. Push database schema
npx prisma db push

# 3. Start development server
npm run dev
```

Your app runs at `http://localhost:3000` 🎉

---


## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © [mcKrash](https://github.com/mcKrash)

---

<p align="center">Built with ❤️ — Ship faster with NexusKit 🚀</p>