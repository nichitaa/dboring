#!/bin/bash
# Docker entrypoint script for Phoenix Gateway application.

echo "[Phoenix-Gateway] Inside entrypoint.sh script"

# Start phoenix server
exec mix phx.server
