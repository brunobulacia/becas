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

const getAll = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT e.*, STRING_AGG(c.NOMBRE, ', ') AS carreras
            FROM ESTUDIANTE e
            LEFT JOIN CARRERA_ESTUDIANTE ce ON e.ID = ce.ID_ESTUDIANTE
            LEFT JOIN CARRERA c ON ce.ID_CARRERA = c.ID
            GROUP BY e.ID
        `);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: result.rows,
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
    const result = await pool.query(
      `
            SELECT e.*, STRING_AGG(c.NOMBRE, ', ') AS carreras
            FROM ESTUDIANTE e
            LEFT JOIN CARRERA_ESTUDIANTE ce ON e.ID = ce.ID_ESTUDIANTE
            LEFT JOIN CARRERA c ON ce.ID_CARRERA = c.ID
            WHERE e.ID = $1
            GROUP BY e.ID
        `,
      [id],
    );
    if (result.rows.length === 0) {
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
        data: result.rows[0],
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
    const result = await pool.query(
      "INSERT INTO ESTUDIANTE (CODIGOP, NOMBRE, APELLIDO, EMAIL, PPA, ACTIVO) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID",
      [codigop, nombre, apellido, email, ppa, activo],
    );
    const estudianteId = result.rows[0].id;

    // Si se envian carreras, insertar en CARRERA_ESTUDIANTE
    if (carreras && Array.isArray(carreras) && carreras.length > 0) {
      for (const carrera of carreras) {
        await pool.query(
          "INSERT INTO CARRERA_ESTUDIANTE (ID_ESTUDIANTE, ID_CARRERA, FECHA_INSCRIPCION) VALUES ($1, $2, $3)",
          [estudianteId, carrera.id_carrera, carrera.fecha_inscripcion],
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
    const result = await pool.query(
      "UPDATE ESTUDIANTE SET CODIGOP = $1, NOMBRE = $2, APELLIDO = $3, EMAIL = $4, PPA = $5, ACTIVO = $6 WHERE ID = $7",
      [codigop, nombre, apellido, email, ppa, activo, id],
    );
    if (result.rowCount === 0) {
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
    const result = await pool.query("DELETE FROM ESTUDIANTE WHERE ID = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
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
