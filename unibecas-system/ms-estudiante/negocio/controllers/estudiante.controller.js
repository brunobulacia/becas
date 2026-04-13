const EstudianteModel = require("../../datos/models/estudiante.model");
const CarreraEstudianteModel = require("../../datos/models/carrera-estudiante.model");

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

const getAll = async (req, res) => {
  try {
    const estudiantes = await EstudianteModel.getEstudiantes();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: estudiantes,
        message: "Estudiantes obtenidos correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, data: [], message: error.message }),
    );
  }
};

const getById = async (req, res, id) => {
  try {
    const estudiante = await EstudianteModel.getEstudianteById(id);
    if (!estudiante) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Estudiante no encontrado",
        }),
      );
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: estudiante,
        message: "Estudiante obtenido correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, data: [], message: error.message }),
    );
  }
};

const create = async (req, res) => {
  try {
    const body = await getBody(req);
    const { codigop, nombre, apellido, email, ppa, activo, carreras } = body;

    const estudianteId = await EstudianteModel.createEstudiante({
      codigop,
      nombre,
      apellido,
      email,
      ppa,
      activo,
    });

    // Si se envian carreras, insertar en CARRERA_ESTUDIANTE
    if (carreras && Array.isArray(carreras) && carreras.length > 0) {
      for (const carrera of carreras) {
        await CarreraEstudianteModel.addCarreraToEstudiante(
          estudianteId,
          carrera.id_carrera,
          carrera.fecha_inscripcion,
        );
      }
    }

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: {
          ID: estudianteId,
          codigop,
          nombre,
          apellido,
          email,
          ppa,
          activo,
          carreras: carreras || [],
        },
        message: "Estudiante creado correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, data: [], message: error.message }),
    );
  }
};

const update = async (req, res, id) => {
  try {
    const body = await getBody(req);
    const { codigop, nombre, apellido, email, ppa, activo } = body;

    const updated = await EstudianteModel.updateEstudiante(id, {
      codigop,
      nombre,
      apellido,
      email,
      ppa,
      activo,
    });

    if (!updated) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Estudiante no encontrado",
        }),
      );
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: {
          ID: parseInt(id),
          codigop,
          nombre,
          apellido,
          email,
          ppa,
          activo,
        },
        message: "Estudiante actualizado correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, data: [], message: error.message }),
    );
  }
};

const remove = async (req, res, id) => {
  try {
    const deleted = await EstudianteModel.deleteEstudiante(id);
    if (!deleted) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Estudiante no encontrado",
        }),
      );
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: [],
        message: "Estudiante eliminado correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, data: [], message: error.message }),
    );
  }
};

module.exports = { getAll, getById, create, update, remove };
