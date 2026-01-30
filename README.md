_This project has been created as part of the 42 curriculum by camanica-, capapes, mafontser, mvelazqu._

# Full Web / Full-Stack Model (Adjusted)

Web / Full-Stack Development
│
├─ 1) Foundations (the Web platform)
│  │
│  ├─ HTML
│  │  ├─ what: structure + semantics
│  │  └─ depends on: Browser to render
│  │
│  ├─ CSS
│  │  ├─ what: layout + visuals
│  │  └─ depends on: Browser to apply
│  │
│  ├─ JavaScript
│  │  ├─ what: behavior + logic
│  │  └─ runs on: Browser and/or Node.js
│  │
│  └─ TypeScript
│     ├─ what: typed JavaScript (dev-time safety)
│     └─ depends on: compiler/tooling → outputs JavaScript
│
├─ 2) Data & Config Formats (structure & exchange)
│  │
│  ├─ JSON
│  │  ├─ what: API payloads + config
│  │  └─ used by: frontend ↔ backend data exchange
│  │
│  └─ YAML
│     ├─ what: configuration format
│     └─ used by: Docker Compose, CI/CD, infrastructure config
│
├─ 3) UI & Application Layer
│  │
│  ├─ React
│  │  ├─ what: UI library (components)
│  │  └─ depends on: JavaScript/TypeScript + Browser runtime
│  │
│  ├─ Next.js
│  │  ├─ what: React framework (routing, SSR/SSG, server features)
│  │  └─ depends on: React + Node.js (server) + Browser (client)
│  │
│  ├─ Tailwind CSS
│  │  ├─ what: utility-first styling system
│  │  └─ depends on: build tooling to generate CSS → consumed by Browser
│  │
│  ├─ Headless UI (category)
│  │  ├─ what: behavior/accessibility patterns without styling
│  │  └─ examples: Radix UI / React Aria / component libraries (as choices in UI ecosystem)
│  │
│  └─ three.js
│     ├─ what: 3D graphics library for the web
│     └─ depends on: Browser (WebGL) + JavaScript/TypeScript
│
├─ 4) Execution Environments (where code runs)
│  │
│  ├─ Browser
│  │  ├─ runs: frontend JavaScript
│  │  └─ consumes: HTTP APIs
│  │
│  ├─ Node.js
│  │  ├─ runs: Next.js server + tooling
│  │  └─ can host: HTTP APIs
│  │
│  └─ Python
│     ├─ runs: backend services (e.g., Django)
│     └─ depends on: Python runtime environment
│
├─ 5) Design & UX Workflow
│  │
│  └─ Figma
│     ├─ what: design source of truth (layouts, components, tokens)
│     └─ feeds: implementation (React + Tailwind)
│
├─ 6) Communication & Security
│  │
│  ├─ HTTP APIs
│  │  ├─ what: request/response boundary (often REST/JSON)
│  │  └─ used by: Browser, Postman
│  │
│  ├─ Cookies
│  │  ├─ what: browser-stored session/auth data
│  │  └─ depends on: Browser + server Set-Cookie
│  │
│  ├─ JWT
│  │  ├─ what: signed auth/claims token
│  │  └─ transported via: headers or cookies
│  │
│  ├─ Hashing
│  │  ├─ what: one-way password protection
│  │  └─ used by: backend auth flows
│  │
│  ├─ Salting
│  │  ├─ what: random data added before hashing (prevents rainbow-table reuse)
│  │  └─ used with: hashing for stored credentials
│  │
│  ├─ CORS
│  │  ├─ what: browser-enforced cross-origin rules
│  │  └─ depends on: Browser + server headers
│  │
│  └─ Environment secrets
│     ├─ what: keys/passwords not committed to git
│     └─ depends on: runtime environment (.env/CI/secret manager)
│
├─ 7) Backend Frameworks (server-side application layer)
│  │
│  └─ Django
│     ├─ what: Python web framework (routing, views, auth patterns)
│     └─ depends on: Python runtime + database driver/ORM (if used)
│
├─ 8) Data Layer (store and retrieve)
│  │
│  ├─ PostgreSQL
│  │  ├─ what: relational database (persistent truth)
│  │  └─ depends on: running DB service (local/compose/cloud)
│  │
│  ├─ SQL
│  │  ├─ what: query language for relational DBs
│  │  └─ used by: debugging, performance tuning, DB access layers
│  │
│  └─ ORM
│     ├─ what: maps objects ↔ tables, abstracts SQL
│     └─ depends on: DB connection + schema definitions
│
├─ 9) Package Management & Dependencies
│  │
│  ├─ npm / npx
│  │  ├─ what: install/run JS tooling and libraries
│  │  └─ depends on: Node.js
│  │
│  ├─ Python package management
│  │  ├─ pip
│  │  └─ Poetry (optional alternative)
│  │
│  ├─ package.json
│  │  └─ defines: JS dependencies + scripts
│  │
│  └─ node_modules
│     └─ contains: installed JS dependencies
│
├─ 10) Tooling & Developer Utilities
│  │
│  ├─ TypeScript compiler
│  │  └─ transforms: TypeScript → JavaScript
│  │
│  ├─ Vite (if used)
│  │  ├─ what: dev server + bundler (frontend-focused)
│  │  └─ depends on: Node.js + project config
│  │
│  ├─ Zod
│  │  ├─ what: runtime schema validation
│  │  └─ used for: validating API inputs/outputs and shared data contracts
│  │
│  └─ Seed data
│     ├─ what: initial/dev/demo data for the database
│     └─ depends on: database + schema (often executed via scripts/ORM)
│
├─ 11) API Contracts & Manual API Testing
│  │
│  ├─ Swagger / OpenAPI
│  │  ├─ what: API contract & documentation
│  │  └─ feeds: frontend integration + Postman collections
│  │
│  └─ Postman
│     ├─ what: API client for manual testing
│     └─ depends on: reachable HTTP APIs
│
├─ 12) Code Quality, Auditing & Accessibility
│  │
│  ├─ ESLint
│  │  └─ depends on: Node.js + config
│  │
│  ├─ Prettier
│  │  └─ depends on: Node.js + config
│  │
│  └─ Lighthouse
│     ├─ what: audits performance, accessibility, SEO, best practices
│     └─ depends on: running site/app in a browser context
│
├─ 13) Version Control & Collaboration
│  │
│  └─ Git
│     └─ tracks: history, branching, collaboration
│
├─ 14) Environment & Infrastructure
│  │
│  ├─ Docker
│  │  ├─ what: container runtime for consistent environments
│  │  └─ runs: app + DB as containers
│  │
│  └─ Docker Compose
│     ├─ what: multi-container orchestration (dev/CI)
│     └─ depends on: Docker + docker-compose.yml (YAML)
│
└─ 15) Monitoring & Observability
   │
   ├─ Prometheus
   │  ├─ what: metrics collection + time-series storage
   │  └─ depends on: exported metrics endpoints/instrumentation
   │
   ├─ Grafana
   │  ├─ what: dashboards/visualization for metrics
   │  └─ depends on: a metrics source (e.g., Prometheus)
   │
   └─ ELK (Elasticsearch + Logstash + Kibana)
      ├─ what: log ingestion, search, and visualization
      └─ depends on: application/system logs shipping pipeline
