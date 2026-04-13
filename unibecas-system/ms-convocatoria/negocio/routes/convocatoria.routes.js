const controller = require('../controllers/convocatoria.controller');

const convocatoriaRoutes = (req, res) => {
    const url = req.url;
    const method = req.method;

    // GET /convocatorias
    if (url === '/convocatorias' && method === 'GET') {
        controller.getAll(req, res);
    }
    // GET /convocatorias/:id
    else if (url.match(/^\/convocatorias\/\d+$/) && method === 'GET') {
        const id = url.split('/')[2];
        controller.getById(req, res, id);
    }
    // POST /convocatorias
    else if (url === '/convocatorias' && method === 'POST') {
        controller.create(req, res);
    }
    // PUT /convocatorias/:id
    else if (url.match(/^\/convocatorias\/\d+$/) && method === 'PUT') {
        const id = url.split('/')[2];
        controller.update(req, res, id);
    }
    // DELETE /convocatorias/:id
    else if (url.match(/^\/convocatorias\/\d+$/) && method === 'DELETE') {
        const id = url.split('/')[2];
        controller.remove(req, res, id);
    }
    // Not found
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Ruta no encontrada' }));
    }
};

module.exports = convocatoriaRoutes;
