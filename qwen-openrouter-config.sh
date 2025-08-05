#!/bin/bash

# Qwen CLI Configuration for OpenRouter Horizon Beta
# Usage: source ./qwen-openrouter-config.sh

echo "🔧 Configuring Qwen CLI for OpenRouter Horizon Beta..."

# Set OpenRouter API credentials
export OPENROUTER_API_KEY="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"
export OPENAI_API_KEY="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"

# Configure OpenRouter endpoint
export OPENAI_BASE_URL="https://openrouter.ai/api/v1"
export OPENAI_MODEL="openrouter/horizon-beta"

# Optional: Set additional OpenRouter headers for better tracking
export OPENROUTER_HTTP_REFERER="https://github.com/albeorla-ts-starter"
export OPENROUTER_TITLE="Qwen CLI - Horizon Beta"

echo "✅ Environment variables configured:"
echo "   - OPENAI_BASE_URL: $OPENAI_BASE_URL"
echo "   - OPENAI_MODEL: $OPENAI_MODEL"
echo "   - API Key: ${OPENAI_API_KEY:0:20}..."

echo ""
echo "🚀 Ready to use Qwen CLI with OpenRouter Horizon Beta!"
echo "   Example: qwen -m 'openrouter/horizon-beta' -p 'Your prompt here'"
echo ""
echo "📊 Available Qwen models on OpenRouter:"
echo "   - openrouter/horizon-beta (free during testing)"
echo "   - qwen/qwen3-30b-a3b-04-28"
echo "   - qwen/qwen3-14b"
echo "   - qwen/qwen3-4b"
echo "   - qwen/qwen3-0.6b-04-28" 