#!/bin/sh
# OS detection utility (POSIX compatible)

detect_os() {
  UNAME="$(uname -s 2>/dev/null || echo unknown)"

  case "$UNAME" in
    Darwin)
      OS="macos"
      ;;

    Linux)
      # Detect WSL
      if grep -qi microsoft /proc/version 2>/dev/null; then
        OS="wsl"
      else
        OS="linux"
      fi
      ;;

    MINGW*|MSYS*|CYGWIN*)
      OS="windows"
      ;;

    *)
      OS="unknown"
      ;;
  esac

  export OS
}