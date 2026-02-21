#!/bin/bash
# Wrapper script to call gemini cli
# Usage: ./consult.sh "your question"

QUERY="$1"
if [ -z "$QUERY" ]; then
  echo "Error: No query provided."
  exit 1
fi

gemini "$QUERY"
