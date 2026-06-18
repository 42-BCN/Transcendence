#!/bin/sh
set -eu

has() { command -v "$1" >/dev/null 2>&1; }

write_ca_config() {
  file="$1"
  cat > "$file" <<'EOF'
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
x509_extensions    = ca_ext

[dn]
CN = Local Development CA

[ca_ext]
basicConstraints = critical,CA:true,pathlen:0
keyUsage = critical,keyCertSign,cRLSign
subjectKeyIdentifier = hash
EOF
}

write_server_config() {
  file="$1"
  cat > "$file" <<'EOF'
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
req_extensions     = server_req

[dn]
CN = localhost

[server_req]
basicConstraints = critical,CA:false
keyUsage = critical,digitalSignature,keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[server_cert]
basicConstraints = critical,CA:false
keyUsage = critical,digitalSignature,keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = backend
DNS.3 = socket
DNS.4 = frontend
DNS.5 = nginx
IP.1  = 127.0.0.1
IP.2  = ::1
EOF
}

docker_ok() {
  has docker || return 1
  docker info >/dev/null 2>&1
}

openssl_selfsigned_host() {
  temp_dir="$(mktemp -d)"
  trap 'rm -rf "$temp_dir"' EXIT INT HUP TERM
  mkdir -p "$CERT_DIR"
  
  ca_config="$temp_dir/ca.cnf"
  write_ca_config "$ca_config"
  
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout "$temp_dir/ca.key" \
    -out "$CERT_DIR/ca.pem" \
    -days 3650 \
    -config "$ca_config" \
    -extensions ca_ext
  
  server_config="$temp_dir/server.cnf"
  write_server_config "$server_config"
  
  openssl req -new -newkey rsa:2048 -nodes \
    -keyout "$KEY" \
    -out "$temp_dir/localhost.csr" \
    -subj "/CN=localhost" \
    -config "$server_config" \
    -extensions server_req
  
  openssl x509 -req \
    -in "$temp_dir/localhost.csr" \
    -CA "$CERT_DIR/ca.pem" \
    -CAkey "$temp_dir/ca.key" \
    -CAcreateserial \
    -out "$CRT" \
    -days 825 \
    -sha256 \
    -extfile "$server_config" \
    -extensions server_cert
  
  rm -f "$CERT_DIR/ca.srl"
  trap - EXIT INT HUP TERM
}

openssl_selfsigned_docker() {
  mkdir -p "$CERT_DIR"
  docker run --rm -v "$CERT_DIR:/out" alpine:3.19 sh -ceu '
    apk add --no-cache openssl >/dev/null

    cat > /tmp/ca.cnf <<EOF
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
x509_extensions    = ca_ext

[dn]
CN = Local Development CA

[ca_ext]
basicConstraints = critical,CA:true,pathlen:0
keyUsage = critical,keyCertSign,cRLSign
subjectKeyIdentifier = hash
EOF

    openssl req -x509 -newkey rsa:2048 -nodes \
      -keyout /tmp/ca.key \
      -out /out/ca.pem \
      -days 3650 \
      -config /tmp/ca.cnf \
      -extensions ca_ext

    cat > /tmp/server.cnf <<EOF
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
req_extensions     = server_req

[dn]
CN = localhost

[server_req]
basicConstraints = critical,CA:false
keyUsage = critical,digitalSignature,keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[server_cert]
basicConstraints = critical,CA:false
keyUsage = critical,digitalSignature,keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = backend
DNS.3 = socket
DNS.4 = frontend
DNS.5 = nginx
IP.1  = 127.0.0.1
IP.2  = ::1
EOF

    openssl req -new -newkey rsa:2048 -nodes \
      -keyout /out/localhost.key \
      -out /tmp/localhost.csr \
      -subj "/CN=localhost" \
      -config /tmp/server.cnf \
      -extensions server_req

    openssl x509 -req \
      -in /tmp/localhost.csr \
      -CA /out/ca.pem \
      -CAkey /tmp/ca.key \
      -CAcreateserial \
      -out /out/localhost.crt \
      -days 825 \
      -sha256 \
      -extfile /tmp/server.cnf \
      -extensions server_cert

    rm -f /out/ca.srl
  '
}
echo "Generating self-signed development certificates..."

if docker_ok; then
  echo "Docker is available, generating the CA and server certificate in a container."
  openssl_selfsigned_docker
elif has openssl; then
  echo "Docker is not available, falling back to the host OpenSSL installation."
  openssl_selfsigned_host
else
  cat <<EOF
Could not generate self-signed certificates.

Why this failed:
- Docker is not available or the daemon is not running
- OpenSSL is not installed on this machine

How to fix it:
1) Start Docker Desktop / Docker daemon, then re-run this script
2) Install OpenSSL on your machine, then re-run this script

Then run:
  ./scripts/certs/dev-certs.sh

EOF
  exit 1
fi

cat << EOF
Self-signed certificate chain created.
  CA certificate:   $(pwd)/$CERT_DIR/ca.pem
  Server cert:      $(pwd)/$CRT
  Private key:      $(pwd)/$KEY

Import the CA certificate into your browser or OS trust store.
Do not import the server certificate directly.

Chrome trust setup

1. Open in Chrome: chrome://settings/certificates
2. Go to Custom -> Trusted certificates -> Import
3. Select the CA file at the root of this repo: ca.pem
4. Confirm the import
5. Close all Chrome windows
6. Reopen Chrome and visit:

   https://localhost:8443
EOF
