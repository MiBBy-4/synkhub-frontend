#!/bin/bash
set -e

cd /app

yarn install && yarn cache clean --force

exec "$@"
