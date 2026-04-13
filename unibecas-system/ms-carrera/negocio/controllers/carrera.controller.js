/**
 * CarreraController - Capa de Negocio
 * Maneja la lógica de negocio y las respuestas HTTP para CARRERA
 *
 * Usa instancia de: CarreraModel
 *
 * Métodos:
 * + getCarreras()
 * + getCarrera(id)
 * + createCarrera()
 * + updateCarrera(id)
 * + deleteCarrera(id)
 */

const CarreraModel = require("../../datos/models/carrera.model");

// Helper para parsear el body de las peticiones
const getBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
};

// Helper para enviar respuestas JSON
const sendResponse = (res, statusCode, success, data, message) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success, data, message }));
};

/**
 * GET /carreras - Obtiene todas las carreras
 */
const getAll = async (req, res) => {
  try {
    const carreras = await CarreraModel.getCarreras();
    sendResponse(res, 200, true, carreras, "Carreras obtenidas correctamente");
  } catch (error) {
    sendResponse(res, 500, false, [], error.message);
  }
};

/**
 * GET /carreras/:id - Obtiene una carrera por ID
 */
const getById = async (req, res, id) => {
  try {
    const carrera = await CarreraModel.getCarreraById(id);
    if (!carrera) {
      sendResponse(res, 404, false, null, "Carrera no encontrada");
      return;
    }
    sendResponse(res, 200, true, carrera, "Carrera obtenida correctamente");
  } catch (error) {
    sendResponse(res, 500, false, null, error.message);
  }
};

/**
 * POST /carreras - Crea una nueva carrera
 */
const create = async (req, res) => {
  try {
    const body = await getBody(req);
    const nombre = body.nombre || body.NOMBRE;
    const id_facultad =
      body.facultad_id || body.id_facultad || body.ID_FACULTAD;

    if (!nombre) {
      sendResponse(res, 400, false, null, "El nombre es requerido");
      return;
    }
    if (!id_facultad) {
      sendResponse(res, 400, false, null, "La facultad es requerida");
      return;
    }

    const carrera = await CarreraModel.createCarrera({ nombre, id_facultad });
    sendResponse(res, 201, true, carrera, "Carrera creada correctamente");
  } catch (error) {
    sendResponse(res, 500, false, null, error.message);
  }
};

/**
 * PUT /carreras/:id - Actualiza una carrera
 */
const update = async (req, res, id) => {
  try {
    const body = await getBody(req);
    const nombre = body.nombre || body.NOMBRE;
    const id_facultad =
      body.facultad_id || body.id_facultad || body.ID_FACULTAD;

    if (!nombre) {
      sendResponse(res, 400, false, null, "El nombre es requerido");
      return;
    }
    if (!id_facultad) {
      sendResponse(res, 400, false, null, "La facultad es requerida");
      return;
    }

    const carrera = await CarreraModel.updateCarrera(id, {
      nombre,
      id_facultad,
    });
    if (!carrera) {
      sendResponse(res, 404, false, null, "Carrera no encontrada");
      return;
    }
    sendResponse(res, 200, true, carrera, "Carrera actualizada correctamente");
  } catch (error) {
    sendResponse(res, 500, false, null, error.message);
  }
};

/**
 * DELETE /carreras/:id - Elimina una carrera
 */
const remove = async (req, res, id) => {
  try {
    const deleted = await CarreraModel.deleteCarrera(id);
    if (!deleted) {
      sendResponse(res, 404, false, null, "Carrera no encontrada");
      return;
    }
    sendResponse(res, 200, true, null, "Carrera eliminada correctamente");
  } catch (error) {
    sendResponse(res, 500, false, null, error.message);
  }
};

module.exports = { getAll, getById, create, update, remove };
