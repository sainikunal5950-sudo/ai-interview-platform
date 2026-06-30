#!/bin/bash

# Make sure your backend server is running on port 8000 (npm run dev) before executing this script!

echo "=== TESTING USER REGISTRATION ==="
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "test123456"
  }'

echo -e "\n\n=== TESTING USER LOGIN ==="
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "test123456"
  }'
echo ""
