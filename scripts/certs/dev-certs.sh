#!/bin/sh
set -eu

echo "🔐 Setting up HTTPS for development..."

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

CERT_DIR="$ROOT_DIR/certs"

CRT="$CERT_DIR/localhost.crt"
KEY="$CERT_DIR/localhost.key"

export CERT_DIR CRT KEY

mkdir -p "$CERT_DIR"

confirm_replace_certs_if_exist() {
  if [ -f "$CRT" ] || [ -f "$KEY" ]; then
cat <<EOF

Existing certificates detected:
- Certificate: $(pwd)/$CRT
- Private key:  $(pwd)/$KEY

Do you want to replace them? [y/N]
EOF
    read ans || ans=""
    case "$ans" in
      y|Y|yes|YES)
        echo "Replacing existing certificates..."
        rm -f "$CRT" "$KEY"
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
cat <<EOF

🔐 HTTPS Certificate Setup
--------------------------------
Choose how HTTPS certificates should be generated:

  1) mkcert (needs testing)
     - Installs a local trusted CA
     - No browser warnings
     - May require admin password

  2) Self-signed certificate (recommended)
     - No system changes
     - Browser will show warning
     - Can be trusted manually later

  3) Skip (I already have certificates)

EOF
  printf "Select option [1/2/3] (default: 2): "
  read choice || choice="1"

  case "$choice" in
    "1") CERT_METHOD="mkcert" ;;
    ""|"2")    CERT_METHOD="selfsigned" ;;
    "3")    CERT_METHOD="skip" ;;
    *) echo "❌ Invalid choice"; exit 1 ;;
  esac

  export CERT_METHOD
}

# If certs exist, ask before doing anything else
if ! confirm_replace_certs_if_exist; then
  exit 0
fi

choose_cert_method

case "$CERT_METHOD" in
  mkcert)
    "$SCRIPT_DIR/mkcert.sh"
    ;;
  selfsigned)
    "$SCRIPT_DIR/selfsigned.sh"
    ;;
  skip)
    echo "⚠️ Skipping cert generation"
    exit 0
    ;;
esac

echo
echo "🎉 Certificates ready in: $CERT_DIR"
echo "📄 Certificate: $(pwd)$CRT"
echo "🔑 Private key:  $(pwd)$KEY"