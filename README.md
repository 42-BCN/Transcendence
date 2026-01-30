_This project has been created as part of the 42 curriculum by camanica-, capapes, mafontser, mvelazqu._

# Web / Full-Stack Development

### 1. Foundations (the Web platform)

- **HTML**
	- <span style="color: gray">what: structure + semantics</span>  
	- <span style="color: gray">depends on: Browser to render</span>  

- **CSS** 
	- <span style="color: gray">what: layout + visuals</span>  
	- <span style="color: gray">depends on: Browser to apply</span>  

- **JavaScript**  
	- <span style="color: gray">what: behavior + logic</span>  
	- <span style="color: gray">runs on: Browser and/or Node.js</span>  

- **TypeScript**  
	- <span style="color: gray">what: typed JavaScript (dev-time safety)</span>  
	- <span style="color: gray">depends on: compiler/tooling → outputs JavaScript</span>  

### 2. Data & Config Formats (structure & exchange)

- **JSON**  
	- <span style="color: gray">what: API payloads + config</span>  
	- <span style="color: gray">used by: frontend ↔ backend data exchange</span>  

- **YAML**  
	- <span style="color: gray">what: configuration format</span>  
	- <span style="color: gray">used by: Docker Compose, CI/CD, infrastructure config</span>  

### 3. UI & Application Layer

- **React**  
	- <span style="color: gray">what: UI library (components)</span>  
	- <span style="color: gray">depends on: JavaScript/TypeScript + Browser runtime</span>  

- **Next.js**  
	- <span style="color: gray">what: React framework (routing, SSR/SSG, server features)</span>  
	- <span style="color: gray">depends on: React + Node.js (server) + Browser (client)</span>  

- **Tailwind CSS**  
	- <span style="color: gray">what: utility-first styling system</span>  
	- <span style="color: gray">depends on: build tooling → CSS → Browser</span>  

- **Headless UI (category)**  
	- <span style="color: gray">what: behavior/accessibility patterns without styling</span>  
	- <span style="color: gray">examples: Radix UI / React Aria / component libraries</span>  

- **three.js**  
	- <span style="color: gray">what: 3D graphics library for the web</span>  
	- <span style="color: gray">depends on: Browser (WebGL) + JavaScript/TypeScript</span>  

### 4. Execution Environments (where code runs)

- **Browser**  
	- <span style="color: gray">runs: frontend JavaScript</span>  
	- <span style="color: gray">consumes: HTTP APIs</span>  

- **Node.js**  
	- <span style="color: gray">runs: Next.js server + tooling</span>  
	- <span style="color: gray">can host: HTTP APIs</span>  

- **Python**  
	- <span style="color: gray">runs: backend services (e.g., Django)</span>  
	- <span style="color: gray">depends on: Python runtime environment</span>  

### 5. Design & UX Workflow

- **Figma**  
	- <span style="color: gray">what: design source of truth (layouts, components, tokens)</span>  
	- <span style="color: gray">feeds: implementation (React + Tailwind)</span>  

### 6. Communication & Security

- **HTTP APIs**  
	- <span style="color: gray">what: request/response boundary (often REST/JSON)</span>  
	- <span style="color: gray">used by: Browser, Postman</span>  

- **Cookies**  
	- <span style="color: gray">what: browser-stored session/auth data</span>  
	- <span style="color: gray">depends on: Browser + server Set-Cookie</span>  

- **JWT**  
	- <span style="color: gray">what: signed auth/claims token</span>  
	- <span style="color: gray">transported via: headers or cookies</span>  

- **Hashing**  
	- <span style="color: gray">what: one-way password protection</span>  
	- <span style="color: gray">used by: backend auth flows</span>  

- **Salting**  
	- <span style="color: gray">what: random data added before hashing</span>  
	- <span style="color: gray">used with: hashing for stored credentials</span>  

- **CORS**  
	- <span style="color: gray">what: browser-enforced cross-origin rules</span>  
	- <span style="color: gray">depends on: Browser + server headers</span>  

- **Environment secrets**  
	- <span style="color: gray">what: keys/passwords not committed to git</span>  
	- <span style="color: gray">depends on: runtime environment (.env/CI/secret manager)</span>  

### 7. Backend Frameworks

- **Django**  
	- <span style="color: gray">what: Python web framework</span>  
	- <span style="color: gray">depends on: Python runtime + database layer</span>  

### 8. Data Layer (store and retrieve)

- **PostgreSQL**  
	- <span style="color: gray">what: relational database (persistent truth)</span>  
	- <span style="color: gray">depends on: running DB service</span>  

- **SQL**  
	- <span style="color: gray">what: query language</span>  
	- <span style="color: gray">used by: debugging, tuning, access layers</span>  

- **ORM**  
	- <span style="color: gray">what: maps objects ↔ tables</span>  
	- <span style="color: gray">depends on: DB connection + schema</span>  

### 9. Package Management & Dependencies

- **npm / npx**  
	- <span style="color: gray">what: install/run JS tooling and libraries</span>  
	- <span style="color: gray">depends on: Node.js</span>  

- **pip / Poetry**  
	- <span style="color: gray">what: Python packages</span>  

- **package.json**  
	- <span style="color: gray">defines: JS dependencies + scripts</span>  

- **node_modules**  
	- <span style="color: gray">contains: installed JS dependencies</span>  

### 10. Tooling & Developer Utilities

- **TypeScript compiler**  
	- <span style="color: gray">transforms: TypeScript → JavaScript</span>  

- **Vite**  
	- <span style="color: gray">what: dev server + bundler</span>  
	- <span style="color: gray">depends on: Node.js + project config</span>  

- **Zod**  
	- <span style="color: gray">what: runtime schema validation</span>  
	- <span style="color: gray">used for: shared contracts</span>  

- **Seed data**  
	- <span style="color: gray">what: initial/dev/demo DB data</span>  
	- <span style="color: gray">depends on: database + schema</span>  

### 11. API Contracts & Manual API Testing

- **Swagger / OpenAPI**  
	- <span style="color: gray">what: API contract & documentation</span>  

- **Postman**  
	- <span style="color: gray">what: API client for manual testing</span>  

### 12. Code Quality, Auditing & Accessibility

- **ESLint**  
	- <span style="color: gray">what: linting</span>  

- **Prettier**  
	- <span style="color: gray">what: formatting</span>  

- **Lighthouse**  
	- <span style="color: gray">what: performance, accessibility, SEO audits</span>  

### 13. Version Control & Collaboration

- **Git**  
	- <span style="color: gray">tracks: history, branching, collaboration</span>  

### 14. Environment & Infrastructure

- **Docker**  
	- <span style="color: gray">what: container runtime</span>  
	- <span style="color: gray">runs: app + DB</span>  

- **Docker Compose**  
	- <span style="color: gray">what: multi-container orchestration</span>  
	- <span style="color: gray">depends on: YAML config</span>  

### 15. Monitoring & Observability

- **Prometheus**  
	- <span style="color: gray">what: metrics collection</span>  

- **Grafana**  
	- <span style="color: gray">what: dashboards</span>  

- **ELK Stack**  
	- <span style="color: gray">what: centralized logging</span>  
