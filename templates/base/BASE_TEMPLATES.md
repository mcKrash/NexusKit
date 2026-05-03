# Base Templates Documentation

This directory contains all the base configuration and documentation templates that every generated SaaS project needs.

## 📁 Template Files

### Core Configuration

#### `.env.example.hbs`
- Comprehensive environment variables template
- Includes configurations for:
  - Database (PostgreSQL)
  - Authentication (NextAuth.js with multiple providers)
  - Payments (Stripe)
  - Email services (Resend, SendGrid, SMTP)
  - Storage (AWS S3, Cloudinary)
  - Analytics (Google Analytics, PostHog)
  - Monitoring (Sentry)
  - Redis for caching and rate limiting
  - OpenAI integration
  - Feature flags
- All variables include helpful comments
- Conditional sections based on selected features

#### `package.json.hbs`
- Complete npm package configuration
- Scripts for:
  - Development, build, and production
  - Linting and formatting
  - Type checking
  - Testing (unit and E2E)
  - Database management (Prisma)
- Dependencies based on selected features
- Includes lint-staged and husky configuration
- Engine requirements specified

### TypeScript & Build Tools

#### `tsconfig.json`
- Strict TypeScript configuration for Next.js 14
- Path aliases configured:
  - `@/*` → `./src/*`
  - `@/components/*`, `@/lib/*`, etc.
- Strict mode enabled for better type safety
- Optimized for Next.js App Router

#### `next.config.js.hbs`
- Production-ready Next.js configuration
- Security headers (HSTS, CSP, etc.)
- Image optimization with remote patterns
- Server actions configuration
- Standalone output for Docker deployments
- Optional Sentry integration
- Conditional features (i18n, PWA, etc.)

### Styling & UI

#### `tailwind.config.js.hbs`
- Complete Tailwind CSS setup
- Custom color palette with CSS variables
- shadcn/ui compatible design tokens
- Optional DaisyUI configuration
- Custom animations and keyframes
- Responsive container setup
- Plugin support (forms, typography, aspect-ratio)

#### `postcss.config.js`
- PostCSS configuration for Tailwind and Autoprefixer

### Code Quality

#### `.eslintrc.json`
- Comprehensive ESLint rules for TypeScript + React
- Next.js specific rules
- Import ordering and organization
- Accessibility rules (jsx-a11y)
- React Hooks linting
- Consistent type imports
- Custom overrides for config files

#### `.prettierrc.json`
- Prettier configuration for consistent formatting
- Tailwind CSS class sorting
- 100 character line width
- Single quotes, semicolons enabled

#### `.prettierignore`
- Files and directories to exclude from formatting

#### `.editorconfig`
- Editor configuration for consistent coding style
- UTF-8, LF line endings
- Proper indentation for different file types

### Git & Version Control

#### `.gitignore`
- Comprehensive ignore patterns
- node_modules, build outputs
- Environment files
- IDE-specific files
- Test coverage and reports

### Docker & Deployment

#### `Dockerfile.hbs`
- Multi-stage Docker build
- Optimized for production
- Non-root user for security
- Health check endpoint
- Minimal Alpine Linux base
- Prisma generation included

#### `docker-compose.yml.hbs`
- Complete local development stack
- PostgreSQL database
- Optional Redis service
- Next.js application
- Health checks for all services
- Proper dependency management
- Environment variable configuration

#### `.dockerignore`
- Files to exclude from Docker builds
- Development files, tests, docs

### Testing

#### `jest.config.js`
- Jest configuration for unit testing
- Next.js integration
- Path aliases matching tsconfig
- Coverage thresholds (70%)
- Test file patterns

#### `jest.setup.js`
- Test environment setup
- Mock Next.js router and Image component
- Environment variable mocks
- Console suppression for cleaner test output

### Documentation

#### `README.md.hbs`
- Comprehensive project documentation
- Feature list (dynamic based on selections)
- Tech stack overview
- Prerequisites and setup instructions
- Database management guide
- Deployment instructions (Vercel, Docker)
- Testing and scripts documentation
- Project structure overview
- Handlebars variables for customization:
  - `{{projectName}}`
  - `{{description}}`
  - `{{features.*}}` - conditional sections
  - `{{supportEmail}}`, `{{discordUrl}}`

#### `LICENSE`
- MIT License template
- Open source friendly

### Development Tools

#### `.nvmrc`
- Node.js version specification
- Ensures consistent Node version across team

## 🎯 Handlebars Variables

These templates use Handlebars for dynamic content generation:

### Required Variables
- `projectName` - The name of the project
- `description` - Project description

### Optional Variables
- `supportEmail` - Support email address
- `discordUrl` - Discord community URL

### Feature Flags
All feature flags use the pattern `{{#if features.featureName}}`

Available feature flags:
- `authentication` - Authentication enabled
- `googleAuth` - Google OAuth
- `githubAuth` - GitHub OAuth
- `emailAuth` - Email/Password auth
- `database` - Database (Prisma + PostgreSQL)
- `stripe` - Stripe payments
- `email` - Email functionality
- `resend` - Resend email service
- `sendgrid` - SendGrid email service
- `dashboard` - User dashboard
- `admin` - Admin panel
- `api` - API routes
- `storage` - File storage
- `aws` - AWS S3 storage
- `cloudinary` - Cloudinary storage
- `analytics` - Analytics integration
- `sentry` - Sentry error tracking
- `redis` - Redis caching
- `openai` - OpenAI integration
- `seo` - SEO optimization
- `responsive` - Responsive design
- `darkMode` - Dark mode support
- `i18n` - Internationalization
- `shadcn` - shadcn/ui components
- `daisyui` - DaisyUI components
- `forms` - Tailwind forms plugin
- `typography` - Tailwind typography plugin
- `aspectRatio` - Tailwind aspect-ratio plugin
- `e2e` - Playwright E2E testing
- `ppr` - Partial Prerendering
- `pwa` - Progressive Web App

## 🔧 Usage

These templates are processed by the SaaS Generator to create production-ready projects. The generator:

1. Reads the template files
2. Compiles Handlebars templates with user selections
3. Generates output files in the target project directory
4. Maintains proper file permissions and structure

## 📝 Best Practices

### Security
- All sensitive data uses environment variables
- Security headers configured in Next.js
- Non-root Docker user
- Strict TypeScript for type safety

### Performance
- Multi-stage Docker builds
- Next.js standalone output
- Image optimization configured
- SWC minification enabled

### Code Quality
- Strict linting and formatting rules
- Pre-commit hooks with husky
- Type checking enforced
- Test coverage thresholds

### Developer Experience
- Path aliases for clean imports
- Hot reloading in development
- Comprehensive documentation
- Consistent code style

## 🚀 Production Readiness

All templates are configured for production deployment:
- Environment-based configuration
- Docker and Docker Compose support
- Vercel-optimized settings
- Database migration support
- Health checks and monitoring
- Error tracking (Sentry)
- Analytics integration

## 📚 Additional Notes

- Templates use `.hbs` extension when they require variable substitution
- Static files (like `.gitignore`, `LICENSE`) don't need `.hbs` extension
- All paths use Unix-style forward slashes for cross-platform compatibility
- TypeScript strict mode is enabled for maximum type safety
- ESLint and Prettier are configured to work together without conflicts
