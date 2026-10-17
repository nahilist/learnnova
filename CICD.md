# 🚀 LearnNova AI — Production CI/CD Architecture

This repository uses a production-grade CI/CD pipeline built on **GitHub Actions**, designed for high velocity, automated quality gates, security audits, and multi-cloud container deployment.

---

## 🏗️ Pipeline Architecture Overview

```mermaid
flowchart TD
    A[Push / Pull Request] --> B[CI Pipeline]
    
    subgraph CI["Continuous Integration (.github/workflows/ci.yml)"]
        B --> C1[1. Code Quality & Linting\neslint .]
        B --> C2[2. TypeScript Strict Check\ntsc --noEmit]
        B --> C3[3. Route & Unit Smoke Tests\nnode --test tests/]
        B --> C4[4. Security Audit\nnpm audit --audit-level=high]
        
        C1 --> D[5. Production Standalone Build\nnext build (Turbopack)]
        C2 --> D
        C3 --> D
        C4 --> D
        
        D --> E[Upload Standalone Artifacts\n.next/standalone]
    end

    subgraph CD["Continuous Deployment (.github/workflows/cd.yml)"]
        F[Push to main or Tag v*.*.*] --> G[Validate & Tag]
        G --> H1[Docker Multi-Stage Build\nghcr.io / Docker Hub]
        G --> H2[Deploy to Production / Staging\nVercel / Cloud Run]
        H2 --> I[Post-Deploy Health Probe]
        I --> J[Automated GitHub Release]
    end

    subgraph Quality["Performance & Audits (.github/workflows/lighthouse.yml)"]
        K[Weekly / PR Audit] --> L[Lighthouse CI Core Web Vitals]
    end
```

---

## 🛠️ Workflows Breakdown

### 1. `ci.yml` — Continuous Integration
- **Triggers**: On pull requests targeting `main`, pushes to `main`, `master`, and feature branches (`multi-page`, `develop`), or manual trigger (`workflow_dispatch`).
- **Jobs**:
  1. **`lint`**: Executes `npm run lint` with flat ESLint 9 configuration.
  2. **`typecheck`**: Runs `npm run type-check` (`tsc --noEmit`) to prevent runtime type errors.
  3. **`unit-and-smoke-tests`**: Runs `npm test` verifying all 9 route entrypoints and asset integrity.
  4. **`security-audit`**: Scans package dependency graph for vulnerabilities with `npm audit`.
  5. **`build`**: Runs `npm run build` using Next.js Turbopack with aggressive GitHub Actions caching for `.next/cache` and `~/.npm`.
  6. **`pr-hygiene`**: Ensures PR titles adhere to Conventional Commits standards (`feat:`, `fix:`, `chore:`, etc.).

### 2. `cd.yml` — Continuous Deployment
- **Triggers**:
  - Direct merge to `main` (auto-deploys to production environment).
  - Version tags `v*.*.*` (e.g. `v1.0.0` creates a published GitHub Release with changelog).
  - Manual deployment via `workflow_dispatch` with environment selection (`production` vs `staging`).
- **Artifacts**:
  - Builds and pushes a minimal multi-stage Alpine Docker container (`<100MB`) to GitHub Container Registry (`ghcr.io`).
  - Optional zero-downtime Vercel / Cloud Run deployment.
  - Live HTTP healthcheck validation post-deployment.

### 3. `lighthouse.yml` — Core Web Vitals & Accessibility
- Runs Google Lighthouse CI on the production build to audit:
  - **Largest Contentful Paint (LCP)**
  - **Cumulative Layout Shift (CLS)**
  - **Interaction to Next Paint (INP)**
  - **WCAG 2.1 AA Accessibility**
  - **SEO Best Practices**

### 4. `dependabot.yml` — Automated Dependency Maintenance
- Scans `npm` dependencies weekly for security updates and minor version upgrades.
- Checks GitHub Actions versions weekly to keep CI tools on latest secure runners.

---

## 🔐 Required Secrets Configuration

To enable automated production deployments, configure these repository secrets under **GitHub Settings → Secrets and variables → Actions**:

| Secret Name | Purpose | Required For |
|---|---|---|
| `GITHUB_TOKEN` | Automated by GitHub; used for GHCR container push, releases & PR comments | All workflows |
| `VERCEL_TOKEN` *(Optional)* | Deploys directly to Vercel production | `cd.yml` |
| `VERCEL_ORG_ID` *(Optional)* | Vercel Organization ID | `cd.yml` |
| `VERCEL_PROJECT_ID` *(Optional)* | Vercel Project ID | `cd.yml` |

---

## 💻 Local Developer Verification

Run the exact commands executed in the CI pipeline prior to pushing:

```bash
# 1. Lint check (must be 0 errors)
npm run lint

# 2. Strict TypeScript type check
npm run type-check

# 3. Unit and smoke tests
npm test

# 4. Production build check
npm run build
```

---

## 🐳 Docker Container Deployment

You can build and run the optimized standalone container locally:

```bash
# Build production multi-stage container
docker build -t learnnova-ai:latest .

# Run on port 3000 with healthcheck
docker run -p 3000:3000 --rm --name learnnova learnnova-ai:latest
```
