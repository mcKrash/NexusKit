# Deployment Templates

This directory contains production-ready deployment configurations for your SaaS application.

## 📁 Structure

```
deployment/
├── .github/
│   └── workflows/
│       └── deploy.yml.hbs       # CI/CD pipeline with automated testing & deployment
├── docker/
│   ├── Dockerfile.hbs           # Multi-stage Docker build
│   ├── .dockerignore.hbs        # Docker ignore patterns
│   ├── docker-compose.yml.hbs   # Local/production Docker Compose setup
│   └── nginx.conf.hbs           # Nginx reverse proxy configuration
├── k8s/
│   ├── deployment.yaml.hbs      # Kubernetes deployment with HPA
│   ├── service.yaml.hbs         # Kubernetes service
│   ├── ingress.yaml.hbs         # Ingress with SSL/TLS & security
│   └── secrets.example.yaml.hbs # Secrets template (DO NOT commit actual secrets)
├── app/
│   └── api/
│       └── health/
│           └── route.ts.hbs     # Health check endpoint
├── vercel.json.hbs              # Vercel configuration
├── railway.json.hbs             # Railway configuration
├── fly.toml.hbs                 # Fly.io configuration
└── DEPLOYMENT.md.hbs            # Comprehensive deployment guide

```

## 🚀 Quick Start

### 1. Choose Your Platform

- **Vercel** - Easiest for Next.js (recommended for beginners)
- **Railway** - Simple with integrated database
- **Fly.io** - Global edge deployment
- **Docker** - Maximum flexibility
- **Kubernetes** - Enterprise-grade orchestration

### 2. Follow the Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md.hbs) for detailed instructions for each platform.

### 3. Set Up CI/CD

The GitHub Actions workflow automatically:
- Runs tests on pull requests
- Deploys to staging (develop branch)
- Deploys to production (main branch)
- Performs health checks
- Sends notifications

## 📋 Features

### Health Check Endpoint

- Comprehensive service monitoring
- Database connectivity check
- Redis check (if applicable)
- Response time tracking
- Graceful degradation
- 30-second caching to prevent service overload

### Docker Configuration

- Multi-stage builds for optimal image size
- Non-root user for security
- Health checks included
- Nginx reverse proxy with:
  - Rate limiting
  - SSL/TLS termination
  - Security headers
  - Gzip compression

### Kubernetes Setup

- Horizontal Pod Autoscaler (3-10 replicas)
- Pod Disruption Budgets
- Network Policies
- Resource limits and requests
- Rolling updates with zero downtime
- Automatic SSL with cert-manager
- Health probes (liveness & readiness)

### CI/CD Pipeline

- Automated testing (unit + E2E)
- Linting and type checking
- Security scanning (Trivy + npm audit)
- Build verification
- Staged deployments
- Health checks after deployment
- Automatic rollback on failure
- Slack notifications

### Security Features

- Security headers configured
- Rate limiting
- CORS policies
- Network policies (K8s)
- Non-root containers
- Secret management
- SSL/TLS enforcement

## 🔧 Configuration

### Environment Variables

All templates use Handlebars templating for dynamic configuration:

```handlebars
{{#if auth.github}}
- name: GITHUB_ID
  valueFrom:
    secretKeyRef:
      name: {{projectName}}-secrets
      key: github-id
{{/if}}
```

Variables are automatically included based on your project configuration.

### Platform-Specific Settings

Each platform has its own configuration file:

- **Vercel**: `vercel.json.hbs`
- **Railway**: `railway.json.hbs`
- **Fly.io**: `fly.toml.hbs`
- **Docker**: `docker-compose.yml.hbs`
- **Kubernetes**: `k8s/*.yaml.hbs`

## 📊 Monitoring

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "services": {
    "database": {
      "status": "up",
      "responseTime": 15
    },
    "redis": {
      "status": "up",
      "responseTime": 5
    }
  },
  "environment": "production",
  "version": "1.0.0"
}
```

### Status Codes

- `200` - Healthy or degraded (non-critical issues)
- `503` - Unhealthy (critical services down)

## 🔒 Security Best Practices

1. **Never commit secrets** to Git
2. Use environment variables for all sensitive data
3. Rotate secrets regularly
4. Enable 2FA on all platform accounts
5. Use managed databases with automatic backups
6. Configure security headers
7. Enable rate limiting
8. Use HTTPS everywhere
9. Implement proper CORS policies
10. Keep dependencies updated

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify firewall rules
   - Ensure connection pooling is configured

2. **Build Failures**
   - Test build locally: `pnpm build`
   - Check type errors: `pnpm type-check`
   - Verify dependencies: `pnpm install --frozen-lockfile`

3. **Health Check Failing**
   - Check application logs
   - Verify database connectivity
   - Test endpoint manually: `curl https://yourapp.com/api/health`

See [DEPLOYMENT.md](./DEPLOYMENT.md.hbs) for more troubleshooting tips.

## 📚 Resources

- [Deployment Guide](./DEPLOYMENT.md.hbs) - Complete deployment instructions
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes Docs](https://kubernetes.io/docs/home/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 🆘 Support

If you encounter issues:

1. Check the [Deployment Guide](./DEPLOYMENT.md.hbs)
2. Review health check endpoint
3. Check platform status pages
4. Review application logs
5. Verify environment variables

## 📝 Notes

- All templates use Handlebars (`.hbs`) for dynamic generation
- Templates are processed during project creation
- Conditional blocks are based on your project configuration
- Platform-specific configurations are optional

---

**Generated by create-saas-app**
