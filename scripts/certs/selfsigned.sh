#!/bin/sh
set -eu

has() { command -v "$1" >/dev/null 2>&1; }

docker_ok() {
  has docker || return 1
  docker info >/dev/null 2>&1
}

openssl_selfsigned_host() {
  mkdir -p "$CERT_DIR"
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout "$KEY" \
    -out "$CRT" \
    -days 365 \
    -subj "/CN=localhost"
}

openssl_selfsigned_docker() {
  mkdir -p "$CERT_DIR"
  docker run --rm -v "$CERT_DIR:/out" alpine:3.19 sh -c '
    apk add --no-cache openssl >/dev/null

    cat > /tmp/localhost.cnf <<EOF
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
x509_extensions    = v3_req

[dn]
CN = localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1  = 127.0.0.1
IP.2  = ::1
EOF

    openssl req -x509 -newkey rsa:2048 -nodes \
      -keyout /out/localhost.key \
      -out /out/localhost.crt \
      -days 365 \
      -config /tmp/localhost.cnf
  '
}
echo "➡️ Using self-signed certificate..."

if docker_ok; then
  echo "✅ Docker available → generating cert with Docker"
  openssl_selfsigned_docker
elif has openssl; then
  echo "⚠️ Docker not available → using host openssl"
  openssl_selfsigned_host
else
  cat <<EOF
❌ Cannot generate self-signed certificate.

Reason:
- Docker is not available (or daemon not running)
- OpenSSL is not installed on this machine

Fix options:
1) Start Docker Desktop / Docker daemon, then re-run this script
2) Install OpenSSL on your machine, then re-run this script

After fixing, run:
  ./scripts/setup-dev-https.sh

EOF
  exit 1
fi

cat << EOF
✅ Self-signed cert created
📄 Certificate: $(pwd)/$CRT
🔑 Private key:  $(pwd)/$KEY


⚠️  Note: Your browser will show a warning for self-signed certificates.
    You can choose to trust the certificate manually in your browser.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Chrome Certificate Setup (UI Method)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🔐 Chrome Certificate Setup 

1. Open in Chrome: chrome://settings/certificates

2. Custom -> Trusted certificates -> import

4. Select the file at the root of this repo: localhost.ctr

6. Click OK

7. Close ALL Chrome windows

8. Reopen Chrome and visit:

   https://localhost:8443
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF