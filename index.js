const http = require('http');
const path = require('path');
const fs = require('fs');
const serveIndex = require('serve-index');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const USERNAME = process.env.FS_USERNAME || 'pogo';
const PASSWORD = process.env.FS_PASSWORD || 'Vesper!sTheB3st';
const PORT = process.env.PORT || 3000;
const SERVE_PATH = process.env.SERVE_PATH || '/data/workspace';

const staticMiddleware = serveStatic(SERVE_PATH, { index: false });
const indexMiddleware = serveIndex(SERVE_PATH, {
  icons: true,
  view: 'details'
});

function checkAuth(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic ')) return false;
  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
  const [user, pass] = decoded.split(':');
  return user === USERNAME && pass === PASSWORD;
}

const server = http.createServer((req, res) => {
  if (!checkAuth(req)) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="Vesper Workspace"',
      'Content-Type': 'text/plain'
    });
    res.end('Authentication required');
    return;
  }

  const done = finalhandler(req, res);
  staticMiddleware(req, res, () => {
    indexMiddleware(req, res, done);
  });
});

server.listen(PORT, () => {
  console.log(`Vesper FileServer running on port ${PORT}`);
  console.log(`Serving: ${SERVE_PATH}`);
});
