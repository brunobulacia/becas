const http = require('http');
const { proxyRequest } = require('./gateway');

const PORT = 3000;

const server = http.createServer((req, res) => {
  proxyRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`API Gateway ejecutandose en http://localhost:${PORT}`);
});
