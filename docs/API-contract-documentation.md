# API Contract Documentation

## 1. Contract Location & Governance

All FE ↔ BE contracts are the single source of truth for the public API surface between frontend and backend and are readonly, any change must be reviewed and approved. They are added to the project structure (front end or backend) as read-only on build.

### 1.1 Structure

```
contracts/api 
|  
+-- http                        # http generic definitions.  
|   +-- index                   # export folder content.
|   +-- response                # API success and error wrappers
|   +-- status                  # Error status codes mapped to HTTP status. 
|   +-- validation              # Zod validation logic. 
|  
+-- endpoint_group              # folder grouping endpoint 
|   +-- endpoint.contract.ts    # endpoint request | response types  
|   +-- endpoint.errors.ts      # all possible error codes mapped in http codes and i18n keys
|   +-- endpoint.validation.ts  # zod validation error details
```

### 1.1.2 Backend with contracts

```
REQUEST
|
|
+-->  endpoint exist?    -----[no]---------> RESPONSE 404 (contract def)
|
..........................................................................
|  
+---+  MIDLEWARES
|   |
|   +--> if auth, auth ok?  -----[no]------> RESPONSE 401 (contract def)
|   |
|   |
|   +--> validation fns     -----[no]------> RESPONSE 422 (contract def)
|        (contract def)
|
..........................................................................
|
|
+---+-->  CONTROLLER --- http logic -------> RESPONSE ok|err (contract def) 
|   |      
|   +-->  SERVICE    --- app logic  -------> RESULT data | error code (contract def)
|   |                         
|   +-->  REPOSITORY --- db logic   -------> ROWS query res
|
..........................................................................
|
+---+  GLOBAL ERROR 
|   | 
|   +-->  Unknow throw  ------------------> RESPONSE 500 (contract def)
|
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

Should be mapped at: `endpoint.errors.ts`
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


### 2.2 Validation 

Validation is defined in `endpoint.validation.ts` and exists at two levels:

- Backend validation (source of truth)
- Frontend validation (UX enhancement)

Backend validation is authoritative.  
Frontend validation improves user experience.

---

#### 2.2.1 Backend Validation (Authoritative)

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
        "password": ["FIELD_TOO_SHORT"]
      }
    }
  }
}
```

Rules:

- Validation codes are defined in `./http/validation.ts`
- Zod issues are converted to ValidationErrorDetails
- No raw Zod messages are returned
- No English strings are returned
- No sensitive information is exposed

Backend validation is the final authority.

---

#### 2.2.2 Frontend Validation (UX Layer)

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


### Updates
2026-02-23
- Add ./lib/validation. It stores generic zod functions. 
- Add tentative signup validation schema for FE current signup  
- Simplify errors in only one structure with http code and i18n key. 
