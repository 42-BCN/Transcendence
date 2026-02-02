_This project has been created as part of the 42 curriculum by camanica-, [capapes](https://github.com/carolinapapes), mafontser, mvelazqu._

### 📖 Documentation

- [Resources](docs/resources.md)

# Web / Full-Stack Development

### 1. Foundations (the Web platform)

- **HTML**
  - what: structure + semantics
  - depends on: Browser to render

- **CSS**
  - what: layout + visuals
  - depends on: Browser to apply

- **JavaScript**
  - what: behavior + logic
  - runs on: Browser and/or Node.js

- **TypeScript**
  - what: typed JavaScript (dev-time safety)
  - depends on: compiler/tooling → outputs JavaScript

### 2. Data & Config Formats (structure & exchange)

- **JSON**
  - what: API payloads + config
  - used by: frontend ↔ backend data exchange

- **YAML**
  - what: configuration format
  - used by: Docker Compose, CI/CD, infrastructure config

### 3. UI & Application Layer

- **React**
  - what: UI library (components)
  - depends on: JavaScript/TypeScript + Browser runtime

- **Next.js**
  - what: React framework (routing, SSR/SSG, server features)
  - depends on: React + Node.js (server) + Browser (client)

- **Tailwind CSS**
  - what: utility-first styling system
  - depends on: build tooling → CSS → Browser

- **Headless UI (category)**
  - what: behavior/accessibility patterns without styling
  - examples: Radix UI / React Aria / component libraries

- **three.js**
  - what: 3D graphics library for the web
  - depends on: Browser (WebGL) + JavaScript/TypeScript

### 4. Execution Environments (where code runs)

- **Browser**
  - runs: frontend JavaScript
  - consumes: HTTP APIs

- **Node.js**
  - runs: Next.js server + tooling
  - can host: HTTP APIs

- **Python**
  - runs: backend services (e.g., Django)
  - depends on: Python runtime environment

### 5. Design & UX Workflow

- **Figma**
  - what: design source of truth (layouts, components, tokens)
  - feeds: implementation (React + Tailwind)

### 6. Communication & Security

- **HTTP APIs**
  - what: request/response boundary (often REST/JSON)
  - used by: Browser, Postman

- **Cookies**
  - what: browser-stored session/auth data
  - depends on: Browser + server Set-Cookie

- **JWT**
  - what: signed auth/claims token
  - transported via: headers or cookies

- **Hashing**
  - what: one-way password protection
  - used by: backend auth flows

- **Salting**
  - what: random data added before hashing
  - used with: hashing for stored credentials

- **CORS**
  - what: browser-enforced cross-origin rules
  - depends on: Browser + server headers

- **Environment secrets**
  - what: keys/passwords not committed to git
  - depends on: runtime environment (.env/CI/secret manager)

### 7. Backend Frameworks

- **Django**
  - what: Python web framework
  - depends on: Python runtime + database layer

### 8. Data Layer (store and retrieve)

- **PostgreSQL**
  - what: relational database (persistent truth)
  - depends on: running DB service

- **SQL**
  - what: query language
  - used by: debugging, tuning, access layers

- **ORM**
  - what: maps objects ↔ tables
  - depends on: DB connection + schema

### 9. Package Management & Dependencies

- **npm / npx**
  - what: install/run JS tooling and libraries
  - depends on: Node.js

- **pip / Poetry**
  - what: Python packages

- **package.json**
  - defines: JS dependencies + scripts

- **node_modules**
  - contains: installed JS dependencies

### 10. Tooling & Developer Utilities

- **TypeScript compiler**
  - transforms: TypeScript → JavaScript

- **Vite**
  - what: dev server + bundler
  - depends on: Node.js + project config

- **Zod**
  - what: runtime schema validation
  - used for: shared contracts

- **Seed data**
  - what: initial/dev/demo DB data
  - depends on: database + schema

### 11. API Contracts & Manual API Testing

- **Swagger / OpenAPI**
  - what: API contract & documentation

- **Postman**
  - what: API client for manual testing

### 12. Code Quality, Auditing & Accessibility

- **ESLint**
  - what: linting

- **Prettier**
  - what: formatting

- **Lighthouse**
  - what: performance, accessibility, SEO audits

### 13. Version Control & Collaboration

- **Git**
  - tracks: history, branching, collaboration

### 14. Environment & Infrastructure

- **Docker**
  - what: container runtime
  - runs: app + DB

- **Docker Compose**
  - what: multi-container orchestration
  - depends on: YAML config

### 15. Monitoring & Observability

- **Prometheus**
  - what: metrics collection

- **Grafana**
  - what: dashboards

- **ELK Stack**
  - what: centralized logging
