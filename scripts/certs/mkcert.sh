#!/bin/sh
set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

. "$SCRIPT_DIR/../lib/os.sh"
detect_os
echo "✅ Detected OS: $OS"
echo


has() { command -v "$1" >/dev/null 2>&1; }

confirm_install_mkcert() {
cat <<EOF

mkcert is not installed.

This script can install mkcert on your machine so Chrome trusts https://localhost.
You may be prompted for your password (admin) to install the local CA.

Do you want to install mkcert now? [Y/n]
EOF
  read ans || ans=""
  case "$ans" in
    ""|Y|y|yes|YES) return 0 ;;
    *) return 1 ;;
  esac
}

install_mkcert() {
  echo "📦 Attempting to install mkcert..."
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
      curl -L https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-linux-amd64 \
        -o /usr/local/bin/mkcert
      sudo chmod +x /usr/local/bin/mkcert
      ;;
    wsl)
      echo "⚠️ WSL detected. Prefer installing mkcert on Windows host for Chrome trust."
      return 1
      ;;
    *)
      return 1
      ;;
  esac
}

echo "➡️ Using mkcert"

if ! has mkcert; then
  echo "ℹ️ mkcert not found"
  if confirm_install_mkcert; then
    install_mkcert || {
      echo "❌ Could not install mkcert. Re-run and choose self-signed."
      exit 1
    }
  else
    echo "❌ User declined mkcert installation. Re-run and choose self-signed."
    exit 1
  fi
fi

echo "✅ mkcert available"
echo "🔧 Installing local CA (may prompt)..."

mkcert -install

mkcert \
  -key-file "$KEY" \
  -cert-file "$CRT" \
  localhost 127.0.0.1 ::1

echo "🎉 HTTPS ready with trusted mkcert certificate"