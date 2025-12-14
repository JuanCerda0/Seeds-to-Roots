#!/bin/bash

set -e

if [ ! -d "node_modules" ]; then
  npm install
fi

npm run build
npx serve -s dist -l ${PORT:-4173}
