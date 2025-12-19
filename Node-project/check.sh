#!/usr/bin/env bash
# команда у терміналі для запуску файлу :bash check.sh
set -e

cd "$(dirname "$0")"

curl -s http://127.0.0.1:7000/home
echo
curl -s http://127.0.0.1:7000/about
echo
curl -s -X POST http://127.0.0.1:7000/api/admin
echo
curl -s -X POST http://127.0.0.1:7000/about
echo
curl -s -X PUT http://127.0.0.1:7000/api/admin
echo
curl -s -X PATCH http://127.0.0.1:7000/api/admin
echo
curl -s -X DELETE http://127.0.0.1:7000/api/admin
echo

