_This project has been created as part of the 42 curriculum by camanica-, capapes, mafontser, mvelazqu._


# Full Web / Full-Stack Model

Web / Full-Stack Development
│
├─ 1) Foundations (the Web platform)
│  │
│  ├─ <details open>
│  │   <summary><strong>HTML</strong></summary>
│  │
│  │   - **what:** structure + semantics  
│  │   - **depends on:** Browser to render
│  │
│  │   </details>
│  │
│  ├─ <details open>
│  │   <summary><strong>CSS</strong></summary>
│  │
│  │   - **what:** layout + visuals  
│  │   - **depends on:** Browser to apply
│  │
│  │   </details>
│  │
│  ├─ <details open>
│  │   <summary><strong>JavaScript</strong></summary>
│  │
│  │   - **what:** behavior + logic  
│  │   - **runs on:** Browser and/or Node.js
│  │
│  │   </details>
│  │
│  └─ <details open>
│      <summary><strong>TypeScript</strong></summary>
│
│      - **what:** typed JavaScript (dev-time safety)  
│      - **depends on:** compiler/tooling → outputs JavaScript
│
│      </details>
│
├─ 2) Data & Config Formats (structure & exchange)
│  │
│  ├─ <details>
│  │   <summary><strong>JSON</strong></summary>
│  │
│  │   - **what:** API payloads + config  
│  │   - **used by:** frontend ↔ backend data exchange
│  │
│  │   </details>
│  │
│  └─ <details>
│      <summary><strong>YAML</strong></summary>
│
│      - **what:** configuration format  
│      - **used by:** Docker Compose, CI/CD, infrastructure config
│
│      </details>
│
├─ 3) UI & Application Layer
│  │
│  ├─ <details open>
│  │   <summary><strong>React</strong></summary>
│  │
│  │   - **what:** UI library (components)  
│  │   - **depends on:** JavaScript/TypeScript + Browser runtime
│  │
│  │   </details>
│  │
│  ├─ <details open>
│  │   <summary><strong>Next.js</strong></summary>
│  │
│  │   - **what:** React framework (routing, SSR/SSG, server features)  
│  │   - **depends on:** React + Node.js (server) + Browser (client)
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>Tailwind CSS</strong></summary>
│  │
│  │   - **what:** utility-first styling system  
│  │   - **depends on:** build tooling to generate CSS → consumed by Browser
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>Headless UI</strong></summary>
│  │
│  │   - **what:** behavior/accessibility patterns without styling  
│  │   - **examples:** Radix UI / React Aria / component libraries
│  │
│  │   </details>
│  │
│  └─ <details>
│      <summary><strong>three.js</strong></summary>
│
│      - **what:** 3D graphics library for the web  
│      - **depends on:** Browser (WebGL) + JavaScript/TypeScript
│
│      </details>
│
├─ 4) Execution Environments (where code runs)
│  │
│  ├─ <details>
│  │   <summary><strong>Browser</strong></summary>
│  │
│  │   - runs: frontend JavaScript  
│  │   - consumes: HTTP APIs
│  │
│  │   </details>
│  │
│  ├─ <details open>
│  │   <summary><strong>Node.js</strong></summary>
│  │
│  │   - runs: Next.js server + tooling  
│  │   - can host: HTTP APIs
│  │
│  │   </details>
│  │
│  └─ <details>
│      <summary><strong>Python</strong></summary>
│
│      - runs: backend services (e.g., Django)  
│      - depends on: Python runtime environment
│
│      </details>
│
├─ 5) Design & UX Workflow
│  │
│  └─ <details>
│      <summary><strong>Figma</strong></summary>
│
│      - what: design source of truth (layouts, components, tokens)  
│      - feeds: implementation (React + Tailwind)
│
│      </details>
│
├─ 6) Communication & Security
│  │
│  ├─ <details>
│  │   <summary><strong>HTTP APIs</strong></summary>
│  │
│  │   - what: request/response boundary (often REST/JSON)  
│  │   - used by: Browser, Postman
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>Cookies</strong></summary>
│  │
│  │   - what: browser-stored session/auth data  
│  │   - depends on: Browser + server Set-Cookie
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>JWT</strong></summary>
│  │
│  │   - what: signed auth/claims token  
│  │   - transported via: headers or cookies
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>Hashing</strong></summary>
│  │
│  │   - what: one-way password protection  
│  │   - used by: backend auth flows
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>Salting</strong></summary>
│  │
│  │   - what: random data added before hashing  
│  │   - used with: hashing for stored credentials
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>CORS</strong></summary>
│  │
│  │   - what: browser-enforced cross-origin rules  
│  │   - depends on: Browser + server headers
│  │
│  │   </details>
│  │
│  └─ <details>
│      <summary><strong>Environment secrets</strong></summary>
│
│      - what: keys/passwords not committed to git  
│      - depends on: runtime environment (.env/CI/secret manager)
│
│      </details>
│
├─ 7) Backend Frameworks
│  │
│  └─ <details>
│      <summary><strong>Django</strong></summary>
│
│      - what: Python web framework (routing, views, auth patterns)  
│      - depends on: Python runtime + database driver/ORM
│
│      </details>
│
├─ 8) Data Layer (store and retrieve)
│  │
│  ├─ <details open>
│  │   <summary><strong>PostgreSQL</strong></summary>
│  │
│  │   - what: relational database (persistent truth)  
│  │   - depends on: running DB service
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>SQL</strong></summary>
│  │
│  │   - what: query language for relational DBs  
│  │   - used by: debugging, performance tuning
│  │
│  │   </details>
│  │
│  └─ <details>
│      <summary><strong>ORM</strong></summary>
│
│      - what: maps objects ↔ tables  
│      - depends on: DB connection + schema
│
│      </details>
│
├─ 9) Package Management & Dependencies
│  │
│  ├─ <details>
│  │   <summary><strong>npm / npx</strong></summary>
│  │
│  │   - what: install/run JS tooling  
│  │   - depends on: Node.js
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>pip / Poetry</strong></summary>
│  │
│  │   - what: Python package management
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>package.json</strong></summary>
│  │
│  │   - defines: JS dependencies + scripts
│  │
│  │   </details>
│  │
│  └─ <details>
│      <summary><strong>node_modules</strong></summary>
│
│      - contains: installed JS dependencies
│
│      </details>
│
├─ 10) Tooling & Developer Utilities
│  │
│  ├─ <details>
│  │   <summary><strong>TypeScript Compiler</strong></summary>
│  │
│  │   - transforms: TypeScript → JavaScript
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>Vite</strong></summary>
│  │
│  │   - what: dev server + bundler  
│  │   - depends on: Node.js + config
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>Zod</strong></summary>
│  │
│  │   - what: runtime schema validation  
│  │   - used for: API validation
│  │
│  │   </details>
│  │
│  └─ <details>
│      <summary><strong>Seed data</strong></summary>
│
│      - what: initial/dev/demo data  
│      - depends on: database + schema
│
│      </details>
│
├─ 11) API Contracts & Manual Testing
│  │
│  ├─ <details>
│  │   <summary><strong>Swagger / OpenAPI</strong></summary>
│  │
│  │   - what: API contract & documentation  
│  │   - feeds: frontend + Postman
│  │
│  │   </details>
│  │
│  └─ <details>
│     <summary><strong>Postman</strong></summary>
│
│      - what: API client for manual testing  
│  │   - depends on: reachable APIs
│
│      </details>
│
├─ 12) Code Quality, Auditing & Accessibility
│  │
│  ├─ <details>
│  │   <summary><strong>ESLint</strong></summary>
│  │
│  │   - depends on: Node.js + config
│  │
│  │   </details>
│  │
│  ├─ <details>
│  │   <summary><strong>Prettier</strong></summary>
│  │
│  │   - depends on: Node.js + config
│  │
│  │   </details>
│  │
│  └─ <details>
│      <summary><strong>Lighthouse</strong></summary>
│
│      - what: audits performance, accessibility, SEO  
│  │   - depends on: running site
│
│      </details>
│
├─ 13) Version Control & Collaboration
│  │
│  └─ <details open>
│      <summary><strong>Git</strong></summary>
│
│      - tracks: history, branching, collaboration
│
│      </details>
│
├─ 14) Environment & Infrastructure
│  │
│  ├─ <details open>
│  │   <summary><strong>Docker</strong></summary>
│  │
│  │   - what: container runtime  
│  │   - runs: app + DB
│  │
│  │   </details>
│  │
│  └─ <details>
│      <summary><strong>Docker Compose</strong></summary>
│
│      - what: multi-container orchestration  
│  │   - depends on: Docker + YAML
│
│      </details>
│
└─ 15) Monitoring & Observability
   │
   ├─ <details>
   │   <summary><strong>Prometheus</strong></summary>
   │
   │   - what: metrics collection  
   │   - depends on: instrumentation
   │
   │   </details>
   │
   ├─ <details>
   │   <summary><strong>Grafana</strong></summary>
   │
   │   - what: dashboards  
   │   - depends on: Prometheus
   │
   │   </details>
   │
   └─ <details>
       <summary><strong>ELK Stack</strong></summary>

       - what: log ingestion, search, visualization  
       - depends on: log shipping pipeline

       </details>
