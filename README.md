# T3 Stack + shadcn/ui Starter

Modern full-stack TypeScript application with authentication, RBAC, and a complete UI component library.

## 🚀 Tech Stack

This project uses cutting-edge technologies:

- **Framework**: Next.js ^15.0.1-canary.0 with React ^19.1.0
- **Styling**: Tailwind CSS ^4.1.11 + shadcn/ui (complete suite including Button, Card, Table, etc.)
- **Backend**: tRPC with RBAC routers (user, role, permission)
- **Database**: PostgreSQL + Prisma ORM ^6.11.1 (with RBAC schema)
- **Authentication**: NextAuth.js ^5.0.0 with Discord OAuth
- **Testing**: Playwright ^1.50.0 for E2E (run via `yarn test:e2e:ci --max-failures=0 --reporter=console`)

## ✨ Features
- Role-Based Access Control (RBAC) with admin panels for users, roles, and permissions
- Dashboard with responsive UI and theme toggle
- Profile settings and authentication flows

## ✨ shadcn/ui Implementation

This project showcases a **production-ready shadcn/ui setup** with:

- **Tailwind v4**: Using the latest `@theme` directive for CSS variables
- **Complete Component Suite**: All major shadcn/ui components pre-installed
- **Modern Variants**: Class Variance Authority (CVA) for component variants
- **Proper Theming**: CSS variables with dark/light mode support
- **Type Safety**: Full TypeScript integration across all components

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## ⚙️ Local E2E Setup

Prepare the repository for Playwright tests using the provided setup script:

```bash
# Install browsers, generate Prisma client, and seed the database
./setup-tests.sh

# Then run the CI mode tests
yarn test:e2e:ci
```

This script requires internet access to download Playwright browsers.

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## 🐳 Docker E2E Testing

Run the Playwright test suite inside Docker with a bundled PostgreSQL database:

```bash
# Build services and run tests
docker-compose up --build --exit-code-from e2e e2e
```

The `docker-compose.yml` file provisions a `postgres:15` container and a test runner image based on the official Playwright image, ensuring consistent results locally and in CI.

Our GitHub Actions workflow uses the same command to run E2E tests in the pipeline.

## ⚙️ CI/CD
See the optimized workflow in .github/workflows/ci-optimized.yml for change detection, caching, and E2E testing with Docker.

Last Updated: October 2024
