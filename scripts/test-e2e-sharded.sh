#!/bin/bash
# Run E2E tests with sharding locally (similar to CI)

set -euo pipefail

TOTAL_SHARDS=${1:-3}
PARALLEL=${2:-true}

echo "🎭 Running E2E tests with $TOTAL_SHARDS shards..."

if [ "$PARALLEL" = "true" ]; then
    echo "Running shards in parallel..."
    
    # Run all shards in parallel
    for shard in $(seq 1 $TOTAL_SHARDS); do
        echo "Starting shard $shard/$TOTAL_SHARDS..."
        PLAYWRIGHT_SHARD=$shard/$TOTAL_SHARDS yarn test:e2e &
    done
    
    # Wait for all background jobs
    wait
    
    echo "✅ All shards completed!"
else
    echo "Running shards sequentially..."
    
    # Run shards one by one
    for shard in $(seq 1 $TOTAL_SHARDS); do
        echo "Running shard $shard/$TOTAL_SHARDS..."
        PLAYWRIGHT_SHARD=$shard/$TOTAL_SHARDS yarn test:e2e
    done
fi

echo "🎉 E2E test run complete!"