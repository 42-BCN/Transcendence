#!/bin/sh
set -eu

echo
echo "========================================"
echo " Dev HTTPS Certificate Setup"
echo "========================================"

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

Existing development certificates were found:
  CA certificate: $(pwd)/$CA
  Server cert:    $(pwd)/$CRT
  Private key:    $(pwd)/$KEY

Replace them with a fresh set? [y/N]
EOF
    read ans || ans=""
    case "$ans" in
      y|Y|yes|YES)
        echo "Removing current certificates..."
        rm -f "$CRT" "$KEY" "$CA"
        return 0
        ;;
      *)
        echo "Keeping the current certificates. Skipping regeneration."
        return 1
        ;;
    esac
  fi
  return 0
}

choose_cert_method() {
  echo
  echo "Certificate mode"
  echo "----------------"
  echo "Using self-signed certificates for local development."
  export CERT_METHOD
}

# If certs exist, ask before doing anything else
if ! confirm_replace_certs_if_exist; then
  exit 0
fi

choose_cert_method

"$SCRIPT_DIR/selfsigned.sh"

echo
echo "Certificates are ready."
echo "  Folder:         $CERT_DIR"
echo "  CA certificate: $(pwd)/$CA"
echo "  Server cert:    $(pwd)/$CRT"
echo "  Private key:    $(pwd)/$KEY"
