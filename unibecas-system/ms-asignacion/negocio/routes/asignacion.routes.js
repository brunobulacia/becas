const controller = require('../controllers/asignacion.controller');
const url = require('url');

const routes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // GET /asignaciones
    if (path === '/asignaciones' && method === 'GET') {
        return controller.getAll(req, res);
    }

    // GET /asignaciones/:id
    const matchGet = path.match(/^\/asignaciones\/(\d+)$/);
    if (matchGet && method === 'GET') {
        req.params = { id: matchGet[1] };
        return controller.getById(req, res);
    }

    // POST /asignaciones
    if (path === '/asignaciones' && method === 'POST') {
        return controller.create(req, res);
    }

    // PUT /asignaciones/:id
    const matchPut = path.match(/^\/asignaciones\/(\d+)$/);
    if (matchPut && method === 'PUT') {
        req.params = { id: matchPut[1] };
        return controller.update(req, res);
    }

    // DELETE /asignaciones/:id
    const matchDelete = path.match(/^\/asignaciones\/(\d+)$/);
    if (matchDelete && method === 'DELETE') {
        req.params = { id: matchDelete[1] };
        return controller.remove(req, res);
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Ruta no encontrada' }));
};

module.exports = routes;
