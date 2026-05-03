# 🚀 Quick Start Guide

Get your authentication system up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Step 2: Set Up Database

1. **Create a PostgreSQL database** (or use your preferred database)

2. **Copy environment variables:**
```bash
cp .env.example .env
```

3. **Update `.env` with your database URL:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/{{projectName}}"
```

4. **Generate a secure secret:**
```bash
# On Unix/Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

5. **Add to `.env`:**
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
```

## Step 3: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

## Step 4: Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test Authentication

### Test Email/Password Auth:
1. Navigate to `/signup`
2. Create an account
3. Check console for verification URL (since email isn't configured yet)
4. Copy the token from the URL
5. Visit `/verify-email?token=YOUR_TOKEN`
6. Login at `/login`

### Test OAuth (Optional):

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create credentials → OAuth 2.0 Client ID
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add to `.env`:
```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

#### GitHub OAuth:
1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add to `.env`:
```env
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

## 🎯 What You Get

✅ **Login page** at `/login`
✅ **Signup page** at `/signup`
✅ **Email verification** at `/verify-email`
✅ **Password reset** at `/reset-password`
✅ **Protected routes** with middleware
✅ **OAuth with Google & GitHub**
✅ **Role-based access control**

## 📁 Project Structure

```
your-app/
├── app/
│   ├── (auth)/           # Auth pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── verify-email/
│   │   └── reset-password/
│   ├── api/
│   │   └── auth/         # Auth API routes
│   ├── dashboard/        # Protected route example
│   └── layout.tsx
├── components/
│   └── auth/             # Auth components
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── auth-utils.ts     # Auth utilities
│   └── prisma.ts         # Prisma client
├── middleware.ts         # Route protection
└── prisma/
    └── schema.prisma     # Database schema
```

## 🔐 Create a Protected Page

```typescript
// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}
```

## 🎨 Customize Styling

All components use Tailwind CSS. Modify the classes in:
- `components/auth/*.tsx`
- `app/(auth)/*/page.tsx`

Or customize your theme in `tailwind.config.ts`.

## 📧 Set Up Email (Production)

For production, implement email sending in these API routes:

1. **Signup confirmation** (`app/api/auth/signup/route.ts`)
2. **Email verification** (`app/api/auth/resend-verification/route.ts`)
3. **Password reset** (`app/api/auth/reset-password/route.ts`)

Recommended email services:
- [Resend](https://resend.com) - Modern, developer-friendly
- [SendGrid](https://sendgrid.com) - Reliable, scalable
- [AWS SES](https://aws.amazon.com/ses/) - Cost-effective
- [Postmark](https://postmarkapp.com) - Fast, transactional

Example with Resend:

```bash
npm install resend
```

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@{{projectName}}.com',
  to: user.email,
  subject: 'Verify your email',
  html: `<p>Click here to verify: ${verificationUrl}</p>`,
});
```

## 🚀 Deploy to Production

### Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production:
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-new-secret-for-production"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

### Other Platforms:
- **Railway**: Easy database + app deployment
- **Render**: Free tier available
- **AWS**: Full control, more setup
- **DigitalOcean**: App Platform + Managed DB

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client not generated
```bash
npx prisma generate
```

### Database connection issues
- Verify `DATABASE_URL` in `.env`
- Check database is running
- Try: `npx prisma migrate reset`

### OAuth redirect errors
- Ensure callback URLs match exactly
- Check environment variables are set
- Restart dev server after adding env vars

### Session not working
- Verify `NEXTAUTH_SECRET` is set
- Clear browser cookies
- Check for console errors

## 📚 Next Steps

1. ✅ **Set up email service** for production
2. ✅ **Customize branding** (colors, logo, copy)
3. ✅ **Add more OAuth providers** (Twitter, Discord, etc.)
4. ✅ **Implement 2FA** for enhanced security
5. ✅ **Add user profile page**
6. ✅ **Set up monitoring** (Sentry, LogRocket)
7. ✅ **Configure security headers**
8. ✅ **Add rate limiting** with Redis

## 🤝 Need Help?

- 📖 [Full Documentation](./README.md)
- 🔐 [Security Guide](./SECURITY.md)
- 💬 [NextAuth.js Docs](https://next-auth.js.org)
- 🗄️ [Prisma Docs](https://www.prisma.io/docs)

## 🎉 You're Ready!

Your authentication system is now set up and ready to use. Happy coding! 🚀
