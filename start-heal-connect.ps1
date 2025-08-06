Write-Host "Starting HEAL CONNECT ULTIMATE..." -ForegroundColor Green
$env:NODE_ENV = "development"
$env:PORT = "5000"
Write-Host "Environment: $env:NODE_ENV, Port: $env:PORT" -ForegroundColor Cyan
npx cross-env NODE_ENV=development PORT=5000 tsx server/index.ts
