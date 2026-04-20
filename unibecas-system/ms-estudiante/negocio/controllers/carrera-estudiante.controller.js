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

const getCarreras = async (req, res, id_estudiante) => {
  try {
    const carreras =
      await CarreraEstudianteModel.getCarrerasByEstudiante(id_estudiante);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: carreras,
        message: "Carreras del estudiante obtenidas correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, data: [], message: error.message }),
    );
  }
};

const enrollCarrera = async (req, res, id_estudiante) => {
  try {
    const body = await getBody(req);
    const { id_carrera, fecha_inscripcion } = body;

    await CarreraEstudianteModel.createCarreraEstudiante({
      id_estudiante: parseInt(id_estudiante),
      id_carrera,
      fecha_inscripcion,
    });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: {
          ID_ESTUDIANTE: parseInt(id_estudiante),
          ID_CARRERA: id_carrera,
          FECHA_INSCRIPCION: fecha_inscripcion,
        },
        message: "Estudiante inscrito en carrera correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, data: [], message: error.message }),
    );
  }
};

const unenrollCarrera = async (req, res, id_estudiante, id_carrera) => {
  try {
    const carreras = await CarreraEstudianteModel.getCarrerasByEstudiante(id_estudiante);
    const relacion = carreras.find((c) => c.id_carrera === parseInt(id_carrera));

    if (!relacion) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Inscripcion no encontrada",
        }),
      );
      return;
    }
    await CarreraEstudianteModel.deleteCarreraEstudiante(id_estudiante, id_carrera);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: [],
        message: "Estudiante desinscrito de carrera correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, data: [], message: error.message }),
    );
  }
};

module.exports = { getCarreras, enrollCarrera, unenrollCarrera };
