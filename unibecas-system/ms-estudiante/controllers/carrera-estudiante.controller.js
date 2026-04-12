const pool = require("../db");

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
    const result = await pool.query(
      `
            SELECT ce.*, c.NOMBRE AS carrera_nombre
            FROM CARRERA_ESTUDIANTE ce
            INNER JOIN CARRERA c ON ce.ID_CARRERA = c.ID
            WHERE ce.ID_ESTUDIANTE = $1
        `,
      [id_estudiante],
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: result.rows,
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
    await pool.query(
      "INSERT INTO CARRERA_ESTUDIANTE (ID_ESTUDIANTE, ID_CARRERA, FECHA_INSCRIPCION) VALUES ($1, $2, $3)",
      [id_estudiante, id_carrera, fecha_inscripcion],
    );
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
    const result = await pool.query(
      "DELETE FROM CARRERA_ESTUDIANTE WHERE ID_ESTUDIANTE = $1 AND ID_CARRERA = $2",
      [id_estudiante, id_carrera],
    );
    if (result.rowCount === 0) {
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
