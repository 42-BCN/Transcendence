#!/bin/sh
set -eu

echo "🔐 Setting up HTTPS for development..."

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

CERT_DIR="$ROOT_DIR/certs"

CRT="$CERT_DIR/localhost.crt"
KEY="$CERT_DIR/localhost.key"
CA="$CERT_DIR/ca.pem"

export CERT_DIR CRT KEY CA

mkdir -p "$CERT_DIR"

confirm_replace_certs_if_exist() {
  if [ -f "$CRT" ] || [ -f "$KEY" ] || [ -f "$CA" ]; then
cat <<EOF

Existing certificates detected:
- CA certificate: $(pwd)/$CA
- Certificate:    $(pwd)/$CRT
- Private key:    $(pwd)/$KEY

Do you want to replace them? [y/N]
EOF
    read ans || ans=""
    case "$ans" in
      y|Y|yes|YES)
        echo "Replacing existing certificates..."
        rm -f "$CRT" "$KEY" "$CA"
        return 0
        ;;
      *)
        echo "Keeping existing certificates. Skipping generation."
        return 1
        ;;
    esac
  fi
  return 0
}

choose_cert_method() {
  echo
  echo "🔐 HTTPS Certificate Setup"
  echo "--------------------------------"
  echo "Using self-signed certificates."
  export CERT_METHOD
}

# If certs exist, ask before doing anything else
if ! confirm_replace_certs_if_exist; then
  exit 0
fi

choose_cert_method

"$SCRIPT_DIR/selfsigned.sh"

echo
echo "🎉 Certificates ready in: $CERT_DIR"
echo "📄 CA certificate:  $(pwd)/$CA"
echo "📄 Certificate:     $(pwd)/$CRT"
echo "🔑 Private key:     $(pwd)/$KEY"
