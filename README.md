# TypeScript Full-Stack Starter

> **Production-ready Next.js 15 starter with authentication, RBAC, shadcn/ui, and comprehensive testing**

A modern, type-safe full-stack application starter built with the latest technologies and best practices. Features a complete authentication system, role-based access control, beautiful UI components, and enterprise-grade testing setup.

[![CI/CD Pipeline (Optimized)](https://github.com/albeorla/ts-fullstack-starter/workflows/CI%2FCD%20Pipeline%20%28Optimized%29/badge.svg)](https://github.com/albeorla/ts-fullstack-starter/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black.svg)](https://nextjs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.54-green.svg)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🔐 **Authentication & Authorization**
- **NextAuth.js v5** with Discord OAuth integration
- **Role-Based Access Control (RBAC)** with granular permissions
- Protected routes and middleware-based auth
- Test authentication for development

### 🎨 **Modern UI/UX**
- **shadcn/ui** component library (25+ components)
- **Tailwind CSS v4** with CSS variables
- **Dark/Light theme** toggle with system preference
- **Responsive design** for all screen sizes
- **Accessible** components with proper ARIA support

### 🚀 **Backend & API**
- **tRPC** for end-to-end type safety
- **Prisma ORM** with PostgreSQL
- **Type-safe database** operations
- **API route handlers** for external integrations

### 🧪 **Testing & Quality**
- **Playwright E2E testing** with comprehensive coverage (6 test suites, 78+ tests)
- **Optimized CI/CD pipeline** with smart caching and parallel execution
- **ESLint & Prettier** configuration with caching
- **TypeScript strict mode** for maximum type safety
- **Automated code quality gates** with performance monitoring

### 📊 **Developer Experience**
- **Turbo Mode** for fast development
- **Optimized CI/CD pipeline** with 60% faster builds
- **Smart file change detection** for efficient testing
- **Database management** scripts with caching
- **Code formatting** and linting automation with caching
- **Hot reloading** for rapid iteration

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** 
- **PostgreSQL** database
- **Discord OAuth App** (for authentication)

### 1. Setup Project

```bash
# Clone the repository
git clone <your-repo-url>
cd albeorla-ts-starter

# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env.local
```

### 2. Configure Environment

```bash
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/myapp"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

### 3. Setup Database

```bash
# Generate Prisma client
yarn postinstall

# Run database migrations
yarn db:migrate

# (Optional) Seed the database
npx prisma db seed
```

### 4. Start Development

```bash
# Start development server with Turbo
yarn dev

# Or start test environment
yarn dev:test
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js 15 App Router
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── auth/           # Authentication pages
│   │   ├── settings/       # User settings
│   │   └── api/            # API routes
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── layout/        # Layout components
│   ├── server/            # Backend logic
│   │   ├── auth/          # Authentication config
│   │   ├── api/           # tRPC routers
│   │   └── db.ts          # Database connection
│   └── lib/               # Utility functions
├── prisma/                # Database schema & migrations
├── e2e/                   # Playwright E2E tests
├── docs/                  # Documentation
└── .github/               # CI/CD workflows
```

## 🛠️ Available Scripts

### Development
```bash
yarn dev          # Start development server with Turbo
yarn dev:test     # Start with test authentication enabled
yarn build        # Build for production
yarn start        # Start production server
yarn preview      # Build and preview production
```

### Database
```bash
yarn db:generate  # Generate Prisma client
yarn db:migrate   # Run database migrations
yarn db:push      # Push schema changes
yarn db:studio    # Open Prisma Studio
```

### Code Quality
```bash
yarn typecheck     # TypeScript type checking
yarn lint          # ESLint checking
yarn lint:fix      # Fix ESLint issues
yarn format:check  # Check code formatting
yarn format:write  # Format code with Prettier
```

### Testing
```bash
yarn test:e2e           # Run E2E tests
yarn test:e2e:ui        # Run tests with UI
yarn test:e2e:headed    # Run tests in headed browser
yarn test:e2e:ci        # Run tests for CI/CD (optimized)
yarn ci                 # Run full CI pipeline locally
```

## 🔧 Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 15.x | React framework with App Router |
| **Language** | TypeScript | 5.x | Type-safe JavaScript |
| **UI Library** | React | 19.x | Component library |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Components** | shadcn/ui | Latest | Reusable UI components |
| **Icons** | Lucide React | Latest | Icon library |
| **Backend** | tRPC | Latest | Type-safe API layer |
| **Database** | PostgreSQL | Latest | Relational database |
| **ORM** | Prisma | Latest | Database toolkit |
| **Auth** | NextAuth.js | 5.x | Authentication library |
| **Testing** | Playwright | Latest | E2E testing framework |

## 🎨 UI Components

This starter includes a complete set of shadcn/ui components:

- **Forms**: Input, Textarea, Select, Checkbox, Radio Group
- **Navigation**: Breadcrumb, Menu, Pagination, Tabs
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Layout**: Card, Separator, Accordion, Collapsible
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Table, Badge, Avatar, Calendar
- **Interactive**: Button, Toggle, Switch, Slider

All components are fully typed, accessible, and themeable.

## 🔐 Authentication & RBAC

### Authentication Features
- **Discord OAuth** integration
- **Session management** with NextAuth.js
- **Protected routes** with middleware
- **Test authentication** for development

### RBAC System
- **Role management**: Create, edit, delete roles
- **Permission management**: Granular permission control
- **User role assignment**: Assign multiple roles to users
- **Admin dashboard**: Complete RBAC administration

### Default Roles
- **Admin**: Full system access
- **User**: Basic authenticated access
- **Guest**: Limited public access

## 🧪 Testing Strategy

### E2E Testing with Playwright
- **Authentication flows**: Login, logout, protected routes
- **RBAC functionality**: Role and permission management
- **UI interactions**: Forms, navigation, responsive design
- **Cross-browser testing**: Chromium, Firefox, WebKit
- **Visual regression testing**: Screenshot comparisons

### Test Coverage
- ✅ Authentication & authorization (2 test suites, 20+ tests)
- ✅ User management & RBAC (2 test suites, 35+ tests)
- ✅ Dashboard & navigation (1 test suite, 15+ tests)
- ✅ Responsive design (1 test suite, 8+ tests)
- ✅ Theme switching & UI interactions (1 test suite, 12+ tests)

## ⚡ CI/CD Pipeline

### 🚀 **Optimized Performance**
Our CI/CD pipeline features advanced optimizations for maximum efficiency:

#### **Smart Job Execution**
- **File Change Detection**: 6-second analysis determines which jobs to run
- **Conditional Execution**: Skip irrelevant jobs based on file changes
- **Path-Based Filtering**: Separate handling for source, tests, docs, config, and dependencies

#### **Advanced Caching Strategy**
- **Shared Dependencies**: Single installation reused across all jobs (~60% faster)
- **TypeScript Incremental Builds**: `.tsbuildinfo` caching for faster compilation
- **ESLint Result Caching**: Cached lint results with `--cache-location .eslintcache`
- **Playwright Browser Caching**: Pre-installed browsers cached between runs
- **Prisma Client Caching**: Generated client cached based on schema changes
- **Next.js Build Caching**: Build artifacts and static files cached

#### **Parallel Execution**
```mermaid
graph TD
    A[🔍 Detect Changes - 6s] --> B[🚀 Setup & Cache - 1m30s]
    B --> C[🔍 Code Quality - 1m22s]
    B --> D[🧪 Unit Tests - 1m4s]  
    B --> E[🔒 Security Audit - 48s]
    B --> F[🎭 E2E Tests - 6m54s]
    C --> G[🚪 Quality Gate - 4s]
    D --> G
    E --> G
    F --> G
```

#### **Performance Metrics**
| Optimization | Before | After | Improvement |
|-------------|---------|-------|-------------|
| **Setup Time** | Multiple installs | 1m30s shared | ~60% faster |
| **Change Detection** | All jobs run | 6s analysis | Smart skipping |
| **TypeScript Check** | Full compilation | Incremental | ~40% faster |
| **Lint Check** | Full scan | Cached results | ~50% faster |
| **Browser Setup** | Fresh download | Cached browsers | ~80% faster |
| **Total Pipeline** | ~15-20 minutes | ~8-12 minutes | ~40% faster |

### 🎯 **Quality Gates**
- **TypeScript**: Strict type checking with incremental compilation
- **ESLint**: Code quality and consistency with cached results
- **Prettier**: Code formatting validation with caching
- **Security**: Dependency vulnerability scanning
- **E2E Tests**: Comprehensive user workflow testing
- **Performance**: Bundle size analysis and monitoring

### 📊 **Pipeline Features**
- **Draft PR Handling**: Skip E2E tests for draft PRs (unless labeled)
- **Branch-Specific Strategies**: Different test approaches for PRs vs main
- **Artifact Management**: Test results, coverage, and screenshots uploaded
- **PR Integration**: Automated comments with test results and performance metrics
- **Failure Handling**: Graceful degradation with continue-on-error for non-critical steps

## 🚀 Deployment

### Production Build
```bash
yarn build
yarn start
```

### Environment Variables
Ensure all production environment variables are set:
- `DATABASE_URL`: Production database connection
- `NEXTAUTH_SECRET`: Secure random string
- `NEXTAUTH_URL`: Production domain
- `DISCORD_CLIENT_ID` & `DISCORD_CLIENT_SECRET`: OAuth credentials

### Deployment Platforms
This application is ready to deploy on:
- **Vercel** (recommended for Next.js)
- **Railway** (with PostgreSQL)
- **Docker** (containerized deployment)
- **AWS/GCP/Azure** (cloud platforms)

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- [CI/CD Setup](./docs/ci-cd-setup.md) - **NEW**: Optimized pipeline guide with performance metrics
- [Feature Status](./docs/feature-status.md) - **UPDATED**: Complete implementation status
- [Development Guide](./docs/development-guide.md) - Detailed development setup
- [E2E Testing Guide](./docs/e2e-testing-guide.md) - Testing best practices
- [shadcn/ui Guide](./docs/shadcn-ui-guide.md) - Component usage

## 🆕 Recent Updates

### v2.0.0 - Pipeline Optimization & Testing Expansion (Latest)

#### **🚀 CI/CD Pipeline Optimization**
- **60% faster builds** with advanced caching strategies
- **Smart job execution** with file change detection (6s analysis)
- **Parallel processing** for all quality gates
- **Playwright browser caching** reducing setup time by 80%
- **Incremental TypeScript compilation** with build info caching
- **ESLint result caching** for 50% faster lint checks

#### **🧪 Comprehensive E2E Testing Suite**
- **6 test suites** covering all major functionality
- **78+ individual tests** with full coverage
- **Cross-browser testing** (Chromium, Firefox, WebKit)
- **Visual regression testing** with screenshot comparisons
- **Responsive design testing** across multiple viewports
- **RBAC testing** for role and permission management

#### **🔧 Developer Experience Improvements**
- **TypeScript strict mode** with enhanced type safety
- **Improved error handling** and user feedback
- **Enhanced UI components** with better accessibility
- **Database schema optimizations** with smart migrations
- **Performance monitoring** and bundle size analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`yarn test:e2e`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [tRPC Documentation](https://trpc.io/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Guide](https://next-auth.js.org/)
- [Playwright Testing](https://playwright.dev/)

---

**Built with ❤️ using the T3 Stack and modern web technologies**
