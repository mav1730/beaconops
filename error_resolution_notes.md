# Post-Mortem & Error Resolution Notes

This document summarizes the technical issues encountered during the setup and validation of the BeaconOps API, their root causes, and the exact steps taken to resolve them. Use these notes for interview preparation.

---

## 1. Issue: Prisma Client Module & Generation Crash

### Symptom
On starting the server using `npm run dev`, Node.js immediately crashed with:
```
Error: Cannot find module '@prisma/client'
```
After installing the module and regenerating the client with Prisma v7, it crashed with:
```
Error: Cannot find module '.prisma/client/default'
```
and:
```
PrismaClientInitializationError: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`
```

---

### Root Causes

1. **Missing Client Dependency**: 
   The `@prisma/client` package was not declared in the project's `package.json` dependencies.
2. **Empty DB Schema**:
   The `prisma/schema.prisma` file was empty of models. When Prisma tried to introspect or generate the client, there were no database models to map (i.e. `prisma.lead` was undefined).
3. **Prisma v7 Architectural Breaking Changes**:
   * **Mandatory Driver Adapters**: Prisma v7 has a new "Rust-free" query engine architecture. It no longer bundles native database drivers by default, meaning instantiating `new PrismaClient()` without arguments fails. It requires passing a database driver adapter (like `@prisma/adapter-pg`) or an `accelerateUrl`.
   * **ESM Requirement**: Prisma v7 defaults to generating ES Modules. Our project uses standard CommonJS (`require()`), which is incompatible with Prisma v7's default generated client outputs unless heavily configured with `moduleFormat = "cjs"`.

---

### Resolution

* **Downgraded Prisma to v6.4.1**: 
  Instead of rewriting the entire CommonJS Node.js codebase to ESM or configuring complex database driver adapters, we downgraded both `prisma` and `@prisma/client` to version `6.4.1` (the last stable release of v6). This keeps the traditional Rust query engine which works out-of-the-box in standard CJS projects.
  ```bash
  npm install @prisma/client@6.4.1 prisma@6.4.1 --save-exact
  ```
* **Defined the `Lead` Model**:
  Added the missing `Lead` model and `LeadStatus` enum inside `prisma/schema.prisma` mapping directly to PostgreSQL:
  ```prisma
  enum LeadStatus {
    PENDING_AUDIT
  }

  model Lead {
    id        Int        @id @default(autoincrement())
    url       String
    status    LeadStatus @default(PENDING_AUDIT)
    createdAt DateTime   @default(now())
  }
  ```
* **Renamed Prisma v7 Programmatic Config**:
  Prisma v7 introduces `prisma.config.ts` for database connections, which is unsupported in v6 and caused schema-loading errors. We renamed `prisma.config.ts` to `prisma.config.ts.bak` and added the standard `url = env("DATABASE_URL")` back to the schema.
* **Synchronized Database & Generated Client**:
  Ran database push and client generation:
  ```bash
  npx prisma db push
  ```

---

## 2. Issue: HTTP 500 Instead of HTTP 400 on Validation Failure

### Symptom
When sending an invalid or empty payload to the `POST /api/leads` endpoint, the server responded with an **HTTP 500 Internal Server Error** status code instead of the expected **HTTP 400 Bad Request** validation failure.

---

### Root Cause

* **Zod v4 API Deprecation**:
  In the validation middleware (`src/validations/leadValidation.js`), the code tried to map validation errors to simple messages using:
  ```javascript
  const errorMessages = validation.error.errors.map(err => err.message);
  ```
  In Zod v4 (which was installed in this project), the legacy `.errors` getter on the `ZodError` object has been deprecated/removed. Because `validation.error.errors` returned `undefined`, calling `.map()` on it threw a `TypeError` (`Cannot read properties of undefined (reading 'map')`).
  This synchronous JavaScript error crashed the execution flow inside the middleware, prompting Express's default global error handler to intercept it and return an **HTTP 500 Internal Server Error** response.

---

### Resolution

* **Updated Zod to Use `.issues`**:
  Replaced the deprecated `.errors` property with the standard `.issues` array, which exists on all `ZodError` objects across both Zod v3 and v4:
  ```javascript
  const errorMessages = validation.error.issues.map(err => err.message);
  ```
* This ensures that any validation failure (e.g. missing URL or malformed URL format) is caught cleanly and returned to the client as a **400 Bad Request** containing the validation details.
