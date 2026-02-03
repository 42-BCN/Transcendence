# DEV CERTS

## 🔐 HTTPS, TLS, and Certificates — Summary Table

| Concept              | What It Is                        | Role                                 | Browser Trust                | Typical Use Case               |
| -------------------- | --------------------------------- | ---------------------------------------------- | ---------------------------- | ------------------------------ |
| **HTTPS**            | HTTP over an encrypted connection | Protects data in transit (privacy + integrity) | ✅ Trusted (if cert is valid) | All modern websites            |
| **TLS**              | Encryption/security protocol      | Handles encryption and identity verification   | ✅ Depends on cert            | Underlies HTTPS and WSS        |
| **mkcert**           | Local development cert tool       | Creates locally trusted certificates           | ✅ Trusted locally            | Local development environments |
| **Self-signed Cert** | Certificate signed by itself      | Provides encryption without trusted authority  | ❌ Not trusted by default     | Testing, internal tools        |


## The issue with local development

Modern web apps often require HTTPS even in dev because of:

- Secure cookies (Secure, SameSite=None) — required for many auth setups

- OAuth callbacks often require HTTPS

- WSS (WebSockets over TLS) behaves like production only when HTTPS is used

- Some APIs/features (service workers, some browser capabilities) require HTTPS

- Improves development experience overrall

## Usage

### Generate the certificates (once)
``` bash
./scripts/certs/dev-certs.sh
```

### Use the generated certificates
In env file

```sh
CERT_DIR=certs/dev
```

In scripts

```sh
CERT_DIR="${CERT_DIR:-certs/dev}"
```

In Docker compose

```yml
- ./${CERT_DIR}:/etc/nginx/certs
```  

## ! important

Never share or submit to the repository your certificate key

## 🔐 Chrome Certificate Setup 

1. Open in Chrome: [chrome://settings/certificates](chrome://settings/certificates)

2. Custom -> Trusted certificates -> import

4. Select the file at the root of this repo: localhost.ctr

6. Click OK

7. Close ALL Chrome windows

8. Reopen Chrome and visit:

   https://localhost:8443


## Dev HTTPS Cleanup

This project can create development certificates in [certs foloder](../../certs/) and yo may also install trust in Chrome;.

> Default:
> CERT_DIR=certs

---

## 1) Remove generated certificate files 

## Remove files created in this repo

```bash
rm -rf "${CERT_DIR:-certs}"
```

### Remove a trusted self-signed certificate using Chrome UI

1. Open in Chrome: [chrome://settings/certificates](chrome://settings/certificates)

2. Custom -> Trusted certificates

3. Select and delete

## Remove mkcert installation & trust (if mkcert was used)

### Uninstall mkcert local CA trust

mkcert -uninstall

### Remove the binary

macOS (Homebrew): brew uninstall mkcert

Windows (Chocolatey): choco uninstall mkcert -y

Linux: remove the binary you installed (commonly /usr/local/bin/mkcert)


