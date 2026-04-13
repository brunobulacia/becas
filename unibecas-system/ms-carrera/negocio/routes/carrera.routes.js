const controller = require('../controllers/carrera.controller');

const carreraRoutes = (req, res) => {
    const url = req.url;
    const method = req.method;

    // GET /carreras
    if (url === '/carreras' && method === 'GET') {
        controller.getAll(req, res);
    }
    // GET /carreras/:id
    else if (url.match(/^\/carreras\/\d+$/) && method === 'GET') {
        const id = url.split('/')[2];
        controller.getById(req, res, id);
    }
    // POST /carreras
    else if (url === '/carreras' && method === 'POST') {
        controller.create(req, res);
    }
    // PUT /carreras/:id
    else if (url.match(/^\/carreras\/\d+$/) && method === 'PUT') {
        const id = url.split('/')[2];
        controller.update(req, res, id);
    }
    // DELETE /carreras/:id
    else if (url.match(/^\/carreras\/\d+$/) && method === 'DELETE') {
        const id = url.split('/')[2];
        controller.remove(req, res, id);
    }
    // Not found
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Ruta no encontrada' }));
    }
};

module.exports = carreraRoutes;
