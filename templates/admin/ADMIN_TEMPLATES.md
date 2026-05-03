# Admin Dashboard Templates - Technical Documentation

## 🏗️ Architecture

### Route Structure

```
app/(admin)/                    # Admin route group
├── layout.tsx                  # Admin layout with auth checks
├── dashboard/page.tsx          # Main dashboard
├── users/page.tsx              # User management
├── analytics/page.tsx          # Analytics & metrics
└── subscriptions/page.tsx      # Subscription management
```

### API Structure

```
app/api/admin/
├── users/route.ts              # User CRUD
├── stats/route.ts              # Analytics data
└── subscriptions/route.ts      # Subscription CRUD
```

## 🔐 Authorization Flow

### Server-Side Protection

```typescript
// Layout level (app/(admin)/layout.tsx)
const session = await getServerSession(authOptions);

// 1. Check authentication
if (!session) {
  redirect('/login?callbackUrl=/admin/dashboard');
}

// 2. Check admin role
if (session.user.role !== 'ADMIN') {
  redirect('/dashboard');
}
```

### API Route Protection

```typescript
// All admin API routes
const session = await getServerSession(authOptions);

if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

if (session.user.role !== 'ADMIN') {
  return NextResponse.json(
    { error: 'Forbidden - Admin access required' },
    { status: 403 }
  );
}
```

## 📊 Data Flow

### Dashboard Metrics

```typescript
// Server component fetches data
async function getAdminStats() {
  const [totalUsers, activeSubscriptions, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    // ... more queries
  ]);
  
  return { totalUsers, activeSubscriptions, totalRevenue };
}

// Component renders with Suspense
<Suspense fallback={<Loading />}>
  <DashboardStats />
</Suspense>
```

### Client-Side Data Fetching

```typescript
// Users page example
const fetchUsers = async () => {
  const response = await fetch('/api/admin/users');
  const data = await response.json();
  setUsers(data.users);
};

useEffect(() => {
  fetchUsers();
}, []);
```

## 🎨 Component Architecture

### MetricCard Component

**Purpose:** Display key metrics with icons and trends

**Props:**
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}
```

**Usage:**
```typescript
<MetricCard
  title="Total Users"
  value={totalUsers}
  icon={Users}
  trend="+12.5%"
  trendUp={true}
/>
```

### UserTable Component

**Purpose:** Display and manage users with actions

**Props:**
```typescript
interface UserTableProps {
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}
```

**Features:**
- Dropdown action menu
- Role badges with colors
- Subscription status indicators
- Loading states during updates
- Confirmation dialogs

### RevenueChart Component

**Purpose:** Visualize revenue and subscriber growth

**Features:**
- Dual-axis line chart
- Responsive container
- Interactive tooltips
- Custom styling
- Mock data generation

### Sidebar Component

**Purpose:** Admin navigation

**Features:**
- Active link highlighting
- Icon-based navigation
- "Back to App" link
- Responsive design

## 🔄 State Management

### Client Components

```typescript
// Local state for data
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);

// Filters and search
const [searchTerm, setSearchTerm] = useState('');
const [roleFilter, setRoleFilter] = useState<string>('all');

// UI state
const [openMenuId, setOpenMenuId] = useState<string | null>(null);
```

### Server Components

```typescript
// Direct database queries (no state needed)
const stats = await getAdminStats();

// Pass data to client components
<ClientComponent data={stats} />
```

## 🗃️ Database Queries

### Efficient User Fetching

```typescript
const users = await prisma.user.findMany({
  where,
  include: {
    subscription: {
      select: {
        id: true,
        plan: true,
        status: true,
        currentPeriodEnd: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
});
```

### Analytics Queries

```typescript
// Parallel queries for performance
const [totalUsers, recentUsers, activeSubscriptions] = await Promise.all([
  prisma.user.count(),
  prisma.user.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true },
  }),
  prisma.subscription.count({ where: { status: 'ACTIVE' } }),
]);
```

### Grouped Data

```typescript
// Plan distribution
const planDistribution = await prisma.subscription.groupBy({
  by: ['plan'],
  where: { status: 'ACTIVE' },
  _count: true,
});
```

## 🎯 API Design

### RESTful Endpoints

```typescript
// GET /api/admin/users - List users
// PATCH /api/admin/users - Update user
// DELETE /api/admin/users - Delete user

// Query parameters
?role=ADMIN
?subscriptionStatus=active
```

### Response Format

```typescript
// Success
{
  users: User[],
  total: number
}

// Error
{
  error: string
}
```

### Error Handling

```typescript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## 📈 Charts with Recharts

### Line Chart Setup

```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

<ResponsiveContainer width="100%" height={350}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
  </LineChart>
</ResponsiveContainer>
```

### Dual-Axis Chart

```typescript
<LineChart data={data}>
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  <Line yAxisId="left" dataKey="revenue" />
  <Line yAxisId="right" dataKey="subscribers" />
</LineChart>
```

### Pie Chart

```typescript
<PieChart>
  <Pie
    data={data}
    cx="50%"
    cy="50%"
    outerRadius={80}
    fill="#8884d8"
    dataKey="count"
    label
  >
    {data.map((entry, index) => (
      <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
</PieChart>
```

## 🔍 Filtering & Search

### Client-Side Filtering

```typescript
const filteredUsers = users.filter((user) => {
  const matchesSearch =
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesRole = roleFilter === 'all' || user.role === roleFilter;

  return matchesSearch && matchesRole;
});
```

### Server-Side Filtering

```typescript
// Build dynamic where clause
const where: any = {};

if (role && role !== 'all') {
  where.role = role;
}

const users = await prisma.user.findMany({ where });
```

## 🎨 Styling Patterns

### Status Badges

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'CANCELED':
      return 'bg-red-100 text-red-800';
    case 'PAST_DUE':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
```

### Hover Effects

```typescript
className="hover:bg-gray-50 transition-colors"
className="hover:shadow-md transition-shadow"
```

### Active States

```typescript
const isActive = pathname === item.href;

className={`${
  isActive
    ? 'bg-blue-50 text-blue-700'
    : 'text-gray-700 hover:bg-gray-50'
}`}
```

## 🚀 Performance Optimizations

### 1. Parallel Queries

```typescript
const [users, stats] = await Promise.all([
  fetchUsers(),
  fetchStats(),
]);
```

### 2. Suspense Boundaries

```typescript
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

### 3. Selective Includes

```typescript
include: {
  subscription: {
    select: {
      id: true,
      plan: true,
      status: true,
      // Only include needed fields
    },
  },
}
```

### 4. Client-Side Caching

```typescript
// SWR or React Query can be added for caching
const { data, error } = useSWR('/api/admin/users', fetcher);
```

## 🛡️ Security Best Practices

### 1. Self-Modification Prevention

```typescript
// Can't modify own role
if (userId === session.user.id && updates.role) {
  return NextResponse.json(
    { error: 'Cannot modify your own admin role' },
    { status: 400 }
  );
}

// Can't delete self
if (userId === session.user.id) {
  return NextResponse.json(
    { error: 'Cannot delete your own account' },
    { status: 400 }
  );
}
```

### 2. Field Whitelisting

```typescript
const allowedFields = ['name', 'email', 'role', 'emailVerified'];
const updateData: any = {};

for (const field of allowedFields) {
  if (field in updates) {
    updateData[field] = updates[field];
  }
}
```

### 3. Confirmation Dialogs

```typescript
const handleDelete = async (userId: string) => {
  if (!confirm('Are you sure? This action cannot be undone.')) {
    return;
  }
  // Proceed with deletion
};
```

## 📱 Responsive Design

### Breakpoints

```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
className="flex flex-col sm:flex-row gap-4"
className="hidden md:block"
```

### Mobile Navigation

```typescript
// Sidebar can be made collapsible
const [sidebarOpen, setSidebarOpen] = useState(false);
```

## 🧪 Testing Considerations

### Unit Tests

```typescript
// Test component rendering
// Test filter functions
// Test status badge logic
```

### Integration Tests

```typescript
// Test API endpoints
// Test auth checks
// Test CRUD operations
```

### E2E Tests

```typescript
// Test admin login
// Test user management flow
// Test subscription cancellation
```

## 📦 Deployment Checklist

- [ ] Set admin users in production database
- [ ] Configure proper error logging
- [ ] Set up monitoring for admin actions
- [ ] Implement rate limiting on admin API
- [ ] Add audit logs for sensitive operations
- [ ] Configure backup systems
- [ ] Test all admin functions in staging
- [ ] Document admin procedures

## 🔄 Future Enhancements

1. **Bulk operations** - Select multiple users/subscriptions
2. **Export data** - CSV/Excel export functionality
3. **Advanced filters** - Date ranges, custom queries
4. **Audit logs** - Track all admin actions
5. **Real-time updates** - WebSocket for live data
6. **Custom dashboards** - Per-admin customization
7. **Email users** - Direct email from admin panel
8. **Impersonate user** - Login as user for support
9. **API rate limits** - View and manage API usage
10. **Feature flags** - Enable/disable features per user

## 📚 References

- [Next.js App Router](https://nextjs.org/docs/app)
- [NextAuth.js](https://next-auth.js.org/)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Prisma](https://www.prisma.io/)
