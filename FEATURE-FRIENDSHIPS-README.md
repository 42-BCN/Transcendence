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
curl -sk -X POST https://localhost:8443/api/friendships/requests \
  -H "Content-Type: application/json" \
  -b /tmp/alice.txt \
  -d '{"targetUserId":"<BOB_ID>"}'

# Bob ve sus requests recibidas
curl -sk https://localhost:8443/api/friendships/requests/received \
  -b /tmp/bob.txt

# Bob acepta (usa el request ID de arriba)
curl -sk -X PATCH https://localhost:8443/api/friendships/requests/<REQUEST_ID>/accept \
  -b /tmp/bob.txt

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

### `POST /api/friendships/requests`
Enviar solicitud de amistad.

**Body**: `{ "targetUserId": "uuid" }`

**Response**: `{ "ok": true, "data": { "friendship": {...} } }`

---

### `GET /api/friendships/requests/received`
Obtener solicitudes recibidas (pendientes).

**Response**: `{ "ok": true, "data": { "requests": [...] } }`

---

### `PATCH /api/friendships/requests/:requestId/accept`
Aceptar solicitud de amistad.

**Response**: `{ "ok": true, "data": { "friendship": {...} } }`

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
