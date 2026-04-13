const controller = require('../controllers/beca.controller');

const getBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(e);
            }
        });
    });
};

const becaRoutes = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const urlParts = req.url.split('/');
    const id = urlParts[2];

    try {
        // GET /becas
        if (req.method === 'GET' && !id) {
            const data = await controller.getAll();
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data, message: 'Becas obtenidas correctamente' }));
        }
        // GET /becas/:id
        else if (req.method === 'GET' && id) {
            const data = await controller.getById(id);
            if (!data) {
                res.writeHead(404);
                res.end(JSON.stringify({ success: false, data: null, message: 'Beca no encontrada' }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data, message: 'Beca obtenida correctamente' }));
        }
        // POST /becas
        else if (req.method === 'POST') {
            const body = await getBody(req);
            const data = await controller.create(body);
            res.writeHead(201);
            res.end(JSON.stringify({ success: true, data, message: 'Beca creada correctamente' }));
        }
        // PUT /becas/:id
        else if (req.method === 'PUT' && id) {
            const body = await getBody(req);
            const data = await controller.update(id, body);
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data, message: 'Beca actualizada correctamente' }));
        }
        // DELETE /becas/:id
        else if (req.method === 'DELETE' && id) {
            const data = await controller.remove(id);
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data, message: 'Beca eliminada correctamente' }));
        }
        else {
            res.writeHead(405);
            res.end(JSON.stringify({ success: false, message: 'Método no permitido' }));
        }
    } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: 'Error en el servidor: ' + error.message }));
    }
};

module.exports = becaRoutes;
