clean_certs_dir() {
  CERT_DIR="$1"
  mkdir -p "$CERT_DIR"

  # Remove everything inside, but keep the directory itself
  rm -rf -- "$CERT_DIR"/*
  rm -rf -- "$CERT_DIR"/.[!.]* "$CERT_DIR"/..?* 2>/dev/null || true
}

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CERT_DIR="$ROOT_DIR/certs"
clean_certs_dir "$CERT_DIR"