# Deployment Templates Index

Complete index of all deployment configuration files and their purpose.

## 📂 Directory Structure

```
deployment/
├── .github/workflows/
│   └── deploy.yml.hbs                    # GitHub Actions CI/CD pipeline
├── app/api/health/
│   └── route.ts.hbs                      # Health check API endpoint
├── docker/
│   ├── .dockerignore.hbs                 # Docker ignore patterns
│   ├── Dockerfile.hbs                    # Multi-stage Docker build
│   ├── docker-compose.yml.hbs            # Docker Compose configuration
│   └── nginx.conf.hbs                    # Nginx reverse proxy config
├── k8s/
│   ├── deployment.yaml.hbs               # Kubernetes deployment with HPA
│   ├── ingress.yaml.hbs                  # Kubernetes ingress with SSL
│   ├── secrets.example.yaml.hbs          # Example secrets (template only)
│   └── service.yaml.hbs                  # Kubernetes service
├── scripts/
│   ├── deploy.sh.hbs                     # Automated deployment script
│   ├── migrate.sh.hbs                    # Database migration script
│   └── setup-env.sh.hbs                  # Environment setup helper
├── .env.production.example.hbs           # Production environment template
├── DEPLOYMENT.md.hbs                     # Comprehensive deployment guide
├── DEPLOYMENT_CHECKLIST.md.hbs           # Pre/post deployment checklist
├── fly.toml.hbs                          # Fly.io configuration
├── package.json.snippet.hbs              # Deployment scripts for package.json
├── railway.json.hbs                      # Railway configuration
├── vercel.json.hbs                       # Vercel configuration
├── INDEX.md                              # This file
└── README.md                             # Deployment templates overview
```

## 📄 File Descriptions

### CI/CD & Automation

#### `.github/workflows/deploy.yml.hbs`
**Purpose:** GitHub Actions workflow for automated CI/CD
**Features:**
- Run tests on pull requests
- Lint and type-check code
- Build verification
- Security scanning (Trivy, npm audit)
- Deploy to staging (develop branch)
- Deploy to production (main branch)
- Health checks after deployment
- Slack notifications

**Usage:**
```yaml
# Automatically runs on push to develop/main branches
# Configure secrets in GitHub repository settings
```

---

### Health Monitoring

#### `app/api/health/route.ts.hbs`
**Purpose:** Health check API endpoint for monitoring
**Features:**
- Database connectivity check
- Redis connectivity check (if enabled)
- Response time tracking
- Service status reporting
- 30-second caching to prevent overload
- Graceful degradation

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "services": {
    "database": { "status": "up", "responseTime": 15 },
    "redis": { "status": "up", "responseTime": 5 }
  },
  "environment": "production",
  "version": "1.0.0"
}
```

---

### Docker Configuration

#### `docker/Dockerfile.hbs`
**Purpose:** Multi-stage Docker build for Next.js
**Features:**
- Three-stage build (deps, builder, runner)
- Non-root user for security
- Optimized layer caching
- Health check included
- Production-ready

**Build:**
```bash
docker build -t myapp:latest -f docker/Dockerfile .
```

#### `docker/.dockerignore.hbs`
**Purpose:** Exclude unnecessary files from Docker builds
**Reduces:** Build context size and image size

#### `docker/docker-compose.yml.hbs`
**Purpose:** Local/production Docker Compose setup
**Includes:**
- Next.js application
- PostgreSQL database
- Redis cache (optional)
- Nginx reverse proxy
- Health checks
- Volume management

**Usage:**
```bash
docker-compose up -d
```

#### `docker/nginx.conf.hbs`
**Purpose:** Nginx reverse proxy configuration
**Features:**
- SSL/TLS termination
- Rate limiting
- Security headers
- Gzip compression
- Caching strategy
- CORS configuration

---

### Kubernetes Configuration

#### `k8s/deployment.yaml.hbs`
**Purpose:** Kubernetes deployment with auto-scaling
**Features:**
- 3 replicas (min), 10 replicas (max)
- Horizontal Pod Autoscaler
- Rolling updates (zero downtime)
- Resource limits and requests
- Liveness and readiness probes
- Security context (non-root)
- Pod Disruption Budget

**Apply:**
```bash
kubectl apply -f k8s/deployment.yaml -n myapp
```

#### `k8s/service.yaml.hbs`
**Purpose:** Kubernetes service definition
**Features:**
- ClusterIP service type
- Session affinity
- Port configuration

#### `k8s/ingress.yaml.hbs`
**Purpose:** Kubernetes ingress with SSL/TLS
**Features:**
- Automatic SSL with cert-manager
- Security headers
- Rate limiting
- CORS configuration
- Network policies
- Multiple domain support

#### `k8s/secrets.example.yaml.hbs`
**Purpose:** Template for Kubernetes secrets
**⚠️ WARNING:** This is a template only! Create actual secrets with:
```bash
kubectl create secret generic myapp-secrets \
  --from-literal=database-url=<url> \
  --from-literal=nextauth-secret=<secret>
```

---

### Platform Configurations

#### `vercel.json.hbs`
**Purpose:** Vercel deployment configuration
**Features:**
- Build settings
- Environment variables
- Function timeouts
- Headers (security, CORS)
- Rewrites and redirects
- Cron jobs configuration
- Region settings

**Deploy:**
```bash
vercel --prod
```

#### `railway.json.hbs`
**Purpose:** Railway deployment configuration
**Features:**
- Build and deploy settings
- Health checks
- Auto-restart policies
- Service definitions
- Environment variables
- Database integration

**Deploy:**
```bash
railway up
```

#### `fly.toml.hbs`
**Purpose:** Fly.io deployment configuration
**Features:**
- App configuration
- Build settings
- Health checks
- Auto-scaling
- PostgreSQL setup
- Redis integration
- Region settings
- Metrics endpoint

**Deploy:**
```bash
flyctl deploy
```

---

### Scripts

#### `scripts/deploy.sh.hbs`
**Purpose:** Automated deployment script
**Features:**
- Pre-deployment checks (tests, linting, type-check)
- Build verification
- Platform-specific deployment
- Health checks after deployment
- Production confirmation prompt

**Usage:**
```bash
./scripts/deploy.sh <platform> [environment]
./scripts/deploy.sh vercel production
```

#### `scripts/migrate.sh.hbs`
**Purpose:** Database migration script
**Features:**
- Database backup before migration
- Prisma migration deployment
- Migration verification
- Rollback support
- Production safety checks

**Usage:**
```bash
export DATABASE_URL="postgresql://..."
./scripts/migrate.sh
./scripts/migrate.sh --seed  # with seeding
```

#### `scripts/setup-env.sh.hbs`
**Purpose:** Environment setup helper
**Features:**
- Generates `.env.production` file
- Auto-generates NEXTAUTH_SECRET
- Platform-specific instructions
- Pre-filled template values

**Usage:**
```bash
./scripts/setup-env.sh
```

---

### Documentation

#### `DEPLOYMENT.md.hbs`
**Purpose:** Comprehensive deployment guide
**Contents:**
- Prerequisites
- Environment variables
- Platform-specific deployment guides
- Database setup
- Post-deployment tasks
- Monitoring setup
- Troubleshooting
- Security checklist

**Size:** ~500 lines of detailed documentation

#### `DEPLOYMENT_CHECKLIST.md.hbs`
**Purpose:** Pre/post deployment checklist
**Sections:**
- Pre-deployment checks
- Deployment execution
- Post-deployment verification
- Monitoring setup
- Rollback plan
- Maintenance schedule

**Usage:** Follow step-by-step before and after each deployment

#### `README.md`
**Purpose:** Overview of deployment templates
**Contents:**
- Directory structure
- Quick start guide
- Features overview
- Configuration guide
- Troubleshooting

---

### Configuration Files

#### `.env.production.example.hbs`
**Purpose:** Template for production environment variables
**Features:**
- All required variables
- Comments and descriptions
- Example values
- Platform-specific sections
- Generated secrets

**Usage:**
```bash
cp .env.production.example .env.production
# Edit with actual values
```

#### `package.json.snippet.hbs`
**Purpose:** Deployment scripts for package.json
**Scripts:**
- `deploy:vercel` - Deploy to Vercel
- `deploy:railway` - Deploy to Railway
- `deploy:fly` - Deploy to Fly.io
- `deploy:docker` - Deploy with Docker
- `health-check` - Test health endpoint
- Database scripts (Prisma)

---

## 🎯 Template Variables

All `.hbs` files support Handlebars templating with these variables:

### Common Variables
- `{{projectName}}` - Project name
- `{{domain}}` - Domain name
- `{{region}}` - Deployment region
- `{{version}}` - App version

### Feature Flags
- `{{#if database.prisma}}...{{/if}}` - Prisma features
- `{{#if features.redis}}...{{/if}}` - Redis features
- `{{#if auth.github}}...{{/if}}` - GitHub OAuth
- `{{#if auth.google}}...{{/if}}` - Google OAuth
- `{{#if payments.stripe}}...{{/if}}` - Stripe payments
- `{{#if email.resend}}...{{/if}}` - Resend email
- `{{#if email.sendgrid}}...{{/if}}` - SendGrid email

### Conditional Sections
Features are automatically included/excluded based on project configuration.

---

## 🚀 Quick Start

### 1. Choose Platform
```bash
# Vercel (Easiest)
./scripts/deploy.sh vercel production

# Railway
./scripts/deploy.sh railway production

# Fly.io
./scripts/deploy.sh fly production

# Docker
./scripts/deploy.sh docker production

# Kubernetes
./scripts/deploy.sh kubernetes production
```

### 2. Set Up Environment
```bash
./scripts/setup-env.sh
# Edit .env.production with actual values
```

### 3. Run Migrations
```bash
export DATABASE_URL="your-production-url"
./scripts/migrate.sh
```

### 4. Verify Deployment
```bash
curl https://yourdomain.com/api/health
```

---

## 📊 File Statistics

| Category | Files | Lines of Code |
|----------|-------|---------------|
| CI/CD | 1 | ~400 |
| Docker | 4 | ~500 |
| Kubernetes | 4 | ~450 |
| Platform Config | 3 | ~300 |
| Scripts | 3 | ~400 |
| Documentation | 3 | ~1500 |
| API Endpoints | 1 | ~200 |
| **Total** | **19** | **~3750** |

---

## 🔐 Security Features

- ✅ Non-root containers (Docker/K8s)
- ✅ Security headers configured
- ✅ Rate limiting implemented
- ✅ Network policies (K8s)
- ✅ Secret management
- ✅ SSL/TLS enforcement
- ✅ CORS policies
- ✅ Input validation
- ✅ Automated security scanning

---

## 🎨 Customization

All templates are fully customizable:

1. Templates use `.hbs` extension (Handlebars)
2. Variables are injected during project generation
3. Conditional blocks based on features
4. Easy to modify after generation

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes Docs](https://kubernetes.io/docs/home/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Fly.io Docs](https://fly.io/docs/)

---

**Last Updated:** 2024-01-01
**Version:** 1.0.0
