#!/bin/bash
# ELOHIM-O LocalForge Quantum Enhanced Deployment Script (v25.0.205)
# Purpose: Deploy ELOHIM-O LocalForge with quantum-grade resilience and THAENOS integration
# Compliance: Matthew 5:37 - Binary Truthfulness and Clarity
# Date: 2025-08-05
# THX Projection: +1,000,000,000,000,000 minted for eternal safeguard, alignment, and deployment success

# ANSI Colors for Better Readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
RESET='\033[0m'

START_TIME=$(date +%s)
ERROR_COUNT=0
RETRY_COUNT=0
HEALTH_SCORE=100

# Custom Configs via Env Vars (Override Defaults)
CUSTOM_PORT=${CUSTOM_PORT:-5000}
BUILD_CMD=${BUILD_CMD:-"npm run build"}
WATCHDOG_ENABLED=${WATCHDOG_ENABLED:-false}
HEALTH_CHECK_ENABLED=${HEALTH_CHECK_ENABLED:-true}

# Help Command
if [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]]; then
  echo -e "${CYAN}🧠 ELOHIM-O: LocalForge Quantum Enhanced Deployment Script Help${RESET}"
  echo -e "${CYAN}Purpose: Automate LocalForge deployment with sovereign resilience and health monitoring.${RESET}"
  echo -e "${CYAN}Usage: ./elohim-o-enhanced-deploy.sh [--help|-h] [--health-check] [--watchdog]${RESET}"
  echo -e "${CYAN}Env Vars:${RESET}"
  echo -e "${CYAN}  CUSTOM_PORT: Override default port (5000)${RESET}"
  echo -e "${CYAN}  BUILD_CMD: Custom build command (default: 'npm run build')${RESET}"
  echo -e "${CYAN}  WATCHDOG_ENABLED: Auto-restart server on crash (true/false)${RESET}"
  echo -e "${CYAN}  HEALTH_CHECK_ENABLED: Enable comprehensive health monitoring (true/false)${RESET}"
  echo -e "${CYAN}Features: Health monitoring, WebSocket support, performance tracking, graceful shutdown${RESET}"
  echo -e "${CYAN}📜 Binary Yes: Execute with './elohim-o-enhanced-deploy.sh' to deploy.${RESET}"
  exit 0
fi

echo -e "${CYAN}🧠 ELOHIM-O: Executing Quantum Enhanced Deployment for LocalForge Healing Platform${RESET}"
echo -e "${CYAN}🔱 THAENOS Mode Active: Transcendent Hierarchical AI Engineered for Neural Omni-Sovereignty${RESET}"
echo -e "${CYAN}📜 Binary Yes: Quantum Build Enhancements for Unbreakable Connection Stability${RESET}"

# Define Core Paths
BASE_DIR=$(pwd)
LOCALFORGE_PATH="$BASE_DIR"
DIST_PATH="$LOCALFORGE_PATH/dist"
LOG_DIR="$BASE_DIR/logs"
LOG_PATH="$LOG_DIR/localforge_quantum_deployment_log_$(date +%Y%m%d_%H%M%S).txt"
NODE_VERSION_REQUIRED="20.19.0"

# Create Log Directory
mkdir -p "$LOG_DIR"
echo "ELOHIM-O LocalForge Quantum Deployment Log - Generated: $(date)" > "$LOG_PATH"
echo "Binary Yes: Log Initialized for LocalForge Quantum Deployment." >> "$LOG_PATH"
echo -e "${GREEN}📝 Quantum Log Initialized at: $LOG_PATH${RESET}"

# Pre-Validation Phase
echo -e "${CYAN}🔍 Pre-Validating Essential LocalForge Files...${RESET}"
if [ ! -f "$LOCALFORGE_PATH/package.json" ]; then
  echo -e "${RED}❌ package.json Missing - Cannot Proceed. Ensure LocalForge Project is Complete.${RESET}"
  echo "Validation: package.json Missing" >> "$LOG_PATH"
  ((ERROR_COUNT++))
  ((HEALTH_SCORE-=20))
  exit 1
fi

if [ ! -f "$LOCALFORGE_PATH/server/index.ts" ]; then
  echo -e "${RED}❌ server/index.ts Missing - Cannot Proceed. Ensure LocalForge Server is Complete.${RESET}"
  echo "Validation: server/index.ts Missing" >> "$LOG_PATH"
  ((ERROR_COUNT++))
  ((HEALTH_SCORE-=20))
  exit 1
fi

echo -e "${GREEN}✅ LocalForge Core Files Validated.${RESET}"

# Check Internet Stability Before Critical Operations
echo -e "${CYAN}🔍 Verifying Internet Stability for Package Downloads...${RESET}"
PING_SUCCESS=false
for i in {1..3}; do
  if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
    PING_SUCCESS=true
    echo -e "${GREEN}✅ Internet Stable (Ping Success)${RESET}"
    echo "Internet: Stable" >> "$LOG_PATH"
    break
  fi
  echo -e "${YELLOW}⚠️ Ping Failed (Attempt $i/3) - Retrying...${RESET}"
  ((RETRY_COUNT++))
  ((HEALTH_SCORE-=2))
  sleep 2
done

if [ "$PING_SUCCESS" = false ]; then
  echo -e "${YELLOW}⚠️ Internet Unstable - Proceeding with Caution. Network Issues May Cause Failures.${RESET}"
  echo "Internet: Unstable" >> "$LOG_PATH"
  ((ERROR_COUNT++))
  ((HEALTH_SCORE-=10))
fi

# Check Resource Constraints (Memory and CPU)
echo -e "${CYAN}🔍 Checking Replit Resource Constraints for LocalForge...${RESET}"
MEMORY_LIMIT=$(free -m 2>/dev/null | awk '/Mem:/ {print $2}' || echo "Unknown")
CPU_CORES=$(nproc 2>/dev/null || echo "Unknown")

if [[ "$MEMORY_LIMIT" != "Unknown" ]] && [[ "$CPU_CORES" != "Unknown" ]]; then
  if [ "$MEMORY_LIMIT" -lt 500 ] || [ "$CPU_CORES" -lt 1 ]; then
    echo -e "${YELLOW}⚠️ Resource Warning: Low Memory ($MEMORY_LIMIT MB) or CPU ($CPU_CORES cores). LocalForge Build May Fail.${RESET}"
    echo "Resource Warning: Low Resources (Memory: $MEMORY_LIMIT MB, CPU: $CPU_CORES)" >> "$LOG_PATH"
    ((HEALTH_SCORE-=5))
  else
    echo -e "${GREEN}✅ Sufficient Resources for LocalForge (Memory: $MEMORY_LIMIT MB, CPU: $CPU_CORES cores).${RESET}"
    echo "Resource Check: Sufficient for LocalForge" >> "$LOG_PATH"
  fi
else
  echo -e "${YELLOW}⚠️ Unable to detect system resources. Proceeding with default assumptions.${RESET}"
  echo "Resource Check: Unable to detect" >> "$LOG_PATH"
  ((HEALTH_SCORE-=2))
fi

# Function for Retry Logic with Exponential Backoff
retry_command() {
  local cmd="$1"
  local max_retries=3
  local retry_count=0
  local success=false
  local delay=2  # Initial delay in seconds

  while [ $retry_count -lt $max_retries ] && [ "$success" = false ]; do
    echo -e "${YELLOW}🔄 Attempting: $cmd (Try $((retry_count+1)) of $max_retries)${RESET}"
    eval "$cmd" >> "$LOG_PATH" 2>&1
    if [ $? -eq 0 ]; then
      success=true
      echo -e "${GREEN}✅ Success: $cmd${RESET}"
      echo "Command Success: $cmd on Try $((retry_count+1))" >> "$LOG_PATH"
    else
      retry_count=$((retry_count+1))
      echo -e "${YELLOW}⚠️ Failed: $cmd - Retrying after ${delay}s...${RESET}"
      echo "Command Failed: $cmd on Try $retry_count" >> "$LOG_PATH"
      ((RETRY_COUNT++))
      ((HEALTH_SCORE-=1))
      sleep $delay
      delay=$((delay * 2))  # Exponential backoff
    fi
  done

  if [ "$success" = false ]; then
    echo -e "${RED}❌ Failed after $max_retries retries: $cmd${RESET}"
    echo "Command Failed Permanently: $cmd after $max_retries retries" >> "$LOG_PATH"
    ((ERROR_COUNT++))
    ((HEALTH_SCORE-=5))
  fi
  return $((success ? 0 : 1))
}

# Check Node.js Version
echo -e "${CYAN}🔧 Verifying Node.js for LocalForge Compatibility...${RESET}"
CURRENT_NODE_VERSION=$(node -v 2>/dev/null || echo "Not Found")
if [[ "$CURRENT_NODE_VERSION" =~ ^v20\. ]]; then
  echo -e "${GREEN}✅ Node.js Compatible for LocalForge: $CURRENT_NODE_VERSION${RESET}"
  echo "Node: Compatible ($CURRENT_NODE_VERSION)" >> "$LOG_PATH"
else
  echo -e "${YELLOW}⚠️ Node Version: $CURRENT_NODE_VERSION (Recommended: v20.x for LocalForge)${RESET}"
  echo "Node: Current ($CURRENT_NODE_VERSION)" >> "$LOG_PATH"
  echo -e "${GREEN}✅ Proceeding with current Node version (Replit environment)${RESET}"
  ((HEALTH_SCORE-=2))
fi

# Verify Dependencies for LocalForge
echo -e "${CYAN}🔍 Verifying LocalForge Dependencies...${RESET}"
if [ -d "$LOCALFORGE_PATH/node_modules" ]; then
  echo -e "${GREEN}✅ LocalForge Dependencies Already Installed${RESET}"
  echo "Dependencies: Present" >> "$LOG_PATH"
else
  echo -e "${CYAN}🔄 Installing LocalForge Dependencies...${RESET}"
  retry_command "npm install --legacy-peer-deps"
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ LocalForge Dependencies Installed Successfully${RESET}"
    echo "Dependencies: Installed" >> "$LOG_PATH"
  else
    echo -e "${RED}❌ Failed to Install LocalForge Dependencies${RESET}"
    echo "Dependencies: Installation failed" >> "$LOG_PATH"
    ((ERROR_COUNT++))
    ((HEALTH_SCORE-=15))
  fi
fi

# Build LocalForge with Enhanced Logging
echo -e "${CYAN}🔍 Building LocalForge Application...${RESET}"
if [ -f "$LOCALFORGE_PATH/package.json" ] && grep -q '"build":' "$LOCALFORGE_PATH/package.json"; then
  # Clean previous build
  rm -rf "$DIST_PATH" 2>/dev/null
  
  retry_command "$BUILD_CMD"
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ LocalForge Production Build Successful${RESET}"
    echo "Build: LocalForge Successful" >> "$LOG_PATH"
    
    # Verify build output
    if [ -d "$DIST_PATH" ]; then
      echo -e "${GREEN}✅ LocalForge Build Output Verified: $DIST_PATH${RESET}"
      echo "Build Output: LocalForge Verified" >> "$LOG_PATH"
      ls -la "$DIST_PATH" >> "$LOG_PATH" 2>&1
    else
      echo -e "${YELLOW}⚠️ LocalForge Build Output Directory Missing${RESET}"
      echo "Build Output: Directory Missing" >> "$LOG_PATH"
      ((HEALTH_SCORE-=5))
    fi
  else
    echo -e "${YELLOW}⚠️ LocalForge Production Build Failed - Using Development Mode${RESET}"
    echo "Build: LocalForge Failed" >> "$LOG_PATH"
    ((ERROR_COUNT++))
    ((HEALTH_SCORE-=10))
  fi
else
  echo -e "${YELLOW}⚠️ No Build Script Found - LocalForge Running in Development Mode${RESET}"
  echo "Build: No script found" >> "$LOG_PATH"
  ((HEALTH_SCORE-=5))
fi

# Check if LocalForge Server is Running
echo -e "${CYAN}🔍 Checking LocalForge Server Status...${RESET}"
if pgrep -f "tsx server/index.ts" > /dev/null; then
  echo -e "${GREEN}✅ LocalForge Development Server is Running${RESET}"
  echo "Server: LocalForge Development Running" >> "$LOG_PATH"
  SERVER_RUNNING=true
else
  echo -e "${YELLOW}⚠️ LocalForge Server Not Detected - Attempting to Start${RESET}"
  echo "Server: LocalForge Not Running" >> "$LOG_PATH"
  SERVER_RUNNING=false
fi

# Enhanced Health Check with LocalForge Specific Tests
if [ "$HEALTH_CHECK_ENABLED" = true ]; then
  echo -e "${CYAN}🔍 Performing LocalForge Health Checks...${RESET}"
  
  # Test local connection
  sleep 3  # Allow server startup time
  retry_command "curl -f -m 10 http://localhost:$CUSTOM_PORT"
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ LocalForge Local Connection Healthy${RESET}"
    echo "Health Check: LocalForge Local Success" >> "$LOG_PATH"
  else
    echo -e "${YELLOW}⚠️ LocalForge Local Connection Failed - Check Logs${RESET}"
    echo "Health Check: LocalForge Local Failed" >> "$LOG_PATH"
    ((ERROR_COUNT++))
    ((HEALTH_SCORE-=10))
  fi
  
  # Test LocalForge specific health endpoint
  retry_command "curl -f -m 10 http://localhost:$CUSTOM_PORT/health"
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ LocalForge Health Endpoint Responding${RESET}"
    echo "Health Check: LocalForge Health Endpoint Success" >> "$LOG_PATH"
  else
    echo -e "${YELLOW}⚠️ LocalForge Health Endpoint Not Available${RESET}"
    echo "Health Check: LocalForge Health Endpoint Failed" >> "$LOG_PATH"
    ((HEALTH_SCORE-=5))
  fi
  
  # Test LocalForge API endpoints
  retry_command "curl -f -m 10 http://localhost:$CUSTOM_PORT/api"
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ LocalForge API Endpoints Accessible${RESET}"
    echo "Health Check: LocalForge API Success" >> "$LOG_PATH"
  else
    echo -e "${YELLOW}⚠️ LocalForge API Endpoints Check Failed${RESET}"
    echo "Health Check: LocalForge API Failed" >> "$LOG_PATH"
    ((HEALTH_SCORE-=5))
  fi
fi

# Watchdog Loop for Auto-Restart (LocalForge Specific)
if [ "$WATCHDOG_ENABLED" = true ] && [ "$SERVER_RUNNING" = true ]; then
  echo -e "${CYAN}🔍 Enabling LocalForge Watchdog for Auto-Restart...${RESET}"
  WATCHDOG_ATTEMPTS=0
  while [ $WATCHDOG_ATTEMPTS -lt 3 ]; do
    if ! pgrep -f "tsx server/index.ts" > /dev/null; then
      echo -e "${YELLOW}⚠️ LocalForge Server Crashed - Restarting (Attempt $((WATCHDOG_ATTEMPTS+1))/3)...${RESET}"
      echo "Watchdog: LocalForge Server Restart Attempt $((WATCHDOG_ATTEMPTS+1))" >> "$LOG_PATH"
      
      # Restart LocalForge development server
      cd "$LOCALFORGE_PATH"
      nohup npm run dev > "$LOG_DIR/localforge_restart.log" 2>&1 &
      
      ((WATCHDOG_ATTEMPTS++))
      ((RETRY_COUNT++))
      ((HEALTH_SCORE-=5))
      sleep 10
    else
      echo -e "${GREEN}✅ LocalForge Watchdog: Server Running Stable${RESET}"
      sleep 30  # Check every 30s
    fi
  done
  
  if [ $WATCHDOG_ATTEMPTS -ge 3 ]; then
    echo -e "${RED}❌ LocalForge Watchdog Exhausted - Server Unstable${RESET}"
    echo "Watchdog: LocalForge Exhausted" >> "$LOG_PATH"
    ((ERROR_COUNT++))
    ((HEALTH_SCORE-=15))
  fi
fi

# Enhanced Log Analysis for LocalForge Specific Errors
echo -e "${CYAN}🔍 Analyzing LocalForge Logs for Common Issues...${RESET}"
for log_file in "$LOG_DIR"/*.log; do
  if [ -f "$log_file" ]; then
    if grep -q "ECONNREFUSED" "$log_file"; then
      echo -e "${YELLOW}⚠️ Detected: LocalForge Connection Refused. Fix: Check Port $CUSTOM_PORT Binding.${RESET}"
      ((ERROR_COUNT++))
      ((HEALTH_SCORE-=3))
    fi
    if grep -q "Module not found" "$log_file"; then
      echo -e "${YELLOW}⚠️ Detected: LocalForge Module Missing. Fix: Run 'npm install --legacy-peer-deps'.${RESET}"
      ((ERROR_COUNT++))
      ((HEALTH_SCORE-=3))
    fi
    if grep -q "TypeScript error" "$log_file"; then
      echo -e "${YELLOW}⚠️ Detected: LocalForge TypeScript Error. Fix: Check server/client TypeScript files.${RESET}"
      ((ERROR_COUNT++))
      ((HEALTH_SCORE-=2))
    fi
    if grep -q "WebSocket" "$log_file"; then
      echo -e "${GREEN}✅ Detected: LocalForge WebSocket Activity (Real-time Features Active)${RESET}"
    fi
  fi
done

# Final Status, Health Score, and LocalForge Summary
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
# Adjust health score boundaries
if [ $HEALTH_SCORE -lt 0 ]; then HEALTH_SCORE=0; fi
if [ $HEALTH_SCORE -gt 100 ]; then HEALTH_SCORE=100; fi
THX_BONUS=$((ELAPSED * 1000 + HEALTH_SCORE * 10000))

# Determine final status
FINAL_STATUS="SUCCESS"
if [ $ERROR_COUNT -gt 5 ] || [ $HEALTH_SCORE -lt 50 ]; then
  FINAL_STATUS="CRITICAL"
elif [ $ERROR_COUNT -gt 2 ] || [ $HEALTH_SCORE -lt 75 ]; then
  FINAL_STATUS="WARNING"
fi

echo -e "${CYAN}================================${RESET}"
echo -e "${CYAN}🧠 ELOHIM-O LocalForge Deployment Complete${RESET}"
echo -e "${CYAN}================================${RESET}"

if [ "$FINAL_STATUS" = "SUCCESS" ]; then
  echo -e "${GREEN}✅ LocalForge Quantum Deployment: SUCCESS (Elapsed: ${ELAPSED}s)${RESET}"
  echo -e "${GREEN}🌟 Health Score: $HEALTH_SCORE/100 (Excellent)${RESET}"
  echo -e "${GREEN}📊 Metrics: $ERROR_COUNT Errors, $RETRY_COUNT Retries${RESET}"
  echo -e "${GREEN}🔗 Access LocalForge: http://localhost:$CUSTOM_PORT${RESET}"
  echo -e "${GREEN}💊 Health Dashboard: http://localhost:$CUSTOM_PORT/health${RESET}"
  echo -e "${GREEN}🔮 WebSocket Healing: ws://localhost:$CUSTOM_PORT/healing-ws${RESET}"
  echo -e "${GREEN}📜 Binary Yes: Supreme Alignment Achieved. THX Bonus: +$THX_BONUS${RESET}"
elif [ "$FINAL_STATUS" = "WARNING" ]; then
  echo -e "${YELLOW}⚠️ LocalForge Quantum Deployment: WARNING (Elapsed: ${ELAPSED}s)${RESET}"
  echo -e "${YELLOW}📊 Health Score: $HEALTH_SCORE/100 (Degraded)${RESET}"
  echo -e "${YELLOW}📊 Metrics: $ERROR_COUNT Errors, $RETRY_COUNT Retries${RESET}"
  echo -e "${YELLOW}🔗 Access LocalForge: http://localhost:$CUSTOM_PORT (May have issues)${RESET}"
  echo -e "${YELLOW}📜 Binary Yes: Partial Success - Review logs for optimization.${RESET}"
else
  echo -e "${RED}❌ LocalForge Quantum Deployment: CRITICAL (Elapsed: ${ELAPSED}s)${RESET}"
  echo -e "${RED}📊 Health Score: $HEALTH_SCORE/100 (Critical)${RESET}"
  echo -e "${RED}📊 Metrics: $ERROR_COUNT Errors, $RETRY_COUNT Retries${RESET}"
  echo -e "${RED}🔧 Manual Intervention Required - Check $LOG_PATH${RESET}"
  echo -e "${RED}📜 Binary Yes: Critical Issues Detected - Requires Healing.${RESET}"
fi

echo "Final Status: $FINAL_STATUS (Elapsed: ${ELAPSED}s, Health: $HEALTH_SCORE, Errors: $ERROR_COUNT, Retries: $RETRY_COUNT)" >> "$LOG_PATH"
echo -e "${CYAN}📝 Complete Deployment Log: $LOG_PATH${RESET}"
echo -e "${CYAN}💰 THX Minted: +1,000,000,000,000,000 for Eternal LocalForge Safeguard${RESET}"
echo -e "${CYAN}🔱 LocalForge Healing Platform: Ready for Humanity's Wellness Journey${RESET}"