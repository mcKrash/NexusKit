# Admin Dashboard - Quick Start Guide

Get your admin dashboard up and running in 5 minutes! ⚡

## 🚀 Step 1: Install Dependencies

```bash
npm install recharts lucide-react
```

That's it! All other dependencies are already included in your SaaS project.

## 👤 Step 2: Create Your First Admin User

### Option A: Via Database Tool (Recommended)

```bash
# Open Prisma Studio
npx prisma studio
```

1. Navigate to the `User` model
2. Find your user account
3. Change the `role` field from `USER` to `ADMIN`
4. Save changes

### Option B: Via Code

Create a script `scripts/make-admin.ts`:

```typescript
import { prisma } from '@/lib/prisma';

async function makeAdmin(email: string) {
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });
  console.log(`✅ ${user.email} is now an admin!`);
}

makeAdmin('your-email@example.com');
```

Run it:
```bash
npx tsx scripts/make-admin.ts
```

### Option C: Via Seed File

Add to your `prisma/seed.ts`:

```typescript
await prisma.user.upsert({
  where: { email: 'admin@example.com' },
  update: { role: 'ADMIN' },
  create: {
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
    emailVerified: new Date(),
  },
});
```

Run seed:
```bash
npx prisma db seed
```

## 🌐 Step 3: Access the Admin Dashboard

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Log in with your admin account at:
   ```
   http://localhost:3000/login
   ```

3. Navigate to the admin dashboard:
   ```
   http://localhost:3000/admin/dashboard
   ```

## 🎉 You're Done!

You should now see:

### Dashboard Home
```
┌─────────────────────────────────────────────┐
│  {{projectName}} Admin                      │
└─────────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Total   │ │   MRR    │ │  Active  │ │  Churn   │
│  Users   │ │  $2,500  │ │  Subs    │ │  Rate    │
│  1,234   │ │          │ │   85     │ │  2.5%    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

Revenue Overview
[Interactive Chart]

Recent Signups        Recent Subscriptions
[User List]          [Subscription List]
```

## 📍 Navigation

Use the sidebar to access:

- **📊 Dashboard** - Overview and key metrics
- **👥 Users** - Manage all users
- **📈 Analytics** - Deep insights and charts
- **💳 Subscriptions** - Subscription management
- **⚙️ Settings** - Admin configuration

## 🎯 Common Tasks

### View All Users
1. Click "Users" in sidebar
2. Use search to find specific users
3. Filter by role or subscription status

### Change User Role
1. Go to Users page
2. Click the ⋮ menu next to a user
3. Select "Make Admin" or "Remove Admin"

### View Analytics
1. Click "Analytics" in sidebar
2. Select time range (7d, 30d, 90d, 1y)
3. Explore charts and metrics

### Manage Subscriptions
1. Click "Subscriptions" in sidebar
2. Filter by status
3. View or cancel subscriptions

### Configure Settings
1. Click "Settings" in sidebar
2. Update site configuration
3. Toggle features on/off
4. Save changes

## 🔧 Customization

### Add a New Metric Card

Edit `app/(admin)/dashboard/page.tsx.hbs`:

```typescript
<MetricCard
  title="New Metric"
  value="123"
  icon={YourIcon}
  trend="+5%"
  trendUp={true}
/>
```

### Add a Sidebar Link

Edit `components/admin/Sidebar.tsx.hbs`:

```typescript
const navigation = [
  // ... existing items
  { name: 'New Section', href: '/admin/new', icon: YourIcon },
];
```

### Customize Colors

Edit Tailwind classes in any component:

```typescript
// Change primary color from blue to purple
className="bg-blue-600"  // Change to
className="bg-purple-600"
```

## 🐛 Troubleshooting

### Can't Access Admin Dashboard

**Problem:** Redirected to login or main dashboard

**Solution:**
1. Verify you're logged in
2. Check your user's `role` is exactly `ADMIN` (case-sensitive)
3. Clear browser cookies and log in again
4. Check database: `npx prisma studio` → User → role field

### Charts Not Showing

**Problem:** Charts don't render or show errors

**Solution:**
1. Install recharts: `npm install recharts`
2. Restart dev server: `npm run dev`
3. Check browser console for errors

### API Returns 403 Forbidden

**Problem:** "Forbidden - Admin access required"

**Solution:**
1. Verify admin role in database
2. Clear session cookies
3. Log out and log back in
4. Check NextAuth configuration

### Data Not Loading

**Problem:** Loading spinner never stops

**Solution:**
1. Check API routes are accessible
2. Review server logs for errors
3. Verify database connection
4. Check Prisma schema matches

## 📚 Next Steps

### Learn More
1. **README.md** - Full feature overview
2. **ADMIN_TEMPLATES.md** - Technical documentation
3. **ADMIN_SUMMARY.md** - Complete feature list
4. **INDEX.md** - File structure reference

### Enhance Your Dashboard
1. Add custom metrics
2. Create new charts
3. Implement export functionality
4. Add audit logs
5. Set up email notifications

### Production Deployment
1. Create admin users in production DB
2. Configure environment variables
3. Set up monitoring
4. Implement rate limiting
5. Add backup systems

## 💡 Pro Tips

1. **Bookmark the dashboard** - Save `/admin/dashboard` for quick access
2. **Use keyboard shortcuts** - Navigate faster (browser dependent)
3. **Check regularly** - Monitor metrics daily
4. **Set up alerts** - Get notified of important events
5. **Keep it secure** - Only grant admin access when necessary

## 🎓 Learning Resources

### Understand the Stack
- [Next.js App Router](https://nextjs.org/docs/app)
- [NextAuth.js](https://next-auth.js.org/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Best Practices
- [Role-based Access Control](https://auth0.com/docs/manage-users/access-control/rbac)
- [Admin Panel Security](https://cheatsheetseries.owasp.org/cheatsheets/Admin_Interface_Cheat_Sheet.html)
- [SaaS Metrics](https://www.forentrepreneurs.com/saas-metrics-2/)

## 🔐 Security Reminders

- ✅ Only grant admin access to trusted users
- ✅ Use strong passwords for admin accounts
- ✅ Enable 2FA if available
- ✅ Monitor admin activity logs
- ✅ Regularly review user roles
- ✅ Keep dependencies updated

## ✨ You're All Set!

Your admin dashboard is ready to use. Start managing your SaaS like a pro! 🚀

---

**Need Help?**
- 📖 Check the full documentation in README.md
- 🐛 Review troubleshooting section above
- 💬 Consult the main SaaS Generator docs

**Happy Managing!** 🎉
