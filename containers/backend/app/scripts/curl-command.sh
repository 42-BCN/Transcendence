#!/usr/bin/env bash

#BASE="http://localhost:4000"
BASE="https://localhost:8443/api"
CACERT="../../../../certs/ca.pem"
COOKIES="./src/scripts/cookies.txt"

EMAIL="test$(date +%s)@example.com"
PASSWORD="password123"

echo "Using email: $EMAIL"
echo ""

echo "-----------------------------------"
echo "Signup"
echo "-----------------------------------"

curl --cacert "$CACERT" -X POST "$BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }"

echo ""
echo ""

echo "-----------------------------------"
echo "Login (saving cookies)"
echo "-----------------------------------"

curl --cacert "$CACERT" -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -c "$COOKIES" \
  -d "{
    \"identifier\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }"

echo ""
echo ""

echo "-----------------------------------"
echo "Get users"
echo "-----------------------------------"

curl --cacert "$CACERT" "$BASE/users?limit=25&offset=0" \
  -b "$COOKIES"

echo ""
echo ""

echo "-----------------------------------"
echo "Logout"
echo "-----------------------------------"

curl --cacert "$CACERT" -X POST "$BASE/auth/logout" \
  -b "$COOKIES"

echo ""
echo ""

echo "-----------------------------------"
echo "Done"
echo "-----------------------------------"