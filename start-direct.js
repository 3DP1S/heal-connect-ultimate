const { spawn } = require('child_process');
process.env.NODE_ENV = 'development';
process.env.PORT = process.env.TargetPort || '5000';
spawn('npx', ['tsx', 'server/index.ts'], { stdio: 'inherit', env: process.env });
