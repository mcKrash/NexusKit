# NextAuth.js Authentication System for {{projectName}}

A complete, production-ready authentication system for Next.js 14+ with NextAuth.js v4.

## Features

✅ **Email/Password Authentication** with secure password hashing (bcrypt)
✅ **OAuth Providers** (Google, GitHub) - easily extensible
✅ **Email Verification** with secure token-based verification
✅ **Password Reset** with time-limited tokens
✅ **JWT Session Strategy** for scalability
✅ **Role-Based Access Control** (RBAC)
✅ **Protected Routes** with middleware
✅ **Rate Limiting** for security
✅ **Input Validation & Sanitization**
✅ **Modern UI** with Tailwind CSS
✅ **TypeScript** support throughout
✅ **Security Best Practices** built-in

## File Structure

```
templates/auth/nextauth/
├── lib/
│   ├── auth.ts                 # NextAuth configuration
│   ├── auth-utils.ts           # Authentication utilities
│   └── prisma.ts               # Prisma client instance
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts    # NextAuth handler
│   │       ├── signup/route.ts           # Signup endpoint
│   │       ├── verify-email/route.ts     # Email verification
│   │       ├── resend-verification/route.ts
│   │       └── reset-password/route.ts   # Password reset
│   └── (auth)/
│       ├── login/page.tsx         # Login page
│       ├── signup/page.tsx        # Signup page
│       ├── verify-email/page.tsx  # Email verification page
│       └── reset-password/page.tsx # Password reset page
├── components/
│   └── auth/
│       ├── LoginForm.tsx          # Login form component
│       ├── SignupForm.tsx         # Signup form component
│       └── SocialLogins.tsx       # OAuth buttons
├── middleware.ts                  # Route protection
├── prisma/
│   └── schema.prisma             # Database schema
└── .env.example                  # Environment variables template
```

## Installation

### 1. Install Dependencies

```bash
npm install next-auth @prisma/client bcryptjs
npm install -D prisma @types/bcryptjs
```

### 2. Database Setup

```bash
# Initialize Prisma
npx prisma init

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required Variables:**

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth (optional - configure if using)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 4. Configure OAuth Providers (Optional)

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth:
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## Usage

### Protecting Pages

Use the middleware to protect routes automatically:

```typescript
// middleware.ts is already configured
// All routes except auth pages and public assets are protected
```

### Getting Session in Server Components

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
    </div>
  );
}
```

### Getting Session in Client Components

```typescript
"use client";

import { useSession } from "next-auth/react";

export default function ProfileComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;
  
  return <div>Hello, {session.user.name}</div>;
}
```

### Sign Out

```typescript
"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </button>
  );
}
```

## Security Features

### Password Security
- **bcrypt hashing** with 12 salt rounds
- **Password strength validation**:
  - Minimum 8 characters
  - Uppercase and lowercase letters
  - Numbers
  - Special characters

### Rate Limiting
- **Signup**: 5 attempts per hour per IP
- **Password Reset**: 3 attempts per 15 minutes per email
- **Email Verification**: 3 attempts per 15 minutes per email

### Token Security
- **Email Verification**: 24-hour expiration
- **Password Reset**: 1-hour expiration
- **JWT Sessions**: 30-day expiration

### Input Validation
- Email format validation
- Input sanitization (XSS prevention)
- CSRF protection (built into NextAuth)

## Customization

### Adding More OAuth Providers

Edit `lib/auth.ts`:

```typescript
import TwitterProvider from "next-auth/providers/twitter";

providers: [
  // ... existing providers
  TwitterProvider({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  }),
]
```

### Customizing User Roles

Edit the `prisma/schema.prisma` to add more role types:

```prisma
model User {
  // ... existing fields
  role String @default("user") // "user" | "admin" | "premium"
}
```

Then update middleware for role-based routing.

### Email Templates

Implement email sending in the TODO sections of:
- `app/api/auth/signup/route.ts`
- `app/api/auth/resend-verification/route.ts`
- `app/api/auth/reset-password/route.ts`

Recommended email services:
- Resend
- SendGrid
- AWS SES
- Postmark

### Styling

The templates use Tailwind CSS. Customize colors and styles by modifying:
- Component classes
- `tailwind.config.js` theme configuration

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Create new account |
| `/api/auth/signin` | POST | Sign in (handled by NextAuth) |
| `/api/auth/signout` | POST | Sign out (handled by NextAuth) |
| `/api/auth/session` | GET | Get current session |
| `/api/auth/verify-email` | POST | Verify email with token |
| `/api/auth/resend-verification` | POST | Resend verification email |
| `/api/auth/reset-password` | POST | Request password reset |
| `/api/auth/reset-password` | PUT | Reset password with token |

## Troubleshooting

### Database Connection Issues
```bash
# Check database is running
# Verify DATABASE_URL in .env
# Run migrations again
npx prisma migrate reset
```

### OAuth Not Working
- Verify callback URLs match exactly
- Check environment variables are set
- Ensure OAuth apps are approved/published

### Session Not Persisting
- Verify NEXTAUTH_SECRET is set
- Check browser cookies are enabled
- Clear browser cache and cookies

## Production Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Use production database
- [ ] Configure `NEXTAUTH_URL` to production domain
- [ ] Set up proper email service
- [ ] Enable HTTPS
- [ ] Configure CORS if needed
- [ ] Set up monitoring and logging
- [ ] Review and adjust rate limits
- [ ] Implement proper error tracking
- [ ] Add backup and recovery procedures

## Support

For issues and questions:
- NextAuth.js Docs: https://next-auth.js.org
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

## License

MIT - Use freely in your projects!
