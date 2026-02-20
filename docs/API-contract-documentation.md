# API Contract Documentation

## 1. Contract Location & Governance

All FE ↔ BE contracts are the single source of truth for the public API surface between frontend and backend and are readonly, any change must be reviewed and approved. They are added to the project structure (front end or backend) as read-only on build.

### 1.1 Structure

```
contracts/api 
|  
+-- http                        # http generic definitions.  
|   +-- index                   # export forlder content.
|   +-- response                # API success and error wrappers
|   +-- status                  # Error status codes mapped to HTTP status. 
|   +-- validation              # Zod validation logic. 
|  
+-- endpoint_group              # folder grouping endpoint 
|   +-- endpoint.contract.ts    # endpoint request | response types  
|   +-- endpoint.errors.ts      # all possible error codes and i18n keys   
|   +-- endpoint.status.ts      # all HTTP status codes used by the API  
|   +-- endpoint.validation.ts  # zod validation error details
```


---

## 2. HTTP Request / Response Model

---

### 2.1 Response Types 

All endpoints return one of two shapes defined on `./http/response.ts`

#### Success

Response:
```json
{
  "ok": true,
  "data": {}
}
```

Type definition:
``` ts
export type ApiSuccess<T> = {
      ok: true;
      data: T;
    };
```


#### Errors

Should be mapped at: `endpoint.error.ts`
Response:
```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

Type definitions:
``` ts
    export type ApiError<Code, Details> = {
      ok: false;
      error: {
        code: Code;
        details?: Details;
      };
    };
```

#### Response

All responses use

``` ts
    export type ApiResponse<T, Code, Details = unknown> =
      | ApiSuccess<T>
      | ApiError<Code, Details>;
```

### 2.2 HTTP Status Codes

HTTP status codes are mapped from error codes on `./http/status.ts`.
Mapping is centralized and must not be hardcoded in controllers at `endpoint.errors.ts`.

Example mapping:

| Error Code                 | HTTP Status|
|----------------------------|------------|
| AUTH_INVALID_CREDENTIALS   | 401        |
| AUTH_UNAUTHORIZED          | 401        |
| AUTH_FORBIDDEN             | 403        |
| AUTH_EMAIL_ALREADY_EXISTS  | 409        |
| AUTH_VALIDATION_ERROR      | 422        |
| AUTH_INTERNAL_ERROR        | 500        |


### 2.3 Validation 

Validation is defined in `endpoint.validation.ts` exists at two levels:

- Backend validation (source of truth)
- Frontend validation (UX enhancement)

Backend validation is authoritative.  
Frontend validation improves user experience.

---

#### 2.3.1 Backend Validation (Authoritative)

Backend validation:

- Uses Zod schemas defined in `endpoint.validation.ts`
- Emits stable validation codes
- Returns AUTH_VALIDATION_ERROR with structured field details
- Never returns user-facing strings

Error shape example:
``` json
{
  "ok": false,
  "error": {
    "code": "AUTH_VALIDATION_ERROR",
    "details": {
      "fields": {
        "identifier": ["REQUIRED"],
        "password": ["PASSWORD_TOO_SHORT"]
      }
    }
  }
}
```

Rules:

- Validation codes are defined in src/contracts/http/validation.codes.ts
- Zod issues are converted to ValidationErrorDetails
- No raw Zod messages are returned
- No English strings are returned
- No sensitive information is exposed

Backend validation is the final authority.

---

#### 2.3.2 Frontend Validation (UX Layer)

Frontend validation:

- Mirrors backend validation rules and uses the same validation codes where possible
- Prevents unnecessary API calls
- Provides instant feedback

However:

- Frontend validation is not trusted
- Backend validation must still run
- Frontend and backend rules must remain aligned

Frontend responsibilities:

- Validate required fields
- Validate basic format
- Map backend validation codes to i18n keys
- Display field-level errors correctly

Frontend must never:

- Hardcode backend error strings
- Branch logic based on error message text

It must rely strictly on error code and validation codes.

---

#### 2.3.3 Validation Flow

1. User submits form.
2. Frontend performs local validation using Zod.
3. If valid → request is sent to backend.
4. Backend validates again using Zod.
5. If invalid → backend returns AUTH_VALIDATION_ERROR.
6. Frontend maps validation codes to translated messages.
7. UI displays field-level errors.
