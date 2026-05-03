# Templates Directory

This directory contains all template files used by the SaaS Generator to create production-ready Next.js applications.

## 📁 Directory Structure

```
templates/
├── base/              # Base configuration files (COMPLETE ✅)
│   ├── .env.example.hbs
│   ├── .gitignore
│   ├── .eslintrc.json
│   ├── package.json.hbs
│   ├── tsconfig.json
│   ├── next.config.js.hbs
│   ├── tailwind.config.js.hbs
│   ├── Dockerfile.hbs
│   ├── docker-compose.yml.hbs
│   ├── README.md.hbs
│   └── ... (21 files total)
│
├── database/          # Database schemas and migrations (TODO)
│   ├── schema.base.prisma
│   ├── schema.auth.prisma
│   ├── schema.subscriptions.prisma
│   └── seeds/
│
├── auth/              # Authentication templates (TODO)
│   ├── nextauth.config.ts.hbs
│   ├── providers/
│   └── pages/
│
├── components/        # React component templates (TODO)
│   ├── ui/
│   ├── forms/
│   └── layout/
│
├── pages/             # Page templates (TODO)
│   ├── landing/
│   ├── dashboard/
│   └── auth/
│
├── api/               # API route templates (TODO)
│   ├── auth/
│   ├── stripe/
│   └── webhooks/
│
├── emails/            # Email templates (TODO)
│   ├── welcome.tsx
│   ├── password-reset.tsx
│   └── invoice.tsx
│
└── layouts/           # Layout templates (TODO)
    ├── app-layout.tsx.hbs
    ├── marketing-layout.tsx.hbs
    └── dashboard-layout.tsx.hbs
```

## 🎯 Current Status

### ✅ Completed
- **Base Templates** (21 files)
  - All configuration files
  - Docker setup
  - Testing configuration
  - Code quality tools
  - Documentation templates

### 🚧 To Do
1. Database templates (Prisma schemas)
2. Authentication templates
3. Component library templates
4. Page templates
5. API route templates
6. Email templates
7. Layout templates

## 🔧 How Templates Work

### Handlebars Templates (`.hbs`)
Files with `.hbs` extension are Handlebars templates that support:

**Variables:**
```handlebars
{{projectName}}
{{description}}
```

**Conditionals:**
```handlebars
{{#if features.stripe}}
  // Stripe-specific code
{{/if}}
```

**Loops:**
```handlebars
{{#each items}}
  {{this.name}}
{{/each}}
```

### Static Files
Files without `.hbs` are copied as-is to the output directory.

## 📝 Template Variables

### Global Variables
Available in all templates:

```javascript
{
  projectName: string,      // e.g., "my-saas-app"
  description: string,      // Project description
  author: string,          // Author name
  email: string,           // Contact email
  repository: string,      // Git repository URL
  features: {              // Feature flags
    // See below for all features
  }
}
```

### Feature Flags

#### Authentication
```javascript
features: {
  authentication: boolean,
  googleAuth: boolean,
  githubAuth: boolean,
  emailAuth: boolean,
  twoFactor: boolean
}
```

#### Database & Storage
```javascript
features: {
  database: boolean,
  redis: boolean,
  storage: boolean,
  aws: boolean,
  cloudinary: boolean
}
```

#### Payments
```javascript
features: {
  stripe: boolean,
  subscriptions: boolean,
  oneTimePayments: boolean
}
```

#### Email
```javascript
features: {
  email: boolean,
  resend: boolean,
  sendgrid: boolean
}
```

#### UI & Components
```javascript
features: {
  shadcn: boolean,
  daisyui: boolean,
  darkMode: boolean,
  responsive: boolean,
  forms: boolean,
  typography: boolean
}
```

#### Features
```javascript
features: {
  dashboard: boolean,
  admin: boolean,
  api: boolean,
  analytics: boolean,
  seo: boolean,
  i18n: boolean,
  pwa: boolean
}
```

#### Development
```javascript
features: {
  testing: boolean,
  e2e: boolean,
  storybook: boolean,
  docker: boolean
}
```

#### Monitoring
```javascript
features: {
  sentry: boolean,
  logging: boolean
}
```

## 🚀 Using Templates

### In the Generator

```typescript
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

// Compile template
const templatePath = path.join(__dirname, 'templates/base/package.json.hbs');
const templateSource = await fs.readFile(templatePath, 'utf-8');
const template = Handlebars.compile(templateSource);

// Generate with data
const output = template({
  projectName: 'my-saas',
  description: 'My SaaS Application',
  features: {
    stripe: true,
    database: true,
    authentication: true,
    shadcn: true,
    resend: true
  }
});

// Write to output directory
const outputPath = path.join(outputDir, 'package.json');
await fs.writeFile(outputPath, output);
```

### Custom Handlebars Helpers

The generator registers custom helpers:

```typescript
Handlebars.registerHelper('lowercase', (str) => str.toLowerCase());
Handlebars.registerHelper('uppercase', (str) => str.toUpperCase());
Handlebars.registerHelper('kebabcase', (str) => str.replace(/\s+/g, '-').toLowerCase());
Handlebars.registerHelper('camelcase', (str) => {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
});
```

Usage:
```handlebars
{{lowercase projectName}}
{{kebabcase projectName}}
```

## 📦 Template Categories

### 1. Base Templates
Essential files every project needs:
- Configuration files
- Build setup
- Code quality
- Documentation

### 2. Database Templates
Database schemas and utilities:
- Prisma schema files
- Migration templates
- Seed data scripts

### 3. Auth Templates
Authentication and authorization:
- NextAuth configuration
- Provider setups
- Auth pages and components

### 4. Component Templates
Reusable React components:
- UI components
- Form components
- Layout components

### 5. Page Templates
Complete page templates:
- Landing pages
- Dashboard pages
- Auth pages
- Error pages

### 6. API Templates
API route handlers:
- CRUD operations
- Webhook handlers
- Authentication endpoints

### 7. Email Templates
Email templates:
- React Email components
- Transactional emails
- Notification emails

## 🎨 Template Best Practices

### 1. Keep Templates DRY
Use partials for repeated sections:

```handlebars
{{> header}}
<main>
  {{> content}}
</main>
{{> footer}}
```

### 2. Use Meaningful Variables
```handlebars
{{!-- Good --}}
{{projectName}}
{{features.stripe}}

{{!-- Bad --}}
{{x}}
{{f1}}
```

### 3. Add Comments
```handlebars
{{!-- Authentication configuration --}}
{{#if features.authentication}}
  // Auth code here
{{/if}}
```

### 4. Validate Feature Combinations
Some features depend on others:

```handlebars
{{#if features.subscriptions}}
  {{#unless features.stripe}}
    {{!-- ERROR: Subscriptions require Stripe --}}
  {{/unless}}
{{/if}}
```

### 5. Provide Defaults
```handlebars
{{projectName}}
{{description}}
{{author}}
{{email}}
```

## 🔍 Testing Templates

### Unit Tests
Test template compilation:

```typescript
test('package.json template compiles correctly', () => {
  const template = Handlebars.compile(templateSource);
  const result = template({
    projectName: 'test-app',
    features: { stripe: true }
  });
  
  expect(result).toContain('"name": "test-app"');
  expect(result).toContain('stripe');
});
```

### Integration Tests
Test full generation:

```typescript
test('generates valid Next.js project', async () => {
  await generateProject({
    projectName: 'test-app',
    outputDir: tempDir,
    features: { database: true }
  });
  
  // Verify files exist
  expect(await fs.pathExists(path.join(tempDir, 'package.json'))).toBe(true);
  
  // Verify valid JSON
  const pkg = await fs.readJSON(path.join(tempDir, 'package.json'));
  expect(pkg.name).toBe('test-app');
});
```

## 📚 Resources

- [Handlebars Documentation](https://handlebarsjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

When adding new templates:

1. Place in appropriate directory
2. Use `.hbs` extension if needs variables
3. Add feature flags for conditional sections
4. Document variables and usage
5. Test compilation
6. Update this README

## 📄 License

MIT License - See LICENSE file for details

---

**Status**: Base templates complete, other categories in progress.

For detailed information about base templates, see `base/BASE_TEMPLATES.md`.
