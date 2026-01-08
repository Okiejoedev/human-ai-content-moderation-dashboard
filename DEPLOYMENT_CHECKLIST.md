# GitHub Deployment Checklist

Use this checklist to deploy your Human-Centered AI Content Moderation Dashboard to GitHub and production.

## ✅ Pre-Deployment Checklist

### Local Setup
- [ ] Repository is initialized with Git
- [ ] All code is committed (`git add . && git commit -m "Initial commit"`)
- [ ] `.gitignore` is configured (ignoring `.env`, `*.db`, `node_modules`)
- [ ] Database schema is defined in `prisma/schema.prisma`
- [ ] All tests pass (if any)
- [ ] Application runs locally on `http://localhost:3000`

### Repository Setup
- [ ] GitHub account created
- [ ] New repository created: `human-ai-content-moderation-dashboard`
- [ ] Repository is empty (no README, .gitignore, or license initialized)

## 📤 Deploying to GitHub

### 1. Push to GitHub
```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/human-ai-content-moderation-dashboard.git

# Change branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### 2. Verify on GitHub
- [ ] Repository is accessible at: `https://github.com/YOUR_USERNAME/human-ai-content-moderation-dashboard`
- [ ] All files are visible in the repository
- [ ] README.md displays correctly
- [ ] No sensitive files (`.env`, `*.db`) are committed

## 🚀 Deploy to Production

### Choose Your Platform

#### Option A: Vercel (Recommended)
- [ ] Account created at [vercel.com](https://vercel.com)
- [ ] GitHub connected to Vercel
- [ ] Repository imported in Vercel
- [ ] Build settings configured:
  - Framework: Next.js
  - Build Command: `npm run build` (or `bun run build`)
  - Output Directory: `.next`
- [ ] Environment variables added:
  - `DATABASE_URL` (from your database provider)
- [ ] Database set up (Vercel Postgres or external)
- [ ] `prisma/schema.prisma` updated for production database (PostgreSQL)
- [ ] Database schema pushed to production: `bun run db:push`
- [ ] Application deployed successfully

#### Option B: Netlify
- [ ] Account created at [netlify.com](https://netlify.com)
- [ ] GitHub connected to Netlify
- [ ] Repository imported in Netlify
- [ ] Build settings configured:
  - Build Command: `npm run build`
  - Publish Directory: `.next`
- [ ] Environment variables added
- [ ] Application deployed successfully

#### Option C: Self-Hosted
- [ ] Server secured (SSH access)
- [ ] Node.js/Bun installed on server
- [ ] Application built: `bun run build`
- [ ] Production database set up (PostgreSQL recommended)
- [ ] Environment variables configured
- [ ] Reverse proxy configured (nginx, Caddy, etc.)
- [ ] SSL/HTTPS configured (Let's Encrypt)
- [ ] Process manager set up (pm2, systemd, etc.)
- [ ] Monitoring and logging configured

## 🔒 Security Checklist

### Environment Variables
- [ ] `.env` file is NOT committed to git
- [ ] `.env.example` is committed for reference
- [ ] Production secrets stored securely
- [ ] API keys (if any) are not in code

### Database
- [ ] Production database uses strong password
- [ ] Database connection is over SSL/TLS
- [ ] Database backups are configured
- [ ] Database access is restricted (IP whitelist)

### Application
- [ ] Dependencies are up-to-date: `bun audit` or `npm audit`
- [ ] Next.js security best practices followed
- [ ] Rate limiting configured (for production)
- [ ] CORS properly configured
- [ ] Error messages don't leak sensitive info

## 📊 Post-Deployment Checklist

### Functional Testing
- [ ] Homepage loads correctly
- [ ] Content submission works
- [ ] AI analysis returns results
- [ ] Flagged content appears in review queue
- [ ] Review actions (approve/remove/override) work
- [ ] Ethics metrics display correctly
- [ ] Responsive design works on mobile

### Performance
- [ ] Page load time is acceptable (< 3 seconds)
- [ ] API response times are acceptable
- [ ] Images are optimized (if added later)
- [ ] CSS/JS is minified in production

### Monitoring
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Analytics configured (Vercel Analytics, Google Analytics)
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom)
- [ ] Database monitoring configured
- [ ] Log aggregation configured

## 📝 Documentation

### Repository
- [ ] README.md is complete and accurate
- [ ] LICENSE file is included
- [ ] CONTRIBUTING.md is present (optional)
- [ ] CHANGELOG.md is started (optional)

### API Documentation
- [ ] API endpoints documented in README
- [ ] Request/response examples provided
- [ ] Error codes documented

## 🎯 Optional Enhancements

- [ ] Custom domain configured
- [ ] CDN configured for static assets
- [ ] Image optimization implemented
- [ ] Caching strategy implemented
- [ ] CI/CD pipeline configured
- [ ] Automated testing pipeline
- [ ] Staging environment set up
- [ ] Feature flags implemented

## 🆘 Support Resources

### Helpful Links
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Netlify Deployment Guide](https://docs.netlify.com/)

### Troubleshooting

**Issue**: Build fails on Vercel
- Check build logs
- Ensure all dependencies are in package.json
- Verify environment variables

**Issue**: Database connection errors
- Verify DATABASE_URL is correct
- Check database credentials
- Ensure database is accessible from deployment platform

**Issue**: API routes return 404
- Ensure API routes are in `src/app/api/` directory
- Check file naming (must be `route.ts`)
- Verify TypeScript compilation

## ✨ Success Criteria

You know deployment is successful when:

- [ ] Application is accessible via public URL
- [ ] All features work as expected in production
- [ ] Database connections are stable
- [ ] No critical errors in logs
- [ ] Performance metrics are acceptable
- [ ] Security best practices are followed

---

**Need Help?** Open an issue on GitHub or check the [main README.md](./README.md) for more details.
