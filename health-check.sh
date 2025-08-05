#!/bin/bash
echo "🔍 HEAL CONNECT: Performing health check..."
curl -s http://localhost:5000/health | jq '.health.score, .status'
curl -s http://localhost:5000/api/systems/diagnostics | jq '.systemHealth.overall'
echo "✅ Health check complete"
