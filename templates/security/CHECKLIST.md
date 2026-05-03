# Security Implementation Checklist

## 📋 Pre-Implementation

- [ ] Review project requirements
- [ ] Identify sensitive endpoints
- [ ] Plan rate limiting strategy
- [ ] Choose session storage (Redis recommended)
- [ ] Decide on authentication method (session, JWT, or both)
- [ ] List allowed CORS origins
- [ ] Review CSP requirements for external resources

## 📦 Installation

```bash
# Install production dependencies
npm install express zod validator isomorphic-dompurify ioredis bcryptjs cookie-parser express-session connect-redis

# Install dev dependencies
npm install -D @types/express @types/node @types/validator @types/bcryptjs @types/cookie-parser @types/express-session typescript
```

- [ ] Install production dependencies
- [ ] Install development dependencies
- [ ] Verify TypeScript is configured
- [ ] Copy security templates to project

## ⚙️ Configuration

### Environment Variables

- [ ] Copy `.env.example` to `.env`
- [ ] Generate secure SESSION_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Generate secure JWT_SECRET (if using JWT)
- [ ] Set NODE_ENV to 'production'
- [ ] Configure REDIS_URL (recommended)
- [ ] Set ALLOWED_ORIGINS
- [ ] Configure email settings
- [ ] Set up other service credentials

### Security Configuration

- [ ] Review `config/security.config.ts`
- [ ] Adjust rate limiting thresholds
- [ ] Configure CORS origins
- [ ] Customize CSP directives
- [ ] Set password requirements
- [ ] Configure file upload limits
- [ ] Enable/disable features as needed

## 🔧 Integration

### Basic Setup

- [ ] Import security module
- [ ] Initialize security middleware
- [ ] Test basic functionality
- [ ] Verify all middleware is loaded in correct order

```typescript
// Example
import { productionSecurity } from './security';
productionSecurity(app, process.env.REDIS_URL);
```

### Rate Limiting

- [ ] Apply general rate limiting
- [ ] Add strict rate limiting to auth endpoints
- [ ] Add moderate rate limiting to API endpoints
- [ ] Test rate limits work correctly
- [ ] Verify Redis connection (if using)

```bash
# Test rate limiting
for i in {1..10}; do curl http://localhost:3000/api/auth/login; done
```

### CORS

- [ ] Configure allowed origins
- [ ] Test CORS from allowed origin
- [ ] Test CORS from disallowed origin
- [ ] Verify credentials support
- [ ] Check preflight requests

```bash
# Test CORS
curl -H "Origin: https://example.com" -I http://localhost:3000
```

### Security Headers

- [ ] Verify HSTS is enabled (production only)
- [ ] Configure CSP directives for your app
- [ ] Test CSP doesn't break functionality
- [ ] Verify X-Frame-Options
- [ ] Check all headers are set

```bash
# Check security headers
curl -I https://your-domain.com
```

Or use: https://securityheaders.com

### Input Validation

- [ ] Add validation to signup endpoint
- [ ] Add validation to login endpoint
- [ ] Add validation to profile update
- [ ] Add validation to all user inputs
- [ ] Test validation error messages
- [ ] Sanitize HTML content where needed

```typescript
// Example
const result = await validateData(signUpSchema, req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.errors });
}
```

### CSRF Protection

- [ ] Enable CSRF middleware
- [ ] Add CSRF tokens to all forms
- [ ] Configure CSRF in fetch/axios
- [ ] Test CSRF protection works
- [ ] Exclude webhook endpoints
- [ ] Test excluded paths work

```html
<!-- In forms -->
<input type="hidden" name="csrf_token" value="<%= csrfToken %>">
```

```javascript
// In fetch
headers: { 'X-CSRF-Token': getCookie('csrf-token') }
```

### API Key Authentication (Optional)

- [ ] Implement API key generation
- [ ] Store hashed API keys in database
- [ ] Add API key authentication to public API
- [ ] Configure scopes/permissions
- [ ] Test API key authentication
- [ ] Test scope validation

```typescript
// Example
app.get('/api/data', apiKeyAuth(), requireScope('data:read'), handler);
```

## 🧪 Testing

### Manual Testing

- [ ] Test signup with valid data
- [ ] Test signup with invalid data
- [ ] Test login with correct credentials
- [ ] Test login with wrong credentials
- [ ] Test login rate limiting
- [ ] Test CSRF protection
- [ ] Test CORS from different origins
- [ ] Test API key authentication
- [ ] Test file upload validation
- [ ] Test protected routes without auth
- [ ] Test protected routes with auth

### Automated Testing

- [ ] Run validation tests: `npm test`
- [ ] Write integration tests for auth
- [ ] Write tests for rate limiting
- [ ] Write tests for CSRF
- [ ] Achieve >80% code coverage

### Security Testing

- [ ] Run `npm audit`
- [ ] Fix any high/critical vulnerabilities
- [ ] Test with OWASP ZAP or Burp Suite
- [ ] Check security headers at securityheaders.com
- [ ] Test CSP at csp-evaluator.withgoogle.com
- [ ] Attempt SQL injection on inputs
- [ ] Attempt XSS on HTML inputs
- [ ] Attempt CSRF attacks
- [ ] Test rate limiting bypass attempts

## 🔒 Security Hardening

### Passwords

- [ ] Hash passwords with bcrypt (cost 12+)
- [ ] Never log passwords
- [ ] Enforce strong password requirements
- [ ] Implement password reset flow
- [ ] Add "forgot password" functionality
- [ ] Prevent password in error messages

### Sessions

- [ ] Use secure session storage (Redis)
- [ ] Set secure cookie flags in production
- [ ] Set httpOnly flag on cookies
- [ ] Use sameSite cookie attribute
- [ ] Implement session timeout
- [ ] Regenerate session after login
- [ ] Clear session on logout

### HTTPS

- [ ] Enable HTTPS in production
- [ ] Redirect HTTP to HTTPS
- [ ] Enable HSTS header
- [ ] Use valid SSL certificate
- [ ] Test SSL configuration

### Error Handling

- [ ] Never expose stack traces in production
- [ ] Log errors server-side
- [ ] Return generic error messages
- [ ] Don't leak system information
- [ ] Handle all async errors

### Database

- [ ] Use parameterized queries
- [ ] Never concatenate SQL strings
- [ ] Validate all inputs before DB queries
- [ ] Use ORM with proper escaping
- [ ] Encrypt sensitive data at rest
- [ ] Secure database credentials

### File Uploads

- [ ] Validate file types
- [ ] Limit file sizes
- [ ] Scan for malware (if needed)
- [ ] Store files outside web root
- [ ] Generate random filenames
- [ ] Validate image dimensions

## 📊 Monitoring

### Logging

- [ ] Log authentication attempts
- [ ] Log failed authentications
- [ ] Log rate limit exceeded events
- [ ] Log CSRF violations
- [ ] Log API key usage
- [ ] Mask sensitive data in logs

### Alerts

- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Alert on high error rates
- [ ] Alert on repeated failed auth
- [ ] Alert on rate limit abuse
- [ ] Monitor Redis health
- [ ] Monitor API response times

### Metrics

- [ ] Track authentication success rate
- [ ] Track rate limit hit rate
- [ ] Track CSRF violation rate
- [ ] Track API usage by key
- [ ] Monitor system health

## 📚 Documentation

- [ ] Document security features for team
- [ ] Document rate limit tiers
- [ ] Document API key scopes
- [ ] Document CORS configuration
- [ ] Create security incident response plan
- [ ] Document password reset flow
- [ ] Create deployment checklist

## 🚀 Pre-Deployment

### Environment

- [ ] Set NODE_ENV=production
- [ ] Use production database
- [ ] Use production Redis
- [ ] Configure production CORS origins
- [ ] Enable all security features
- [ ] Disable development features

### Security Review

- [ ] Review all environment variables
- [ ] Review security configuration
- [ ] Review rate limiting settings
- [ ] Review CORS configuration
- [ ] Review CSP directives
- [ ] Review API key permissions
- [ ] Review session settings

### Final Tests

- [ ] Run full test suite
- [ ] Run `npm audit`
- [ ] Test in production-like environment
- [ ] Load test critical endpoints
- [ ] Test disaster recovery
- [ ] Verify backups are configured

## 📈 Post-Deployment

### Monitoring

- [ ] Monitor error rates
- [ ] Monitor authentication failures
- [ ] Monitor rate limit hits
- [ ] Monitor API usage
- [ ] Monitor system performance
- [ ] Review logs daily (first week)

### Optimization

- [ ] Review rate limit thresholds
- [ ] Optimize slow endpoints
- [ ] Review and adjust CSP
- [ ] Monitor Redis memory usage
- [ ] Optimize database queries

### Maintenance

- [ ] Schedule regular security audits
- [ ] Keep dependencies updated
- [ ] Review and rotate secrets quarterly
- [ ] Review access logs weekly
- [ ] Update documentation as needed
- [ ] Train team on security practices

## 🆘 Security Incident Response

### Preparation

- [ ] Create incident response plan
- [ ] Define severity levels
- [ ] Assign response team roles
- [ ] Set up communication channels
- [ ] Prepare incident templates
- [ ] Test response procedures

### Detection

- [ ] Monitor security alerts
- [ ] Review access logs
- [ ] Watch for anomalies
- [ ] Set up automated alerts
- [ ] Establish escalation procedures

### Response

- [ ] Document incident immediately
- [ ] Isolate affected systems
- [ ] Analyze root cause
- [ ] Patch vulnerabilities
- [ ] Notify affected users (if needed)
- [ ] Report to authorities (if required)

### Recovery

- [ ] Restore from clean backups
- [ ] Reset compromised credentials
- [ ] Update security measures
- [ ] Conduct post-mortem
- [ ] Update security documentation
- [ ] Improve detection/prevention

## ✅ Sign-Off

### Development Team

- [ ] Reviewed and tested all security features
- [ ] All tests passing
- [ ] Security documentation complete
- [ ] Code reviewed by senior developer

### Security Team

- [ ] Security audit completed
- [ ] Vulnerabilities addressed
- [ ] Penetration testing done
- [ ] Security sign-off obtained

### DevOps Team

- [ ] Infrastructure secured
- [ ] SSL/TLS configured
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] Disaster recovery tested

### Management

- [ ] Security policies reviewed
- [ ] Compliance requirements met
- [ ] Risk assessment completed
- [ ] Deployment approved

---

## Quick Commands Reference

```bash
# Generate secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate API key
node -e "const crypto = require('crypto'); console.log('sk_' + crypto.randomBytes(32).toString('base64url'))"

# Test rate limiting
for i in {1..10}; do curl http://localhost:3000/api/endpoint; done

# Check security headers
curl -I https://your-domain.com

# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Run tests
npm test

# Type check
npm run typecheck

# Lint code
npm run lint
```

## Resources

- 📖 [SECURITY.md](./SECURITY.md) - Full security documentation
- 🚀 [QUICK_START.md](./QUICK_START.md) - Quick start guide
- 📝 [README.md](./README.md) - Usage guide
- 💻 [examples/express-app.ts](./examples/express-app.ts) - Complete example
- 🧪 [__tests__/](../__tests__/) - Test examples

## Support

For security issues: security@yourdomain.com

---

**Last Updated**: {{currentDate}}
**Version**: 1.0.0
**Status**: Production Ready ✅
