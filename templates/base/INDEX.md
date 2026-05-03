# Base Templates Index

Quick reference for all base template files.

## Configuration Files (20 total)

| File | Type | Purpose |
|------|------|---------|
| `.env.example.hbs` | Template | Environment variables with all integrations |
| `.gitignore` | Static | Git ignore patterns |
| `.dockerignore` | Static | Docker ignore patterns |
| `.editorconfig` | Static | Editor configuration |
| `.nvmrc` | Static | Node version specification |
| `.prettierignore` | Static | Prettier ignore patterns |
| `.prettierrc.json` | Static | Prettier formatting rules |
| `.eslintrc.json` | Static | ESLint configuration |
| `tsconfig.json` | Static | TypeScript configuration |
| `next.config.js.hbs` | Template | Next.js configuration |
| `tailwind.config.js.hbs` | Template | Tailwind CSS configuration |
| `postcss.config.js` | Static | PostCSS configuration |
| `package.json.hbs` | Template | NPM package configuration |
| `jest.config.js` | Static | Jest testing configuration |
| `jest.setup.js` | Static | Jest test setup |
| `Dockerfile.hbs` | Template | Docker container configuration |
| `docker-compose.yml.hbs` | Template | Docker Compose orchestration |
| `README.md.hbs` | Template | Project documentation |
| `LICENSE` | Static | MIT License |
| `BASE_TEMPLATES.md` | Doc | Template documentation |

## Templates vs Static Files

### Templates (`.hbs` extension)
Files that use Handlebars variables and need compilation:
- `.env.example.hbs`
- `next.config.js.hbs`
- `tailwind.config.js.hbs`
- `package.json.hbs`
- `Dockerfile.hbs`
- `docker-compose.yml.hbs`
- `README.md.hbs`

### Static Files
Files that are copied as-is without modification:
- All configuration files (ESLint, Prettier, TypeScript, etc.)
- `.gitignore`, `.dockerignore`, `.editorconfig`
- `LICENSE`
- Test configuration files

## Feature Coverage

### ✅ Essential Features
- TypeScript configuration
- Next.js 14 setup
- Tailwind CSS with plugins
- ESLint + Prettier
- Git workflow

### ✅ Development Tools
- Jest for unit testing
- Playwright for E2E (optional)
- Husky pre-commit hooks
- Hot reloading
- Path aliases

### ✅ Production Features
- Docker deployment
- Environment configuration
- Security headers
- Health checks
- Standalone builds

### ✅ Integrations
- Database (Prisma + PostgreSQL)
- Authentication (NextAuth.js)
- Payments (Stripe)
- Email (Resend/SendGrid)
- Storage (AWS S3/Cloudinary)
- Analytics (GA/PostHog)
- Monitoring (Sentry)
- Caching (Redis)

## Quick Stats

- **Total Files:** 21
- **Template Files:** 7 (.hbs)
- **Static Files:** 14
- **Lines of Code:** ~500+ per template
- **Feature Flags:** 25+
- **Supported Integrations:** 15+

## Integration Ready

All templates are ready to integrate with:
- ✅ Database templates (Prisma schemas)
- ✅ Authentication templates (NextAuth configs)
- ✅ Component libraries (shadcn/ui, DaisyUI)
- ✅ API routes templates
- ✅ Page templates
- ✅ Layout templates

## Next Steps

After base templates, you need:
1. **Database templates** - Prisma schemas for different features
2. **Authentication templates** - NextAuth providers and configs
3. **Component templates** - UI components (buttons, forms, etc.)
4. **Page templates** - Landing, dashboard, auth pages
5. **API templates** - API routes for various features
6. **Layout templates** - App layouts and navigation
7. **Email templates** - Transactional email designs
