/**
 * FacultadController - Capa de Negocio
 * Maneja la lógica de negocio y las respuestas HTTP para FACULTAD
 *
 * Usa instancia de: FacultadModel
 *
 * Métodos:
 * + getFacultades()
 * + getFacultad(id)
 * + createFacultad()
 * + updateFacultad(id)
 * + deleteFacultad(id)
 */

const FacultadModel = require("../../datos/models/facultad.model");

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
 * GET /facultades - Obtiene todas las facultades
 */
const getAll = async (req, res) => {
  try {
    const facultades = await FacultadModel.getFacultades();
    sendResponse(
      res,
      200,
      true,
      facultades,
      "Facultades obtenidas correctamente",
    );
  } catch (error) {
    sendResponse(res, 500, false, [], error.message);
  }
};

/**
 * GET /facultades/:id - Obtiene una facultad por ID
 */
const getById = async (req, res, id) => {
  try {
    const facultad = await FacultadModel.getFacultadById(id);
    if (!facultad) {
      sendResponse(res, 404, false, null, "Facultad no encontrada");
      return;
    }
    sendResponse(res, 200, true, facultad, "Facultad obtenida correctamente");
  } catch (error) {
    sendResponse(res, 500, false, null, error.message);
  }
};

/**
 * POST /facultades - Crea una nueva facultad
 */
const create = async (req, res) => {
  try {
    const body = await getBody(req);
    const nombre = body.nombre || body.NOMBRE;

    if (!nombre) {
      sendResponse(res, 400, false, null, "El nombre es requerido");
      return;
    }

    const facultad = await FacultadModel.createFacultad({ nombre });
    sendResponse(res, 201, true, facultad, "Facultad creada correctamente");
  } catch (error) {
    sendResponse(res, 500, false, null, error.message);
  }
};

/**
 * PUT /facultades/:id - Actualiza una facultad
 */
const update = async (req, res, id) => {
  try {
    const body = await getBody(req);
    const nombre = body.nombre || body.NOMBRE;

    if (!nombre) {
      sendResponse(res, 400, false, null, "El nombre es requerido");
      return;
    }

    const facultad = await FacultadModel.updateFacultad(id, { nombre });
    if (!facultad) {
      sendResponse(res, 404, false, null, "Facultad no encontrada");
      return;
    }
    sendResponse(
      res,
      200,
      true,
      facultad,
      "Facultad actualizada correctamente",
    );
  } catch (error) {
    sendResponse(res, 500, false, null, error.message);
  }
};

/**
 * DELETE /facultades/:id - Elimina una facultad
 */
const remove = async (req, res, id) => {
  try {
    const deleted = await FacultadModel.deleteFacultad(id);
    if (!deleted) {
      sendResponse(res, 404, false, null, "Facultad no encontrada");
      return;
    }
    sendResponse(res, 200, true, null, "Facultad eliminada correctamente");
  } catch (error) {
    sendResponse(res, 500, false, null, error.message);
  }
};

module.exports = { getAll, getById, create, update, remove };
