const controller = require('../controllers/tipo-beca.controller');

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

const tipoBecaRoutes = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const urlParts = req.url.split('/');
    const id = urlParts[2];

    try {
        // GET /tipos-beca
        if (req.method === 'GET' && !id) {
            const data = await controller.getAll();
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data, message: 'Tipos de beca obtenidos correctamente' }));
        }
        // GET /tipos-beca/:id
        else if (req.method === 'GET' && id) {
            const data = await controller.getById(id);
            if (!data) {
                res.writeHead(404);
                res.end(JSON.stringify({ success: false, data: null, message: 'Tipo de beca no encontrado' }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data, message: 'Tipo de beca obtenido correctamente' }));
        }
        // POST /tipos-beca
        else if (req.method === 'POST') {
            const body = await getBody(req);
            const data = await controller.create(body);
            res.writeHead(201);
            res.end(JSON.stringify({ success: true, data, message: 'Tipo de beca creado correctamente' }));
        }
        // PUT /tipos-beca/:id
        else if (req.method === 'PUT' && id) {
            const body = await getBody(req);
            const data = await controller.update(id, body);
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data, message: 'Tipo de beca actualizado correctamente' }));
        }
        // DELETE /tipos-beca/:id
        else if (req.method === 'DELETE' && id) {
            const data = await controller.remove(id);
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data, message: 'Tipo de beca eliminado correctamente' }));
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

module.exports = tipoBecaRoutes;
