const http = require('http');
const asignacionRoutes = require('./routes/asignacion.routes');

const PORT = 3006;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    asignacionRoutes(req, res);
});

server.listen(PORT, () => {
    console.log(`ms-asignacion corriendo en el puerto ${PORT}`);
});
