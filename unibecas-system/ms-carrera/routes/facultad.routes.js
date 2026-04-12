const controller = require('../controllers/facultad.controller');

const facultadRoutes = (req, res) => {
    const url = req.url;
    const method = req.method;

    // GET /facultades
    if (url === '/facultades' && method === 'GET') {
        controller.getAll(req, res);
    }
    // GET /facultades/:id
    else if (url.match(/^\/facultades\/\d+$/) && method === 'GET') {
        const id = url.split('/')[2];
        controller.getById(req, res, id);
    }
    // POST /facultades
    else if (url === '/facultades' && method === 'POST') {
        controller.create(req, res);
    }
    // PUT /facultades/:id
    else if (url.match(/^\/facultades\/\d+$/) && method === 'PUT') {
        const id = url.split('/')[2];
        controller.update(req, res, id);
    }
    // DELETE /facultades/:id
    else if (url.match(/^\/facultades\/\d+$/) && method === 'DELETE') {
        const id = url.split('/')[2];
        controller.remove(req, res, id);
    }
    // Not found
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Ruta no encontrada' }));
    }
};

module.exports = facultadRoutes;
