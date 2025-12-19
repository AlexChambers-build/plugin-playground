---
domain: general
title: "Technical Decisions and Architecture"
description: "Technical Decisions and Architecture - comprehensive documentation covering overview, technology-stack-decisions, frontend-stack, react-19.2.0, vite-7.2.4 and more."

patterns:
  - overview
  - technology-stack-decisions
  - frontend-stack
  - react-19.2.0
  - vite-7.2.4
  - javascript-not-typescript
  - backend-stack
  - nestjs-11.1.9
  - typescript-5.9.3
  - node.js-runtime
  - architectural-decisions
  - clean-architecture-+-hexagonal
  - restful-api-design
  - component-based-ui
  - data-management-decisions
  - file-based-storage
  - state-management-frontend
  - api-communication
  - code-organization-decisions
  - module-based-organization-backend
  - component-co-location-frontend
  - security-decisions
  - cors-configuration
  - input-validation
  - authentication-and-authorization
  - performance-decisions
  - no-caching-layer
  - client-side-rendering-csr
  - development-experience-decisions
  - hot-module-replacement
  - linting-and-code-quality
  - environment-configuration
  - testing-decisions
  - no-tests-initially
  - deployment-decisions-future
  - deployment-architecture-tbd
  - key-principles-applied
  - solid-principles
  - kiss-keep-it-simple,-stupid
  - yagni-you-aren't-gonna-need-it
  - dry-don't-repeat-yourself
  - decision-log

keywords:

sections:
  - name: "Overview"
    line_start: 3
    line_end: 5
    summary: "This document outlines the key technical decisions, technology choices, and architectural patterns u..."
  - name: "Technology Stack Decisions"
    line_start: 6
    line_end: 120
    summary: "**Decision:** Use React as the frontend framework"
  - name: "Architectural Decisions"
    line_start: 121
    line_end: 201
    summary: "**Decision:** Structure backend using Clean Architecture principles with Hexagonal Architecture patt..."
  - name: "Data Management Decisions"
    line_start: 202
    line_end: 297
    summary: "**Decision:** Use JSON file for data persistence"
  - name: "Code Organization Decisions"
    line_start: 298
    line_end: 375
    summary: "**Decision:** Organize code by feature modules"
  - name: "Security Decisions"
    line_start: 376
    line_end: 466
    summary: "**Decision:** Enable CORS for all origins in development"
  - name: "Performance Decisions"
    line_start: 467
    line_end: 517
    summary: "**Decision:** No caching mechanism in initial version"
  - name: "Development Experience Decisions"
    line_start: 518
    line_end: 578
    summary: "**Decision:** Use Vite HMR for frontend, ts-node --watch for backend"
  - name: "Testing Decisions"
    line_start: 579
    line_end: 609
    summary: "**Decision:** Defer test implementation"
  - name: "Deployment Decisions (Future)"
    line_start: 610
    line_end: 626
    summary: "**Recommended Approach:**"
  - name: "Key Principles Applied"
    line_start: 627
    line_end: 672
    summary: "1. **Single Responsibility Principle**"
  - name: "Decision Log"
    line_start: 673
    line_end: 684
    summary: "Content about Decision Log"

complexity: intermediate
line_count: 684
last_updated: 2025-12-19

related:
---

# Technical Decisions and Architecture

## Overview
This document outlines the key technical decisions, technology choices, and architectural patterns used in the Todo List application. All decisions are guided by SOLID principles, KISS (Keep It Simple, Stupid), YAGNI (You Aren't Gonna Need It), and DRY (Don't Repeat Yourself).

## Technology Stack Decisions

### Frontend Stack

#### React 19.2.0
**Decision:** Use React as the frontend framework

**Rationale:**
- **Component-based architecture:** Aligns with SRP (Single Responsibility Principle)
- **Large ecosystem:** Extensive libraries and community support
- **Declarative UI:** Simpler reasoning about UI state
- **Hooks API:** Functional programming paradigm, easier to test and compose
- **Virtual DOM:** Efficient rendering and updates

**Alternatives Considered:**
- Vue.js: Simpler learning curve but smaller ecosystem
- Angular: Too heavy for a simple todo app (YAGNI)
- Vanilla JavaScript: Would require more boilerplate (DRY violation)

**Trade-offs:**
- Pros: Fast development, reusable components, strong typing with TypeScript (future)
- Cons: Larger bundle size than vanilla JS, requires build tooling

#### Vite 7.2.4
**Decision:** Use Vite as the build tool

**Rationale:**
- **Fast development server:** Near-instant hot module replacement (HMR)
- **Modern ESM-based:** Leverages native ES modules for speed
- **Simple configuration:** Works out of the box (KISS)
- **Optimized production builds:** Uses Rollup for efficient bundling
- **Developer experience:** Fast feedback loop improves productivity

**Alternatives Considered:**
- Create React App: Deprecated and slower
- Webpack: More complex configuration needed (against KISS)
- Parcel: Less mature ecosystem

**Trade-offs:**
- Pros: Lightning-fast dev server, minimal config, modern architecture
- Cons: Relatively newer (less battle-tested than Webpack)

#### JavaScript (Not TypeScript)
**Decision:** Use JavaScript instead of TypeScript for frontend

**Rationale:**
- **Simplicity:** Faster initial development (KISS)
- **YAGNI:** Type safety not critical for small app
- **Less tooling:** No compilation overhead for type checking

**Future Consideration:**
- Migrate to TypeScript when app complexity increases
- Benefits: Type safety, better IDE support, fewer runtime errors
- Timing: When business logic becomes complex or team grows

**Trade-offs:**
- Pros: Faster prototyping, less boilerplate
- Cons: Runtime errors harder to catch, refactoring more error-prone

### Backend Stack

#### NestJS 11.1.9
**Decision:** Use NestJS as the backend framework

**Rationale:**
- **TypeScript-first:** Type safety and better developer experience
- **Modular architecture:** Enforces separation of concerns (SOLID)
- **Dependency injection:** Supports Dependency Inversion Principle
- **Decorator-based:** Clean, declarative syntax for routes and middleware
- **Built-in features:** Validation, exception filters, guards out of the box
- **Scalable:** Supports microservices and advanced patterns
- **Clean Architecture friendly:** Easy to implement hexagonal/clean architecture

**Alternatives Considered:**
- Express.js: Too minimal, requires more boilerplate
- Fastify: Faster but less structured
- Koa: Lightweight but minimal ecosystem
- Hapi: More opinionated but smaller community

**Trade-offs:**
- Pros: Enterprise-ready, great DX, enforces best practices
- Cons: Steeper learning curve, more overhead for simple apps

#### TypeScript 5.9.3
**Decision:** Use TypeScript for backend

**Rationale:**
- **Type safety:** Catch errors at compile time
- **Better refactoring:** IDE support for renaming, finding references
- **Self-documenting:** Types serve as inline documentation
- **Required by NestJS:** Framework built for TypeScript
- **Interface Segregation:** TypeScript interfaces support ISP

**Trade-offs:**
- Pros: Fewer bugs, better maintainability, excellent tooling
- Cons: Compilation step, more verbose code

#### Node.js Runtime
**Decision:** Use Node.js as the runtime environment

**Rationale:**
- **JavaScript ecosystem:** Share language with frontend
- **Async I/O:** Non-blocking operations suitable for I/O-bound tasks
- **NPM ecosystem:** Largest package registry
- **Fast development:** Quick prototyping and iteration

**Alternatives Considered:**
- Python (Django/Flask): Different language, slower development cycles
- Java (Spring Boot): Too heavy for simple app (YAGNI)
- Go: Faster but less ecosystem, steeper learning curve

**Trade-offs:**
- Pros: Fast development, shared language, huge ecosystem
- Cons: Single-threaded (not ideal for CPU-intensive tasks)

## Architectural Decisions

### Clean Architecture + Hexagonal Architecture
**Decision:** Structure backend using Clean Architecture principles with Hexagonal Architecture patterns

**Rationale:**
- **SRP:** Each layer has a single responsibility
- **OCP:** Open for extension via interfaces, closed for modification
- **DIP:** High-level modules don't depend on low-level modules
- **Testability:** Business logic isolated from infrastructure
- **Flexibility:** Easy to swap data sources (file → database)
- **Maintainability:** Clear boundaries between layers

**Implementation:**
- **Domain Layer:** Pure business entities and interfaces (`todo.interface.ts`)
- **Application Layer:** Business logic and use cases (`todos.service.ts`)
- **Infrastructure Layer:** Data access implementation (file operations in service)
- **Presentation Layer:** HTTP adapters (`todos.controller.ts`)

**Future Improvements:**
- Extract repository pattern (currently mixed in service)
- Create dedicated repository implementations
- Add DTOs for request/response validation

**Trade-offs:**
- Pros: Highly maintainable, testable, flexible
- Cons: More files and abstractions for simple features

### RESTful API Design
**Decision:** Use REST architectural style for HTTP API

**Rationale:**
- **Industry standard:** Well-understood by developers
- **Stateless:** Each request self-contained (scalability)
- **Resource-oriented:** Clear mapping to business entities
- **HTTP semantics:** Leverage HTTP verbs and status codes
- **KISS:** Simpler than GraphQL for basic CRUD operations

**Endpoint Design:**
- `GET /todos` - List resources (idempotent, safe)
- `POST /todos` - Create resource (non-idempotent)
- `PATCH /todos/:id` - Partial update (idempotent)

**Alternatives Considered:**
- GraphQL: Overkill for simple CRUD (YAGNI)
- gRPC: Better performance but more complex
- WebSockets: Not needed for current use case

**Trade-offs:**
- Pros: Simple, well-understood, cacheable
- Cons: Over-fetching/under-fetching (solved by GraphQL)

### Component-Based UI Architecture
**Decision:** Build frontend using composable components

**Rationale:**
- **SRP:** Each component has one responsibility
- **DRY:** Reusable components across application
- **OCP:** Extend functionality through composition
- **Maintainability:** Isolated changes, easier testing

**Component Hierarchy:**
```
App (Container)
├── Modal (Presentational)
│   └── TodoForm (Logic)
└── TodoColumns (Presentational)
    ├── TodoColumn (Presentational)
    │   └── TodoItem (Presentational)
    └── TodoColumn (Presentational)
        └── TodoItem (Presentational)
```

**Current State:**
- Modal extracted as separate component
- Opportunity to extract: TodoList, TodoItem components (DRY)

**Trade-offs:**
- Pros: Reusable, testable, maintainable
- Cons: More files, needs good component design

## Data Management Decisions

### File-Based Storage
**Decision:** Use JSON file for data persistence

**Rationale:**
- **KISS:** Simplest possible persistence mechanism
- **YAGNI:** Database overkill for prototype/demo
- **No dependencies:** No external database setup required
- **Easy debugging:** Human-readable data format
- **Portable:** Works on any OS without installation

**Implementation:**
- Location: `backend/data/todos.json`
- Format: JSON array of todo objects
- Access: Node.js `fs.promises` API

**Limitations:**
- No concurrent write handling (race conditions possible)
- No transactions or rollback
- Entire file loaded into memory
- No query optimization
- Not suitable for production at scale

**Migration Path:**
- Small scale (<100 todos): SQLite (embedded database)
- Medium scale (<10k users): PostgreSQL (relational, ACID)
- Large scale (>10k users): PostgreSQL + Redis (caching)

**Trade-offs:**
- Pros: Zero setup, simple implementation, good for demo
- Cons: No concurrency control, no scalability, no backup

### State Management (Frontend)
**Decision:** Use React's built-in useState for state management

**Rationale:**
- **KISS:** No additional libraries needed
- **YAGNI:** Application state is simple enough
- **Co-location:** State lives close to usage
- **Less boilerplate:** No actions, reducers, or store setup

**State Structure:**
```javascript
const [todos, setTodos] = useState([]);           // List of todos
const [isModalOpen, setIsModalOpen] = useState(false); // UI state
const [todoForm, setTodoForm] = useState({ title: '', description: '' }); // Form state
```

**When to Add State Management Library:**
- State shared across many components (prop drilling >3 levels)
- Complex state transformations
- Need for time-travel debugging
- Multiple sources of truth

**Alternatives Considered:**
- Redux: Too much boilerplate for simple app (YAGNI)
- Context API: Not needed yet, useState sufficient
- Zustand/Jotai: Would be next step if complexity increases

**Trade-offs:**
- Pros: Simple, no dependencies, easy to understand
- Cons: Doesn't scale to complex state, may cause prop drilling

### API Communication
**Decision:** Use native Fetch API for HTTP requests

**Rationale:**
- **No dependencies:** Built into modern browsers
- **KISS:** Straightforward request/response pattern
- **Standards-based:** Web API standard
- **Sufficient for needs:** Simple GET, POST, PATCH operations

**Implementation Pattern:**
```javascript
const response = await fetch(`${API_URL}/todos`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
const todo = await response.json();
```

**Future Considerations:**
- Extract to service layer (DRY, SRP)
- Add error handling middleware
- Consider axios if need interceptors or advanced features

**Alternatives Considered:**
- Axios: More features but unnecessary dependency (YAGNI)
- React Query: Great for caching but overkill for simple app

**Trade-offs:**
- Pros: Zero dependencies, browser-native, sufficient
- Cons: More verbose, manual error handling, no request cancellation

## Code Organization Decisions

### Module-Based Organization (Backend)
**Decision:** Organize code by feature modules

**Rationale:**
- **SRP:** Each module handles one business domain
- **OCP:** Add new features without modifying existing modules
- **Cohesion:** Related code stays together
- **Scalability:** Easy to split into microservices later

**Current Structure:**
```
src/
├── todos/              # Todo feature module
│   ├── todo.interface.ts
│   ├── todos.service.ts
│   ├── todos.controller.ts
│   └── todos.module.ts
├── app.module.ts       # Root module
└── main.ts             # Entry point
```

**Future Structure:**
```
src/
├── modules/
│   ├── todos/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   └── users/          # New feature module
├── shared/             # Shared utilities
└── main.ts
```

**Trade-offs:**
- Pros: Scalable, maintainable, clear boundaries
- Cons: More directories for simple features

### Component Co-location (Frontend)
**Decision:** Keep components, styles, and logic together

**Rationale:**
- **Cohesion:** Related files in one place
- **Easy deletion:** Remove feature by deleting folder
- **Developer experience:** Less navigation between files

**Current Structure:**
```
src/
├── App.jsx         # Component + logic
├── App.css         # Component styles
├── main.jsx        # Entry point
└── index.css       # Global styles
```

**Recommended Evolution:**
```
src/
├── components/
│   ├── Modal/
│   │   ├── Modal.jsx
│   │   ├── Modal.css
│   │   └── Modal.test.jsx
│   └── TodoItem/
│       ├── TodoItem.jsx
│       └── TodoItem.css
├── services/
│   └── api.js
└── App.jsx
```

**Trade-offs:**
- Pros: Better organization, easier to reason about
- Cons: Need discipline to maintain structure

## Security Decisions

### CORS Configuration
**Decision:** Enable CORS for all origins in development

**Rationale:**
- **Development ease:** Frontend and backend on different ports
- **Flexibility:** Allow frontend dev server (port 5173) to access backend (port 3000)

**Current Implementation:**
```typescript
app.enableCors(); // Allows all origins
```

**Production Requirement:**
```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
});
```

**Security Implications:**
- Development: Open CORS acceptable
- Production: MUST restrict to specific origins

**Trade-offs:**
- Pros: Easy development, no CORS errors
- Cons: Security risk if deployed to production as-is

### Input Validation
**Decision:** Defer comprehensive input validation (current state)

**Rationale:**
- **YAGNI:** Not critical for prototype phase
- **Focus on features:** Validate product-market fit first

**Current State:**
- Frontend: Basic client-side validation (empty title check)
- Backend: No validation middleware

**Required for Production:**
- Add class-validator decorators to DTOs
- Enable global validation pipe
- Sanitize inputs to prevent XSS
- Validate all user inputs server-side

**Example Future Implementation:**
```typescript
export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
}
```

**Trade-offs:**
- Current: Faster development, security risk
- Future: Slower development, production-ready

### Authentication and Authorization
**Decision:** No authentication in initial version

**Rationale:**
- **YAGNI:** Not needed for single-user prototype
- **Complexity:** Adds significant development time
- **Focus:** Validate core functionality first

**Future Requirements:**
- JWT-based authentication
- User registration and login
- Todo ownership (userId foreign key)
- Authorization guards on endpoints

**Implementation Path:**
1. Add User entity and module
2. Implement Passport.js with JWT strategy
3. Add auth guards to protect endpoints
4. Add userId to Todo entity
5. Filter todos by authenticated user

**Trade-offs:**
- Current: Simpler, faster development, not production-ready
- Future: Secure, multi-user capable, more complex

## Performance Decisions

### No Caching Layer
**Decision:** No caching mechanism in initial version

**Rationale:**
- **YAGNI:** Performance adequate for small datasets
- **KISS:** Avoid premature optimization
- **Correctness first:** Ensure business logic works

**Current Performance:**
- Each request reads from file
- No in-memory cache
- No HTTP caching headers

**Future Optimization:**
- In-memory cache (NestJS Cache Module)
- Redis for distributed caching
- HTTP ETag headers for browser caching

**When to Add Caching:**
- Response time >500ms
- Database queries become bottleneck
- High read-to-write ratio

**Trade-offs:**
- Current: Simple, no cache invalidation complexity
- Future: Faster responses, added complexity

### Client-Side Rendering (CSR)
**Decision:** Use client-side rendering only

**Rationale:**
- **KISS:** Simplest rendering approach
- **Dynamic content:** Todo list updates frequently
- **YAGNI:** SEO not critical for todo app
- **Vite optimized:** Fast load times with code splitting

**Alternatives:**
- SSR (Next.js): Better SEO, slower development
- SSG: Not suitable for dynamic data
- Islands Architecture: Overkill for simple SPA

**Future Considerations:**
- If SEO becomes important, add SSR
- If initial load performance critical, consider SSG for shell

**Trade-offs:**
- Pros: Simple, fast development, good DX
- Cons: Slower initial render, no SEO benefits

## Development Experience Decisions

### Hot Module Replacement
**Decision:** Use Vite HMR for frontend, ts-node --watch for backend

**Rationale:**
- **Fast feedback:** See changes instantly
- **Developer productivity:** Less context switching
- **State preservation:** HMR maintains component state

**Implementation:**
- Frontend: Vite dev server with HMR (`npm run dev`)
- Backend: ts-node watch mode (`npm run start:dev`)

**Trade-offs:**
- Pros: Excellent DX, fast iteration
- Cons: Slight memory overhead

### Linting and Code Quality
**Decision:** Use ESLint for frontend, defer for backend

**Rationale:**
- **Frontend:** React-specific rules helpful (hooks, a11y)
- **Backend:** TypeScript compiler catches most issues
- **YAGNI:** Additional linting can be added later

**Current Setup:**
- ESLint with React plugins on frontend
- No ESLint on backend (TypeScript compiler only)

**Future Improvements:**
- Add ESLint to backend with recommended rules
- Add Prettier for consistent formatting
- Add pre-commit hooks with Husky

**Trade-offs:**
- Current: Minimal setup, some inconsistency risk
- Future: Enforced code style, slower commits

### Environment Configuration
**Decision:** Hardcode configuration in development

**Rationale:**
- **KISS:** No environment variable management needed
- **YAGNI:** Single environment during development

**Current Implementation:**
```javascript
const API_URL = 'http://localhost:3000'; // Frontend
const PORT = 3000; // Backend
```

**Production Requirements:**
- Use environment variables for all config
- Implement @nestjs/config module
- Use Vite environment variables (`import.meta.env`)

**Trade-offs:**
- Current: Simple, fast setup
- Future: Flexible, deployment-ready

## Testing Decisions

### No Tests Initially
**Decision:** Defer test implementation

**Rationale:**
- **YAGNI:** Requirements still evolving
- **Speed:** Faster prototyping without tests
- **Technical debt:** Acknowledged, planned for future

**Future Testing Strategy:**
1. **Unit Tests:** Service and business logic
2. **Integration Tests:** API endpoints
3. **E2E Tests:** Critical user flows
4. **Component Tests:** React components

**Recommended Tools:**
- Jest for unit/integration tests
- React Testing Library for components
- Supertest for API integration tests
- Playwright or Cypress for E2E

**When to Add Tests:**
- Before production deployment
- When refactoring complex logic
- For critical business rules

**Trade-offs:**
- Current: Faster development, higher bug risk
- Future: Confidence in changes, slower initial development

## Deployment Decisions (Future)

### Deployment Architecture (TBD)
**Recommended Approach:**
- **Frontend:** Static hosting (Vercel, Netlify, Cloudflare Pages)
- **Backend:** Container deployment (Docker + Cloud Run, Railway, Render)
- **Database:** Managed PostgreSQL (Supabase, Neon, Railway)

**Rationale:**
- **SRP:** Separate frontend and backend deployments
- **Scalability:** Scale frontend and backend independently
- **Cost-effective:** Free tiers available for small apps

**Trade-offs:**
- Separate deployments: More complexity, better scalability
- Monolith option: Simpler, less flexible

## Key Principles Applied

### SOLID Principles
1. **Single Responsibility Principle**
   - Each module handles one feature (todos)
   - Each service has focused methods
   - Components have single purposes

2. **Open/Closed Principle**
   - Services use interfaces (can extend without modifying)
   - React components use composition (extend via props)

3. **Liskov Substitution Principle**
   - Repository pattern allows swapping implementations
   - React components accept generic props

4. **Interface Segregation Principle**
   - Small, focused interfaces (ITodo)
   - Props interfaces specific to component needs

5. **Dependency Inversion Principle**
   - Services depend on interfaces, not implementations
   - Dependency injection in NestJS

### KISS (Keep It Simple, Stupid)
- File storage instead of database
- useState instead of Redux
- Fetch API instead of Axios
- No complex build configuration

### YAGNI (You Aren't Gonna Need It)
- No authentication (until multi-user needed)
- No caching (until performance issue)
- No tests (until stabilized)
- No TypeScript on frontend (until needed)

### DRY (Don't Repeat Yourself)
- Reusable Modal component
- Shared Todo interface
- Centralized API_URL constant

**Areas for Improvement:**
- Extract API service layer (repeated fetch logic)
- Extract TodoItem component (repeated rendering)
- Extract form validation logic

## Decision Log

| Date       | Decision                  | Rationale            | Status  |
|------------|---------------------------|----------------------|---------|
| 2024-12-18 | Use NestJS for backend    | Clean architecture   | Active  |
| 2024-12-18 | Use React + Vite          | Modern, fast DX      | Active  |
| 2024-12-18 | File-based storage        | KISS, YAGNI          | Active  |
| 2024-12-18 | No authentication         | YAGNI                | Active  |
| TBD        | Migrate to PostgreSQL     | Scalability          | Planned |
| TBD        | Add TypeScript to FE      | Type safety          | Planned |
| TBD        | Add test suite            | Production readiness | Planned |
