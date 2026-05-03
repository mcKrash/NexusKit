# Admin Dashboard Templates

Professional admin dashboard templates for managing users, subscriptions, and analytics in your SaaS application.

## 📋 Overview

This template collection provides a complete admin panel with:

- **Role-based access control** - Admin-only routes
- **User management** - View, edit, and manage all users
- **Analytics dashboard** - Revenue, growth, and retention metrics
- **Subscription management** - Monitor and manage all subscriptions
- **Professional UI** - Modern design with Tailwind CSS
- **Interactive charts** - Built with Recharts

## 🏗️ Structure

```
admin/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx.hbs          # Admin layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx.hbs        # Main dashboard with metrics
│   │   ├── users/
│   │   │   └── page.tsx.hbs        # User management
│   │   ├── analytics/
│   │   │   └── page.tsx.hbs        # Analytics and charts
│   │   └── subscriptions/
│   │       └── page.tsx.hbs        # Subscription management
│   └── api/
│       └── admin/
│           ├── users/
│           │   └── route.ts.hbs    # User CRUD operations
│           ├── stats/
│           │   └── route.ts.hbs    # Analytics data
│           └── subscriptions/
│               └── route.ts.hbs    # Subscription operations
└── components/
    └── admin/
        ├── Sidebar.tsx.hbs         # Navigation sidebar
        ├── MetricCard.tsx.hbs      # Metric display component
        ├── UserTable.tsx.hbs       # User data table
        └── RevenueChart.tsx.hbs    # Revenue chart component
```

## 🚀 Features

### 1. Admin Layout
- Persistent sidebar navigation
- Admin role verification
- Responsive design
- Quick access to all sections

### 2. Dashboard Home
- **Key Metrics:**
  - Total users
  - Monthly Recurring Revenue (MRR)
  - Active subscriptions
  - Churn rate
- **Revenue chart** with dual-axis (revenue + subscribers)
- **Recent signups** list
- **Recent subscriptions** list

### 3. User Management
- View all users with pagination
- Search by name or email
- Filter by:
  - Role (User/Admin)
  - Subscription status (Active/Inactive)
- **Actions:**
  - Change user role
  - Delete users
  - View subscription details
- Status indicators (verified/unverified)

### 4. Analytics Page
- **Time range selector** (7d, 30d, 90d, 1y)
- **User growth chart** - Track user acquisition
- **Revenue by plan** - Bar chart breakdown
- **Conversion funnel** - Visitor to paid conversion
- **Retention metrics** - 7, 30, and 90-day retention

### 5. Subscription Management
- **Subscription stats:**
  - Active subscriptions
  - Total revenue
  - Churn rate
  - Average lifetime value
- **Plan distribution** - Pie chart
- **Churn analysis** - Monthly trends
- **Subscription table** with filters:
  - All, Active, Canceled, Past Due
- Cancel subscriptions (immediate or at period end)

### 6. Components

#### Sidebar
- Navigation links with active states
- Icons from Lucide React
- "Back to App" link
- Sticky positioning

#### MetricCard
- Icon display
- Large value text
- Trend indicator (up/down)
- Hover effects

#### UserTable
- Sortable columns
- Action menu (role change, delete)
- Status badges
- Subscription info

#### RevenueChart
- Dual-axis line chart
- Responsive design
- Interactive tooltips
- Legend

## 🔐 Security

### Authorization Checks
All admin routes and API endpoints include:

```typescript
// Check authentication
if (!session) {
  redirect('/login?callbackUrl=/admin/dashboard');
}

// Check admin role
if (session.user.role !== 'ADMIN') {
  redirect('/dashboard');
}
```

### Protected API Routes
```typescript
// Verify admin role
if (session.user.role !== 'ADMIN') {
  return NextResponse.json(
    { error: 'Forbidden - Admin access required' },
    { status: 403 }
  );
}
```

### Safety Features
- Cannot delete own admin account
- Cannot modify own admin role
- Confirmation dialogs for destructive actions
- Input validation on all updates

## 📦 Dependencies

Required packages (add to package.json):

```json
{
  "dependencies": {
    "recharts": "^2.10.0",
    "lucide-react": "^0.300.0"
  }
}
```

Already included from base templates:
- next
- react
- next-auth
- @prisma/client
- tailwindcss

## 🎨 Styling

All components use Tailwind CSS with a consistent design system:

### Color Palette
- **Primary:** Blue (`blue-600`)
- **Success:** Green (`green-600`)
- **Warning:** Yellow (`yellow-600`)
- **Danger:** Red (`red-600`)
- **Info:** Purple (`purple-600`)

### Status Colors
- Active: Green
- Canceled: Red
- Past Due: Orange
- Pending: Yellow
- Admin Role: Purple

## 🔧 Customization

### Adding New Metrics
Edit `app/(admin)/dashboard/page.tsx.hbs`:

```typescript
<MetricCard
  title="Your Metric"
  value={yourValue}
  icon={YourIcon}
  trend="+X%"
  trendUp={true}
/>
```

### Adding New Charts
Use Recharts components in analytics page:

```typescript
import { LineChart, BarChart, PieChart } from 'recharts';
```

### Customizing Sidebar
Edit `components/admin/Sidebar.tsx.hbs`:

```typescript
const navigation = [
  { name: 'New Section', href: '/admin/new', icon: YourIcon },
  // ...
];
```

## 📊 Mock Data

Some endpoints use mock data for demonstration:
- Revenue calculations (assumes $29/month average)
- Churn rate calculations
- Retention metrics
- Conversion funnel

**To use real data:**
1. Implement proper revenue tracking in your database
2. Calculate actual churn from subscription cancellations
3. Track user retention with activity logs
4. Monitor conversion funnel with analytics events

## 🚀 Usage

### Installation
```bash
# This is handled by the generator
# Templates are automatically placed in your project
```

### Accessing Admin Panel
1. Log in as an admin user
2. Navigate to `/admin/dashboard`
3. Use sidebar to access different sections

### Creating Admin Users

```typescript
// Update user role via Prisma
await prisma.user.update({
  where: { email: 'admin@example.com' },
  data: { role: 'ADMIN' }
});
```

Or via the admin panel (once you have at least one admin).

## 🔍 API Endpoints

### Users API (`/api/admin/users`)
- **GET** - List all users with filters
- **PATCH** - Update user (role, email, name)
- **DELETE** - Delete user

### Stats API (`/api/admin/stats`)
- **GET** - Analytics data
  - Query params: `timeRange` (7d, 30d, 90d, 1y)
  - Query params: `type` (general, subscriptions)

### Subscriptions API (`/api/admin/subscriptions`)
- **GET** - List all subscriptions
- **PATCH** - Update subscription
- **DELETE** - Cancel subscription

## 🎯 Best Practices

1. **Always verify admin role** on both client and server
2. **Use server components** for data fetching when possible
3. **Implement proper error handling** in API routes
4. **Add loading states** for better UX
5. **Validate all inputs** before database operations
6. **Log admin actions** for audit trails
7. **Rate limit** admin API endpoints
8. **Implement pagination** for large datasets

## 🐛 Troubleshooting

### Admin can't access dashboard
- Check user's `role` field in database
- Verify it's set to `'ADMIN'` (exact case)
- Clear session cookies and log in again

### Charts not displaying
- Install `recharts`: `npm install recharts`
- Check browser console for errors
- Verify data format matches chart expectations

### API returning 403
- Ensure user is authenticated
- Verify admin role in session
- Check NextAuth configuration

## 📝 License

These templates are part of the SaaS Generator and follow the same license.

## 🤝 Support

For issues or questions about the admin templates, please refer to the main SaaS Generator documentation.
