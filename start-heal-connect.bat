@echo off
set NODE_ENV=development
set PORT=5000
echo Starting HEAL CONNECT ULTIMATE on port %PORT%
npx cross-env NODE_ENV=development PORT=5000 tsx server/index.ts
