const controller = require('../controllers/estudiante.controller');

const estudianteRoutes = (req, res) => {
    const url = req.url;
    const method = req.method;

    // GET /estudiantes
    if (url === '/estudiantes' && method === 'GET') {
        controller.getAll(req, res);
    }
    // GET /estudiantes/:id
    else if (url.match(/^\/estudiantes\/\d+$/) && method === 'GET') {
        const id = url.split('/')[2];
        controller.getById(req, res, id);
    }
    // POST /estudiantes
    else if (url === '/estudiantes' && method === 'POST') {
        controller.create(req, res);
    }
    // PUT /estudiantes/:id
    else if (url.match(/^\/estudiantes\/\d+$/) && method === 'PUT') {
        const id = url.split('/')[2];
        controller.update(req, res, id);
    }
    // DELETE /estudiantes/:id
    else if (url.match(/^\/estudiantes\/\d+$/) && method === 'DELETE') {
        const id = url.split('/')[2];
        controller.remove(req, res, id);
    }
    // Not found
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Ruta no encontrada' }));
    }
};

module.exports = estudianteRoutes;
