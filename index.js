const http = require('http');

const USERNAME = process.env.FS_USERNAME || 'pogo';
const PASSWORD = process.env.FS_PASSWORD || 'Vesper!sTheB3st';
const PORT = process.env.PORT || 3000;
const BACKEND_HOST = process.env.BACKEND_HOST || 'openclaw-main.railway.internal';
const BACKEND_PORT = process.env.BACKEND_PORT || 9000;

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

  const options = {
    hostname: BACKEND_HOST,
    port: BACKEND_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxy = http.request(options, (backendRes) => {
    res.writeHead(backendRes.statusCode, backendRes.headers);
    backendRes.pipe(res);
  });

  proxy.on('error', (err) => {
    res.writeHead(502);
    res.end(`Backend unavailable: ${err.message}\nMake sure fileserver is running inside Vesper on port ${BACKEND_PORT}`);
  });

  req.pipe(proxy);
});

server.listen(PORT, () => {
  console.log(`Vesper FileServer proxy on port ${PORT}`);
  console.log(`Proxying to ${BACKEND_HOST}:${BACKEND_PORT}`);
});
