#!/usr/bin/env bash
# Production smoke check.
#
#   scripts/smoke.sh https://cruiseread.com
#   scripts/smoke.sh                          # defaults to localhost:3000
#
# curl and grep only — no Node, no Playwright, no install. Run it from
# anywhere that can reach the site, which is the point: the build
# environment's egress policy blocks the production domain, so the
# checks that only mean something against a real deployment have to be
# runnable from a laptop.
#
# Everything here is a production-only concern. The build already
# typechecks, lints and replays 2,528 engine reads; none of that needs
# repeating. What this catches is the class of thing that is only true
# once a CDN, a domain and a TLS terminator are involved.
set -uo pipefail

BASE="${1:-http://localhost:3000}"
BASE="${BASE%/}"
PASS=0; FAIL=0; SKIP=0

# Three checks only mean something against the deployed origin: the
# sitemap's absolute URLs, the robots Sitemap: line, and CDN
# compression. Locally they would fail for reasons that say nothing
# about the build, and a check that always fails gets ignored — so they
# report as skipped unless this is running against the real host.
case "$BASE" in
  https://cruiseread.com|https://www.cruiseread.com) PROD=1 ;;
  *) PROD=0 ;;
esac

ok()   { PASS=$((PASS+1)); printf '  \033[32m✓\033[0m %s\n' "$1"; }
skip() { SKIP=$((SKIP+1)); printf '  \033[33m–\033[0m %s \033[33m(only checked against production)\033[0m\n' "$1"; }
bad()  { FAIL=$((FAIL+1)); printf '  \033[31m✗\033[0m %s\n' "$1"; }
check(){ if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 — expected '$3', got '$2'"; fi; }

status() { curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$BASE$1"; }
body()   { curl -s --max-time 20 "$BASE$1"; }

echo
echo "Smoke check: $BASE"
echo

echo "Routes"
for p in / /check /ships /classes /cruise-lines /compare /methodology /about /guides /pricing /request-a-ship \
         /guides/quiet-cabins /guides/obstructed-balconies /guides/cruise-guarantee-cabins \
         /ships/radiance-of-the-seas /classes/royal-caribbean-radiance \
         /cruise-lines/royal-caribbean /sitemap.xml /robots.txt /opengraph-image; do
  check "$p" "$(status "$p")" "200"
done
# Only covered hulls have a page or a record.
check "/ships/sky-princess is 404 (uncharted)"      "$(status /ships/sky-princess)" "404"
check "/data/ships/sky-princess is 404 (uncharted)" "$(status /data/ships/sky-princess)" "404"

echo
echo "The root is a page, not a redirect"
# It redirected to /check between phases 7 and 8. A 3xx here means a
# stale build is deployed.
check "/ returns 200 directly" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$BASE/")" "200"

echo
echo "Crawlability"
SITEMAP="$(body /sitemap.xml)"
URLS="$(printf '%s' "$SITEMAP" | grep -c '<loc>' || true)"
check "sitemap lists 125 urls" "$URLS" "125"
if printf '%s' "$SITEMAP" | grep -q '/share'; then bad "sitemap must not list /share"; else ok "sitemap omits /share"; fi
ROBOTS="$(body /robots.txt)"
if printf '%s' "$ROBOTS" | grep -qi 'Disallow: /share'; then ok "robots disallows /share"; else bad "robots must disallow /share"; fi
if [ "$PROD" = "1" ]; then
  if printf '%s' "$ROBOTS" | grep -q "Sitemap: $BASE/sitemap.xml"; then
    ok "robots points at this host's sitemap"
  else
    bad "robots Sitemap: line does not match $BASE — the domain is hardcoded in 5 files, see README"
  fi
else
  skip "robots Sitemap: line matches the host"
fi
# A ship page whose sitemap entry 404s means a stale deploy.
# Take the PATH from the sitemap and resolve it against whichever host
# is being checked, so this proves the route exists locally too rather
# than only when pointed at production.
FIRST_PATH="$(printf '%s' "$SITEMAP" | grep -o '<loc>[^<]*/ships/[^<]*</loc>' | head -1 | sed 's|.*<loc>||;s|</loc>||;s|https\{0,1\}://[^/]*||')"
if [ -n "$FIRST_PATH" ]; then
  check "first sitemap ship path resolves ($FIRST_PATH)" "$(status "$FIRST_PATH")" "200"
fi

echo
echo "Social cards"
# 111 of 121 pages lost og:image once, because a page declaring its own
# openGraph block replaces the inherited one. Check a static page AND a
# generateMetadata page — the bug was invisible on the static ones.
for p in / /ships/radiance-of-the-seas /classes/royal-caribbean-radiance /cruise-lines/royal-caribbean; do
  if body "$p" | grep -q 'property="og:image"'; then ok "og:image on $p"; else bad "og:image MISSING on $p"; fi
done

echo
echo "The share page is private"
SHARE='/share?ship=radiance-of-the-seas&who=family&seasick=no&sailed=first&itinerary=sea-days'
SHARE_HTML="$(body "$SHARE")"
if printf '%s' "$SHARE_HTML" | grep -q 'name="robots"[^>]*noindex'; then ok "share is noindex"; else bad "share must be noindex — it carries a client's booking"; fi
if printf '%s' "$SHARE_HTML" | grep -q 'rel="canonical"'; then bad "share must not claim a canonical"; else ok "share claims no canonical"; fi
if printf '%s' "$SHARE_HTML" | grep -q 'Your cruise plan — CruiseRead'; then ok "share title is not double-suffixed"; else bad "share title wrong"; fi

echo
echo "Payload"
# /check inlined the whole ship corpus until it was split. If this is
# large again, a stale build is deployed or the split regressed.
CHECK_BYTES="$(body /check | wc -c | tr -d ' ')"
if [ "$CHECK_BYTES" -lt 150000 ]; then ok "/check html is ${CHECK_BYTES}B (was 906KB before the split)"; else bad "/check html is ${CHECK_BYTES}B — the payload split has regressed"; fi
if body /check | grep -q 'Midship on decks 8 or 9'; then bad "a ship record is inlined in /check"; else ok "no ship record inlined in /check"; fi
REC="$(status /data/ships/radiance-of-the-seas)"
check "a ship record is served" "$REC" "200"
# Compression is a CDN concern and does not happen under `next start`.
# `next start` does not compress route-handler responses; a CDN does.
if [ "$PROD" = "1" ]; then
  ENC="$(curl -s -o /dev/null -D - -H 'Accept-Encoding: gzip, br' --max-time 20 "$BASE/data/ships/radiance-of-the-seas" | grep -i '^content-encoding:' | tr -d '\r' | awk '{print $2}')"
  if [ -n "$ENC" ]; then ok "ship records are compressed ($ENC)"; else bad "ship records are NOT compressed — expected br or gzip from the CDN"; fi
else
  skip "ship records are compressed by the CDN"
fi

echo
SUFFIX=""
[ "$SKIP" -gt 0 ] && SUFFIX=", $SKIP skipped"
if [ "$FAIL" -eq 0 ]; then
  printf '\033[32m%s passed, 0 failed%s\033[0m\n' "$PASS" "$SUFFIX"
  [ "$PROD" = "0" ] && printf 'Run against https://cruiseread.com to include the skipped checks.\n'
  echo
else
  printf '\033[31m%s passed, %s failed%s\033[0m\n\n' "$PASS" "$FAIL" "$SUFFIX"
  exit 1
fi
