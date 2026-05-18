# Vesper FileServer

Password-protected file browser for the Vesper workspace.

## Setup on Railway

1. Connect this repo to a Railway service
2. Add a shared volume mounted at `/data`
3. Set environment variables:
   - `FS_USERNAME` — your username (default: pogo)
   - `FS_PASSWORD` — your password
   - `SERVE_PATH` — path to serve (default: /data/workspace)

Railway will auto-assign the `PORT` variable.
