# i18n Guidelines

## Decision Rule

When adding a new key:

- Global / reused → common
- Reusable UI → components
- Layout-related → layouts
- Route-specific → pages
- Business/domain → features
- Form validation → validation
- API/backend errors → errors

---

## Naming

- Namespaces: lowercase
- Keys: camelCase

---

## Features

Group by feature:

```
features.<feature>.<section>.<key>
```

Examples:

```
features.auth.login.title
features.auth.actions.login
features.friendships.messages.requestSent
```

---

## Validation & Errors

- Must be top-level (never inside features/pages)
- Must match backend codes

```
validation.REQUIRED
errors.AUTH_INVALID_CREDENTIALS
```

Shared UI copy that is not a backend error code should live under `common`, for example:

```txt
common.globalError.title
common.globalError.tryAgain
```
