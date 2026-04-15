# Test to check for 429s when hitting the auth endpoint too many times

for i in {1..10}; do
  echo "Request $i"
  curl --cacert ../../certs/ca.pem -i \
    -X POST https://localhost:8443/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"identifier":"test@example.com","password":"wrongpassword"}'
  echo "--------------------"
done