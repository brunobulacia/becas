const controller = require('../controllers/solicitud.controller');

const getBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', (err) => {
            reject(err);
        });
    });
};

const solicitudRoutes = async (req, res) => {
    const url = req.url;
    const method = req.method;

    // GET /solicitudes
    if (url === '/solicitudes' && method === 'GET') {
        return await controller.getAll(req, res);
    }

    // GET /solicitudes/:id
    const getMatch = url.match(/^\/solicitudes\/(\d+)$/);
    if (getMatch && method === 'GET') {
        req.params = { id: getMatch[1] };
        return await controller.getById(req, res);
    }

    // POST /solicitudes
    if (url === '/solicitudes' && method === 'POST') {
        try {
            req.body = await getBody(req);
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, data: null, message: 'JSON inválido' }));
        }
        return await controller.create(req, res);
    }

    // PUT /solicitudes/:id
    const putMatch = url.match(/^\/solicitudes\/(\d+)$/);
    if (putMatch && method === 'PUT') {
        req.params = { id: putMatch[1] };
        try {
            req.body = await getBody(req);
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, data: null, message: 'JSON inválido' }));
        }
        return await controller.update(req, res);
    }

    // DELETE /solicitudes/:id
    const deleteMatch = url.match(/^\/solicitudes\/(\d+)$/);
    if (deleteMatch && method === 'DELETE') {
        req.params = { id: deleteMatch[1] };
        return await controller.remove(req, res);
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, data: null, message: 'Ruta no encontrada' }));
};

module.exports = solicitudRoutes;
