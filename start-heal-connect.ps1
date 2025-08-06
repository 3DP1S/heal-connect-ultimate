Write-Host 'Starting...'; $env:NODE_ENV='development'; $env:PORT='5000'; npx cross-env NODE_ENV=development PORT=5000 tsx server/index.ts
