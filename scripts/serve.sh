#!/usr/bin/env bash
# Rebuild and serve, killing any server already holding the port first.
#
# A stale `next start` silently keeps the port and the new build never
# binds — the log says EADDRINUSE and curl still answers 200 from the OLD
# process, so verification passes against code that is not the code you
# just wrote. That has cost real time twice. This makes it not happen.
set -euo pipefail
pkill -f "next-server" >/dev/null 2>&1 || true
sleep 1
npm run build
npm run start &
for _ in $(seq 1 40); do
  curl -sf http://localhost:3000 -o /dev/null && { echo "serving fresh build"; exit 0; }
  sleep 1
done
echo "server did not come up" >&2
exit 1
