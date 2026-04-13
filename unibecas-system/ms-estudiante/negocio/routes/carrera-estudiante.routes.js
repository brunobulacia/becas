const controller = require('../controllers/carrera-estudiante.controller');

const carreraEstudianteRoutes = (req, res) => {
    const url = req.url;
    const method = req.method;

    // GET /estudiantes/:id/carreras
    if (url.match(/^\/estudiantes\/\d+\/carreras$/) && method === 'GET') {
        const id = url.split('/')[2];
        controller.getCarreras(req, res, id);
    }
    // POST /estudiantes/:id/carreras
    else if (url.match(/^\/estudiantes\/\d+\/carreras$/) && method === 'POST') {
        const id = url.split('/')[2];
        controller.enrollCarrera(req, res, id);
    }
    // DELETE /estudiantes/:id/carreras/:id_carrera
    else if (url.match(/^\/estudiantes\/\d+\/carreras\/\d+$/) && method === 'DELETE') {
        const id = url.split('/')[2];
        const id_carrera = url.split('/')[4];
        controller.unenrollCarrera(req, res, id, id_carrera);
    }
    // Not found
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Ruta no encontrada' }));
    }
};

module.exports = carreraEstudianteRoutes;
