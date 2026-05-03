# SaaS Boilerplate Generator - Architecture

## Overview
A CLI tool that generates production-ready Next.js 14 SaaS applications with authentication, payments, database, and deployment configurations in a single command.

## System Design

### Core Components

```
create-saas-app (CLI)
├── Command Parser (Commander.js)
├── Interactive Wizard (Inquirer.js)
├── Template Engine (Handlebars)
├── File Generator
├── Dependency Manager
└── Git Initializer
```

## Project Structure (Generator Tool)

```
saas-generator/
├── bin/
│   └── create-saas-app.js          # Executable entry point
├── src/
│   ├── cli.js                      # CLI argument parsing
│   ├── wizard.js                   # Interactive prompts
│   ├── generator.js                # File generation orchestrator
│   ├── template-engine.js          # Handlebars integration
│   ├── installer.js                # npm/yarn/pnpm installer
│   ├── validators.js               # Input validation
│   └── utils/
│       ├── file-ops.js             # File system operations
│       ├── logger.js               # Colored console output
│       └── spinner.js              # Loading indicators
├── templates/                      # Template files
│   ├── base/                       # Core files (every project)
│   ├── frontend/                   # Frontend options
│   ├── auth/                       # Auth providers
│   ├── payments/                   # Payment providers
│   ├── database/                   # Database options
│   ├── email/                      # Email services
│   └── deployment/                 # Deployment configs
├── tests/
└── package.json
```

## Template Organization Strategy

### Template Structure
```
templates/
├── base/                           # Always included
│   ├── package.json.hbs
│   ├── tsconfig.json
│   ├── .gitignore
│   ├── .env.example.hbs
│   ├── README.md.hbs
│   └── next.config.js.hbs
├── auth/
│   ├── nextauth/                   # NextAuth.js implementation
│   │   ├── lib/auth.ts.hbs
│   │   ├── app/api/auth/[...nextauth]/route.ts.hbs
│   │   ├── app/(auth)/login/page.tsx.hbs
│   │   ├── app/(auth)/signup/page.tsx.hbs
│   │   └── middleware.ts.hbs
│   ├── clerk/                      # Clerk integration
│   └── supabase/                   # Supabase Auth
├── payments/
│   ├── stripe/                     # Stripe implementation
│   │   ├── lib/stripe.ts.hbs
│   │   ├── app/api/payments/checkout/route.ts.hbs
│   │   ├── app/api/payments/webhook/route.ts.hbs
│   │   └── app/pricing/page.tsx.hbs
│   ├── paddle/
│   └── lemon-squeezy/
├── database/
│   ├── postgresql/
│   │   ├── prisma/schema.prisma.hbs
│   │   ├── lib/db.ts.hbs
│   │   └── prisma/seed.ts.hbs
│   ├── mysql/
│   └── mongodb/
├── email/
│   ├── resend/
│   │   ├── lib/email.ts.hbs
│   │   └── emails/                 # React Email templates
│   ├── sendgrid/
│   └── postmark/
├── admin/                          # Admin dashboard
│   ├── app/(admin)/users/page.tsx.hbs
│   ├── app/(admin)/analytics/page.tsx.hbs
│   └── components/admin/
├── security/
│   ├── middleware/rate-limit.ts.hbs
│   ├── middleware/cors.ts.hbs
│   └── lib/validations.ts.hbs
└── deployment/
    ├── docker/
    │   ├── Dockerfile.hbs
    │   └── docker-compose.yml.hbs
    ├── github-actions/
    │   └── .github/workflows/deploy.yml.hbs
    └── configs/
        ├── vercel.json.hbs
        └── fly.toml.hbs
```

## Generation Workflow

### Phase 1: Configuration Collection
```
User runs: npx create-saas-app my-app
↓
1. Parse CLI arguments (if any)
2. Launch interactive wizard if needed
3. Collect user choices:
   - Project name
   - Frontend framework
   - Database type
   - Auth provider
   - Payment provider
   - Email service
   - Deployment target
4. Validate all inputs
5. Create configuration object
```

### Phase 2: Template Selection
```
Configuration Object
↓
1. Select base templates (always)
2. Select auth templates based on choice
3. Select payment templates based on choice
4. Select database templates based on choice
5. Select email templates based on choice
6. Select deployment templates based on choice
7. Merge dependency lists from all templates
```

### Phase 3: File Generation
```
Selected Templates + Config
↓
1. Create project directory
2. Process each template file:
   a. Read template
   b. Interpolate variables with Handlebars
   c. Write to target location
3. Create directory structure
4. Copy static assets
```

### Phase 4: Installation
```
Generated Files
↓
1. Detect package manager (npm/yarn/pnpm)
2. Write package.json with merged dependencies
3. Run install command
4. Run prisma generate (if using database)
5. Initialize git repository (optional)
```

### Phase 5: Completion
```
Installed Project
↓
1. Display success message
2. Show next steps
3. Provide relevant commands
4. Show documentation links
```

## Template Variables System

### Variable Interpolation
```javascript
// Configuration object passed to Handlebars
{
  projectName: "my-saas-app",
  projectDescription: "A modern SaaS application",
  author: {
    name: "User Name",
    email: "user@example.com"
  },
  stack: {
    frontend: "nextjs",
    database: "postgresql",
    auth: "nextauth",
    payments: "stripe",
    email: "resend"
  },
  features: {
    adminDashboard: true,
    emailVerification: true,
    twoFactorAuth: false,
    apiKeys: true
  },
  deployment: {
    docker: true,
    cicd: true,
    platform: "vercel"
  }
}
```

### Template Example
```typescript
// templates/base/package.json.hbs
{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "description": "{{projectDescription}}",
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    {{#if stack.auth}}
    {{#equals stack.auth "nextauth"}}
    "next-auth": "^5.0.0",
    {{/equals}}
    {{/if}}
    {{#if stack.payments}}
    {{#equals stack.payments "stripe"}}
    "stripe": "^15.0.0",
    {{/equals}}
    {{/if}}
  }
}
```

## Dependency Management

### Dependency Resolution
```javascript
// Each template declares its dependencies
const templateDependencies = {
  base: ["next", "react", "react-dom"],
  nextauth: ["next-auth", "@auth/prisma-adapter"],
  stripe: ["stripe", "@stripe/stripe-js"],
  postgresql: ["@prisma/client", "prisma"],
  resend: ["resend", "react-email"]
};

// Merge all selected templates' dependencies
function mergeDependencies(selectedTemplates) {
  const deps = {};
  selectedTemplates.forEach(template => {
    Object.assign(deps, templateDependencies[template]);
  });
  return deps;
}
```

## Extensibility Points

### Adding New Templates

1. **New Auth Provider:**
```
templates/auth/custom-provider/
├── lib/auth.ts.hbs
├── app/api/auth/route.ts.hbs
└── components/auth/
```

2. **New Payment Provider:**
```
templates/payments/custom-provider/
├── lib/payments.ts.hbs
├── app/api/payments/route.ts.hbs
└── components/pricing/
```

3. **New Database:**
```
templates/database/custom-db/
├── schema.prisma.hbs  (or equivalent)
├── lib/db.ts.hbs
└── migrations/
```

### Plugin System (Future)
```javascript
// Allow third-party plugins
// plugins/custom-feature/
// ├── templates/
// ├── dependencies.json
// └── plugin.config.js
```

## Error Handling

### Validation Strategy
```
1. Pre-generation validation
   - Check project name (valid directory name)
   - Check if directory exists
   - Validate all user inputs

2. Generation validation
   - Check file write permissions
   - Verify template files exist
   - Handle missing templates gracefully

3. Installation validation
   - Check network connectivity
   - Verify package manager exists
   - Handle installation failures

4. Post-generation validation
   - Verify all files created
   - Check package.json validity
   - Ensure no missing dependencies
```

## Performance Considerations

1. **Parallel file writing** - Write multiple files simultaneously
2. **Template caching** - Cache parsed templates in memory
3. **Lazy loading** - Only load selected templates
4. **Streaming** - Stream large files instead of loading entirely

## Security Considerations

1. **Input sanitization** - Prevent directory traversal
2. **Template sandboxing** - Restrict Handlebars helpers
3. **Dependency verification** - Use package-lock.json
4. **Secrets handling** - Never include API keys in templates

## Testing Strategy

1. **Unit tests** - Test each module independently
2. **Integration tests** - Test full generation flow
3. **Template tests** - Verify all templates compile
4. **E2E tests** - Generate projects and verify they run

## Future Enhancements

1. **Update command** - Update existing projects with new features
2. **Migration tool** - Migrate between tech stacks
3. **Component marketplace** - Browse and add features
4. **Visual wizard** - Web-based configuration UI
5. **AI suggestions** - Recommend stack based on requirements
