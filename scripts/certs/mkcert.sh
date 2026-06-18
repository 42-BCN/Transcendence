#!/bin/sh
set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

. "$SCRIPT_DIR/../lib/os.sh"
detect_os
echo "Detected OS: $OS"
echo


has() { command -v "$1" >/dev/null 2>&1; }

confirm_install_mkcert() {
cat <<EOF

mkcert is not installed.

This script can install it so your browser trusts https://localhost during development.
You may be prompted for your administrator password while installing the local CA.

Install mkcert now? [Y/n]
EOF
  read ans || ans=""
  case "$ans" in
    ""|Y|y|yes|YES) return 0 ;;
    *) return 1 ;;
  esac
}

install_mkcert() {
  echo "Installing mkcert..."
  case "$OS" in
    macos)
      has brew || return 1
      brew install mkcert nss
      ;;
    windows)
      has choco || return 1
      choco install mkcert -y
      ;;
    linux)
      has apt || return 1
      sudo apt update
      sudo apt install -y libnss3-tools
      tmp_mkcert="$(mktemp)"
      curl -L https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-linux-amd64 \
        -o "$tmp_mkcert"
      sudo mv "$tmp_mkcert" /usr/local/bin/mkcert
      sudo chmod +x /usr/local/bin/mkcert
      ;;
    wsl)
      echo "WSL detected. Install mkcert on the Windows host if you want Chrome to trust localhost."
      return 1
      ;;
    *)
      return 1
      ;;
  esac
}

echo "Using mkcert certificates."

if ! has mkcert; then
  echo "mkcert was not found."
  if confirm_install_mkcert; then
    install_mkcert || {
      echo "Could not install mkcert. Re-run the script and use the self-signed option instead."
      exit 1
    }
  else
    echo "mkcert installation was skipped. Re-run the script and use the self-signed option instead."
    exit 1
  fi
fi

echo "mkcert is available."
echo "Installing the local CA. Your system may prompt for confirmation."

mkcert -install

mkcert_root="$(mkcert -CAROOT)"
cp "$mkcert_root/rootCA.pem" "$CERT_DIR/ca.pem"

mkcert \
  -key-file "$KEY" \
  -cert-file "$CRT" \
  localhost 127.0.0.1 ::1 backend socket frontend nginx

echo "Trusted mkcert certificates are ready."
