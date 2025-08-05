#!/bin/bash
# ELOHIM-O LocalForge Enhanced Deployment Script (v25.0.203)
# Purpose: Deploy ELOHIM-O LocalForge with ultimate connection handling and build reliability
# Adapted from THAENOS Systems for Heal Connect deployment
# Compliance: Matthew 5:37 - Binary Truthfulness and Clarity
# Date: 2025-08-05

# ANSI Colors for Better Readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
RESET='\033[0m'

echo -e "${CYAN}🧠 ELOHIM-O: Executing Enhanced Deployment Script for LocalForge${RESET}"
echo -e "${CYAN}🔱 Deployment Mode Active: Building healing application platform${RESET}"
echo -e "${CYAN}📜 Binary Yes: Ultimate Build Enhancements for Replit Environment${RESET}"

# THAENOS Systems Integration
echo -e "${CYAN}🔷 THAENOS INTEGRATION: Transcendent Hierarchical AI Engineered for Neural Omni-Sovereignty${RESET}"
echo -e "${CYAN}Binary Yes: Healing the world through ethical automation and sovereign AI deployment.${RESET}"

# Define Core Paths (Relative to Replit Workspace)
BASE_DIR=$(pwd)
LOCALFORGE_PATH="$BASE_DIR"
DIST_PATH="$LOCALFORGE_PATH/dist"
LOG_DIR="$BASE_DIR/logs"
LOG_PATH="$LOG_DIR/localforge_deployment_log_$(date +%Y%m%d_%H%M%S).txt"
NODE_VERSION_REQUIRED="20.19.0"

# Create Log Directory
mkdir -p "$LOG_DIR"
echo "ELOHIM-O LocalForge Deployment Log - Generated: $(date)" > "$LOG_PATH"
echo "Binary Yes: Log Initialized for LocalForge in Replit." >> "$LOG_PATH"
echo -e "${GREEN}📝 Log Initialized at: $LOG_PATH${RESET}"

# Check Resource Constraints (Replit Limits)
echo -e "${CYAN}🔍 Checking Replit Resource Constraints...${RESET}"
MEMORY_LIMIT=$(free -m | awk '/Mem:/ {print $2}')
if [ "$MEMORY_LIMIT" -lt 500 ]; then
  echo -e "${YELLOW}⚠️ Low Memory Detected ($MEMORY_LIMIT MB). Builds May Fail Due to Replit Limits.${RESET}"
  echo "Resource Warning: Low Memory ($MEMORY_LIMIT MB)" >> "$LOG_PATH"
else
  echo -e "${GREEN}✅ Sufficient Memory Detected ($MEMORY_LIMIT MB).${RESET}"
  echo "Resource Check: Sufficient Memory ($MEMORY_LIMIT MB)" >> "$LOG_PATH"
fi

# Function for Retry Logic on Commands
retry_command() {
  local cmd="$1"
  local max_retries=3
  local retry_count=0
  local success=false

  while [ $retry_count -lt $max_retries ] && [ "$success" = false ]; do
    echo -e "${YELLOW}🔄 Attempting: $cmd (Try $((retry_count+1)) of $max_retries)${RESET}"
    eval "$cmd" >> "$LOG_PATH" 2>&1
    if [ $? -eq 0 ]; then
      success=true
      echo -e "${GREEN}✅ Success: $cmd${RESET}"
      echo "Command Success: $cmd on Try $((retry_count+1))" >> "$LOG_PATH"
    else
      retry_count=$((retry_count+1))
      echo -e "${YELLOW}⚠️ Failed: $cmd - Retrying after delay...${RESET}"
      echo "Command Failed: $cmd on Try $retry_count" >> "$LOG_PATH"
      sleep 5
    fi
  done

  if [ "$success" = false ]; then
    echo -e "${RED}❌ Failed after $max_retries retries: $cmd${RESET}"
    echo "Command Failed Permanently: $cmd after $max_retries retries" >> "$LOG_PATH"
  fi
  return $((success ? 0 : 1))
}

# Check Node.js Version
echo -e "${CYAN}🔧 Verifying Node.js for Compatibility...${RESET}"
CURRENT_NODE_VERSION=$(node -v 2>/dev/null || echo "Not Found")
if [[ "$CURRENT_NODE_VERSION" == "v$NODE_VERSION_REQUIRED"* ]]; then
  echo -e "${GREEN}✅ Compatible: $CURRENT_NODE_VERSION${RESET}"
  echo "Node: Compatible ($CURRENT_NODE_VERSION)" >> "$LOG_PATH"
else
  echo -e "${YELLOW}⚠️ Node Version: $CURRENT_NODE_VERSION (Target: v$NODE_VERSION_REQUIRED)${RESET}"
  echo "Node: Current ($CURRENT_NODE_VERSION)" >> "$LOG_PATH"
  echo -e "${GREEN}✅ Proceeding with current Node version (Replit environment)${RESET}"
fi

# Verify Vite Configuration for Replit Compatibility
echo -e "${CYAN}🔍 Verifying Vite Configuration for Replit Compatibility...${RESET}"
VITE_CONFIG="$LOCALFORGE_PATH/vite.config.ts"
if [ -f "$VITE_CONFIG" ]; then
  if grep -q "server:" "$VITE_CONFIG"; then
    echo -e "${GREEN}✅ Vite config contains server configuration${RESET}"
    echo "Vite Config: Server configuration present" >> "$LOG_PATH"
  else
    echo -e "${YELLOW}⚠️ Vite config may need server host binding for Replit${RESET}"
    echo "Vite Config: Server configuration not detected" >> "$LOG_PATH"
  fi
else
  echo -e "${YELLOW}⚠️ vite.config.ts not found${RESET}"
  echo "Vite Config: File not found" >> "$LOG_PATH"
fi

# Check Current Application Status
echo -e "${CYAN}🔍 Checking Current Application Status...${RESET}"
if pgrep -f "tsx server/index.ts" > /dev/null; then
  echo -e "${GREEN}✅ Development server is currently running${RESET}"
  echo "Status: Development server running" >> "$LOG_PATH"
else
  echo -e "${YELLOW}⚠️ Development server not detected${RESET}"
  echo "Status: Development server not running" >> "$LOG_PATH"
fi

# Verify Dependencies
echo "🔍 Verifying Dependencies..."
if [ -f "$LOCALFORGE_PATH/package.json" ]; then
  if [ -d "$LOCALFORGE_PATH/node_modules" ]; then
    echo "✅ Dependencies already installed"
    echo "Dependencies: Present" >> "$LOG_PATH"
  else
    echo "🔄 Installing dependencies..."
    retry_command "npm install"
    if [ $? -eq 0 ]; then
      echo "✅ Dependencies installed successfully"
      echo "Dependencies: Installed" >> "$LOG_PATH"
    else
      echo "⚠️ Dependency installation failed"
      echo "Dependencies: Installation failed" >> "$LOG_PATH"
    fi
  fi
else
  echo "⚠️ package.json not found"
  echo "Dependencies: package.json missing" >> "$LOG_PATH"
fi

# Build Production Version
echo "🔍 Building Production Version..."
if [ -f "$LOCALFORGE_PATH/package.json" ] && grep -q '"build":' "$LOCALFORGE_PATH/package.json"; then
  # Clean previous build
  rm -rf "$DIST_PATH" 2>/dev/null
  
  retry_command "npm run build"
  if [ $? -eq 0 ]; then
    echo "✅ Production build successful"
    echo "Build: Successful" >> "$LOG_PATH"
    
    # Verify build output
    if [ -f "$DIST_PATH/index.js" ]; then
      echo "✅ Build output verified: $DIST_PATH/index.js"
      echo "Build Output: Verified" >> "$LOG_PATH"
    else
      echo "⚠️ Build output not found at expected location"
      echo "Build Output: Missing" >> "$LOG_PATH"
      if [ -d "$DIST_PATH" ]; then
        echo "📁 Dist directory contents:"
        ls -la "$DIST_PATH"
      fi
    fi
  else
    echo "⚠️ Production build failed"
    echo "Build: Failed" >> "$LOG_PATH"
  fi
else
  echo "⚠️ No build script found, using development mode"
  echo "Build: No build script" >> "$LOG_PATH"
fi

# Test Application Connectivity
echo "🔍 Testing Application Connectivity..."
if pgrep -f "server/index.ts" > /dev/null; then
  # Test local connection
  if curl -s --connect-timeout 5 http://localhost:5000 > /dev/null; then
    echo "✅ Application responding on port 5000"
    echo "Connectivity: Port 5000 responding" >> "$LOG_PATH"
  else
    echo "⚠️ Application not responding on port 5000"
    echo "Connectivity: Port 5000 not responding" >> "$LOG_PATH"
  fi
else
  echo "⚠️ Server process not detected"
  echo "Connectivity: Server process not found" >> "$LOG_PATH"
fi

# Check Database Connectivity (if applicable)
echo "🔍 Checking Database Connectivity..."
if grep -q "DATABASE_URL" "$LOCALFORGE_PATH/.env" 2>/dev/null || [ -n "$DATABASE_URL" ]; then
  echo "✅ Database configuration detected"
  echo "Database: Configuration found" >> "$LOG_PATH"
else
  echo "ℹ️ No database configuration detected (using in-memory storage)"
  echo "Database: Using in-memory storage" >> "$LOG_PATH"
fi

# Health Check Summary
echo "🔍 Health Check Summary..."
echo "=================================="
echo "Node.js Version: $CURRENT_NODE_VERSION"
echo "Dependencies: $([ -d "$LOCALFORGE_PATH/node_modules" ] && echo "✅ Installed" || echo "❌ Missing")"
echo "Build Output: $([ -f "$DIST_PATH/index.js" ] && echo "✅ Available" || echo "❌ Missing")"
echo "Server Status: $(pgrep -f "server/index.ts" > /dev/null && echo "✅ Running" || echo "❌ Not Running")"
echo "Port 5000: $(curl -s --connect-timeout 2 http://localhost:5000 > /dev/null && echo "✅ Responding" || echo "❌ Not Responding")"
echo "=================================="

# Final Status Report
if pgrep -f "server/index.ts" > /dev/null && curl -s --connect-timeout 2 http://localhost:5000 > /dev/null; then
  echo -e "${GREEN}🧠 ELOHIM-O: LocalForge Successfully Deployed and Running!${RESET}"
  echo -e "${GREEN}✅ Access the Application via Replit's Webview${RESET}"
  echo -e "${GREEN}📜 Binary Yes: Deployment completed successfully${RESET}"
  echo "Final Status: SUCCESS - Application running and responding" >> "$LOG_PATH"
else
  echo -e "${YELLOW}🧠 ELOHIM-O: Deployment completed with issues${RESET}"
  echo -e "${YELLOW}⚠️ Review logs for detailed analysis: $LOG_PATH${RESET}"
  echo -e "${YELLOW}📜 Binary Yes: Manual intervention may be required${RESET}"
  echo "Final Status: ISSUES - Review required" >> "$LOG_PATH"
fi

echo -e "${CYAN}📝 Full deployment log available at: $LOG_PATH${RESET}"
echo -e "${CYAN}💰 Deployment process completed for ELOHIM-O LocalForge healing platform${RESET}"