# Friendship System - Complete Implementation

## ✅ Status: VERIFIED AND WORKING

This branch implements a complete friendship system in the backend with:

- ✅ Database model using Prisma
- ✅ Full REST API with validations
- ✅ Pending and accepted request system
- ✅ Sessions with Redis
- ✅ TypeCheck and Build working
- ✅ E2E tests passing

---

## 🚀 For Teammates: How to Pull and Verify

### 1. Get the changes

~~~bash
git fetch origin
git checkout 149-socialspike-friends-system-user-relationships-game-invites-v1
git pull origin 149-socialspike-friends-system-user-relationships-game-invites-v1
~~~

### 2. Rebuild and start

~~~bash
cd containers

# Full rebuild (important to get the latest changes)
docker-compose build --no-cache backend

# Start services
docker-compose up -d

# Verify everything is healthy
docker-compose ps
~~~

### 3. Verify it works

#### Option A: Automated tests inside the backend

~~~bash
# TypeCheck
docker-compose exec backend npm run typecheck

# Build
docker-compose exec backend npm run build
~~~

#### Option B: Manual E2E test

~~~bash
# Signup Alice
curl -sk -X POST https://localhost:8443/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"Test123!"}'

# Login Alice (store cookie)
curl -sk -X POST https://localhost:8443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"alice@test.com","password":"Test123!"}' \
  -c /tmp/alice.txt

# Signup Bob
curl -sk -X POST https://localhost:8443/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@test.com","password":"Test123!"}'

# Login Bob (store cookie)
curl -sk -X POST https://localhost:8443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"bob@test.com","password":"Test123!"}' \
  -c /tmp/bob.txt

# Alice sends a friend request to Bob (use Bob's ID from signup)
curl -sk -X POST https://localhost:8443/api/friendships/request \
  -H "Content-Type: application/json" \
  -b /tmp/alice.txt \
  -d '{"targetUserId":"<BOB_ID>"}'

# Bob checks pending requests
curl -sk https://localhost:8443/api/friendships/requests/pending \
  -b /tmp/bob.txt

# Bob accepts (use the request ID from above)
curl -sk -X POST https://localhost:8443/api/friendships/respond \
  -H "Content-Type: application/json" \
  -b /tmp/bob.txt \
  -d '{"friendshipId":"<REQUEST_ID>","action":"accept"}'

# Check Alice's friends list
curl -sk https://localhost:8443/api/friendships \
  -b /tmp/alice.txt

# Check Bob's friends list
curl -sk https://localhost:8443/api/friendships \
  -b /tmp/bob.txt
~~~

---

## 📋 Key Changes

### Database (Prisma)

**`containers/backend/app/prisma/schema.prisma`**:
- New enum: `FriendshipStatus` (pending, accepted)
- New model: `Friendship` with bidirectional relationships
- Fields added to the `User` model for friendships

### Backend Code

**New files**:
- `containers/backend/app/src/friendships/friendships.repo.ts` - Data access with Prisma
- `containers/backend/app/src/friendships/friendships.service.ts` - Business logic
- `containers/backend/app/src/friendships/friendships.controller.ts` - HTTP handlers
- `containers/backend/app/src/friendships/friendships.routes.ts` - API routes

**Shared contracts**:
- `containers/contracts/api/friendships/friendships.contracts.ts` - TypeScript types
- `containers/contracts/api/friendships/friendships.validation.ts` - Zod schemas
- `containers/contracts/api/friendships/friendships.errors.ts` - Error codes

### Configuration

**`containers/backend/app/tsconfig.json`**:
- `module: "ESNext"` + `moduleResolution: "Bundler"` to resolve `@contracts/*` imports

**`containers/docker-compose.yml`**:
- `REDIS_URL` variable in the backend service for sessions

**`containers/nginx/nginx.conf`**:
- Proxy fixed using `rewrite` instead of trailing slash
- Rate limit increased to 100r/m for development

---

## 🔧 Troubleshooting

### Error: "Cannot find module '@contracts/...'"

~~~bash
# Rebuild backend
docker-compose build --no-cache backend
docker-compose up -d
~~~

### Error: "REDIS_URL is required"

Make sure `docker-compose.yml` includes:

~~~yaml
backend:
  environment:
    REDIS_URL: redis://redis:6379
~~~

### Error: 429 Too Many Requests

Nginx rate limit is set to 100 req/min. If you run many tests quickly, wait 1 minute.

### Error: TypeCheck fails

~~~bash
# Enter container and verify
docker-compose exec backend sh
npm run typecheck
~~~

If there are module errors, run `npm ci` again.

---

## 📚 API Endpoints

### `POST /api/friendships/request`
Send a friend request.

**Body**: `{ "targetUserId": "uuid" }`

**Response**: `{ "ok": true, "data": { "friendship": {...} } }`

---

### `GET /api/friendships/requests/pending`
Get pending (received) requests.

**Response**: `{ "ok": true, "data": { "requests": [...] } }`

---

### `POST /api/friendships/respond`
Accept or reject a friend request.

**Body**: `{ "friendshipId": "uuid", "action": "accept" | "reject" }`

**Response**: `{ "ok": true, "data": { "friendship": {...}, "action": "accept" } }`

---

### `GET /api/friendships`
Get the current friends list (accepted).

**Response**: `{ "ok": true, "data": { "friendships": [...] } }`

---

## ✅ Final Checklist

- [x] Prisma schema with Friendship model
- [x] Migrations applied with `db:push`
- [x] API endpoints implemented
- [x] Validation with Zod
- [x] Complete error handling
- [x] TypeScript types in contracts
- [x] Redis sessions working
- [x] TypeCheck passing
- [x] Build passing
- [x] E2E tests passing
- [x] Nginx proxy fixed
- [x] Merge conflicts resolved with main

---

## 🎯 Next Steps (Future)

- [ ] Frontend UI for friendships
- [ ] Real-time notifications with WebSocket
- [ ] Endpoint to reject/cancel requests
- [ ] Endpoint to remove friendships
- [ ] Unit tests with Jest
- [ ] Rate limiting per user (not only per IP)

---

**Author**: Joan Navarro  
**Branch**: `149-socialspike-friends-system-user-relationships-game-invites-v1`  
**Last verified**: April 2, 2026


# Sistema de Amistades - Implementación Completa

## ✅ Estado: VERIFICADO Y FUNCIONANDO

Esta rama implementa un sistema completo de friendships (amistades) en el backend con:

- ✅ Modelo de base de datos con Prisma
- ✅ API REST completa con validaciones
- ✅ Sistema de requests pendientes y aceptados
- ✅ Sesiones con Redis
- ✅ TypeCheck y Build funcionando
- ✅ Tests E2E pasados

---

## 🚀 Para Compañeros: Cómo Hacer Pull y Verificar

### 1. Obtener los cambios

```bash
git fetch origin
git checkout 149-socialspike-friends-system-user-relationships-game-invites-v1
git pull origin 149-socialspike-friends-system-user-relationships-game-invites-v1
```

### 2. Rebuild y arrancar

```bash
cd containers

# Rebuild completo (importante para obtener los últimos cambios)
docker-compose build --no-cache backend

# Levantar servicios
docker-compose up -d

# Verificar que todo esté healthy
docker-compose ps
```

### 3. Verificar que funciona

#### Opción A: Tests automáticos dentro del backend

```bash
# TypeCheck
docker-compose exec backend npm run typecheck

# Build
docker-compose exec backend npm run build
```

#### Opción B: Test E2E manual

```bash
# Signup Alice
curl -sk -X POST https://localhost:8443/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"Test123!"}'

# Login Alice (guarda cookie)
curl -sk -X POST https://localhost:8443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"alice@test.com","password":"Test123!"}' \
  -c /tmp/alice.txt

# Signup Bob
curl -sk -X POST https://localhost:8443/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@test.com","password":"Test123!"}'

# Login Bob (guarda cookie)
curl -sk -X POST https://localhost:8443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"bob@test.com","password":"Test123!"}' \
  -c /tmp/bob.txt

# Alice envía friend request a Bob (usa el ID de Bob del signup)
curl -sk -X POST https://localhost:8443/api/friendships/request \
  -H "Content-Type: application/json" \
  -b /tmp/alice.txt \
  -d '{"targetUserId":"<BOB_ID>"}'

# Bob ve sus requests pendientes
curl -sk https://localhost:8443/api/friendships/requests/pending \
  -b /tmp/bob.txt

# Bob acepta (usa el request ID de arriba)
curl -sk -X POST https://localhost:8443/api/friendships/respond \
  -H "Content-Type: application/json" \
  -b /tmp/bob.txt \
  -d '{"friendshipId":"<REQUEST_ID>","action":"accept"}'

# Ver lista de amigos de Alice
curl -sk https://localhost:8443/api/friendships \
  -b /tmp/alice.txt

# Ver lista de amigos de Bob
curl -sk https://localhost:8443/api/friendships \
  -b /tmp/bob.txt
```

---

## 📋 Cambios Importantes

### Base de Datos (Prisma)

**`containers/backend/app/prisma/schema.prisma`**:
- Nuevo enum: `FriendshipStatus` (pending, accepted)
- Nuevo modelo: `Friendship` con relaciones bidireccionales
- Campos añadidos al modelo `User` para friendships

### Código Backend

**Nuevos archivos**:
- `containers/backend/app/src/friendships/friendships.repo.ts` - Data access con Prisma
- `containers/backend/app/src/friendships/friendships.service.ts` - Lógica de negocio
- `containers/backend/app/src/friendships/friendships.controller.ts` - Handlers HTTP
- `containers/backend/app/src/friendships/friendships.routes.ts` - Rutas API

**Contratos compartidos**:
- `containers/contracts/api/friendships/friendships.contracts.ts` - Tipos TypeScript
- `containers/contracts/api/friendships/friendships.validation.ts` - Schemas Zod
- `containers/contracts/api/friendships/friendships.errors.ts` - Códigos de error

### Configuración

**`containers/backend/app/tsconfig.json`**:
- `module: "ESNext"` + `moduleResolution: "Bundler"` para resolver imports `@contracts/*`

**`containers/docker-compose.yml`**:
- Variable `REDIS_URL` en el servicio backend para sesiones

**`containers/nginx/nginx.conf`**:
- Proxy corregido con `rewrite` en lugar de trailing slash
- Rate limit aumentado a 100r/m para desarrollo

---

## 🔧 Solución de Problemas

### Error: "Cannot find module '@contracts/...'"

```bash
# Rebuild el backend
docker-compose build --no-cache backend
docker-compose up -d
```

### Error: "REDIS_URL is required"

Asegúrate de que `docker-compose.yml` tenga:

```yaml
backend:
  environment:
    REDIS_URL: redis://redis:6379
```

### Error: 429 Too Many Requests

El rate limit de nginx está configurado para 100 req/min. Si haces muchos tests seguidos, espera 1 minuto.

### Error: TypeCheck falla

```bash
# Entrar al container y verificar
docker-compose exec backend sh
npm run typecheck
```

Si hay errores de módulos, hacer `npm ci` de nuevo.

---

## 📚 API Endpoints

### `POST /api/friendships/request`
Enviar solicitud de amistad.

**Body**: `{ "targetUserId": "uuid" }`

**Response**: `{ "ok": true, "data": { "friendship": {...} } }`

---

### `GET /api/friendships/requests/pending`
Obtener solicitudes pendientes (recibidas).

**Response**: `{ "ok": true, "data": { "requests": [...] } }`

---

### `POST /api/friendships/respond`
Aceptar o rechazar solicitud de amistad.

**Body**: `{ "friendshipId": "uuid", "action": "accept" | "reject" }`

**Response**: `{ "ok": true, "data": { "friendship": {...}, "action": "accept" } }`

---

### `GET /api/friendships`
Obtener lista de amigos actuales (aceptados).

**Response**: `{ "ok": true, "data": { "friendships": [...] } }`

---

## ✅ Checklist Final

- [x] Schema Prisma con Friendship model
- [x] Migrations aplicadas con `db:push`
- [x] API endpoints implementados
- [x] Validaciones con Zod
- [x] Error handling completo
- [x] TypeScript types en contracts
- [x] Sessions con Redis funcionando
- [x] TypeCheck passing
- [x] Build passing
- [x] E2E tests passing
- [x] Nginx proxy corregido
- [x] Merge conflicts resueltos con main

---

## 🎯 Próximos Pasos (Futuro)

- [ ] Frontend UI para friendships
- [ ] Notificaciones en tiempo real con WebSocket
- [ ] Endpoint para rechazar/cancelar requests
- [ ] Endpoint para eliminar amistades
- [ ] Tests unitarios con Jest
- [ ] Rate limiting por usuario (no solo por IP)

---

**Autor**: Joan Navarro  
**Branch**: `149-socialspike-friends-system-user-relationships-game-invites-v1`  
**Última verificación**: 2 Abril 2026
