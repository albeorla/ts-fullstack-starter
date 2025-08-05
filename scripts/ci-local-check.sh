#!/bin/bash
# Local CI validation script - Run before pushing to catch issues early

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Running local CI checks...${NC}\n"

# Track failures
FAILED_CHECKS=()

# Function to run a check
run_check() {
    local name=$1
    local command=$2
    
    echo -e "${YELLOW}Running: $name${NC}"
    if eval "$command"; then
        echo -e "${GREEN}✅ $name passed${NC}\n"
    else
        echo -e "${RED}❌ $name failed${NC}\n"
        FAILED_CHECKS+=("$name")
    fi
}

# TypeScript check
run_check "TypeScript" "yarn typecheck"

# ESLint
run_check "ESLint" "yarn lint"

# Prettier
run_check "Prettier" "yarn format:check"

# Build check
run_check "Build" "yarn build"

# Summary
echo -e "\n${BLUE}=== Summary ===${NC}"
if [ ${#FAILED_CHECKS[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Safe to push.${NC}"
    exit 0
else
    echo -e "${RED}❌ Failed checks:${NC}"
    for check in "${FAILED_CHECKS[@]}"; do
        echo -e "  - $check"
    done
    echo -e "\n${YELLOW}Fix these issues before pushing to avoid CI failures.${NC}"
    exit 1
fi