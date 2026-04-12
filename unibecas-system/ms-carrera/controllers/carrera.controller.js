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
    const result = await pool.query(
      "SELECT c.*, f.NOMBRE AS facultad_nombre FROM CARRERA c JOIN FACULTAD f ON c.ID_FACULTAD = f.ID",
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: result.rows,
        message: "Carreras obtenidas correctamente",
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
      "SELECT c.*, f.NOMBRE AS facultad_nombre FROM CARRERA c JOIN FACULTAD f ON c.ID_FACULTAD = f.ID WHERE c.ID = $1",
      [id],
    );
    if (result.rows.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Carrera no encontrada",
        }),
      );
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: result.rows[0],
        message: "Carrera obtenida correctamente",
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
    const nombre = body.nombre || body.NOMBRE;
    const id_facultad =
      body.facultad_id || body.id_facultad || body.ID_FACULTAD;
    const result = await pool.query(
      "INSERT INTO CARRERA (NOMBRE, ID_FACULTAD) VALUES ($1, $2) RETURNING ID",
      [nombre, id_facultad],
    );
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: { id: result.rows[0].id, nombre, id_facultad },
        message: "Carrera creada correctamente",
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
    const nombre = body.nombre || body.NOMBRE;
    const id_facultad =
      body.facultad_id || body.id_facultad || body.ID_FACULTAD;
    const result = await pool.query(
      "UPDATE CARRERA SET NOMBRE = $1, ID_FACULTAD = $2 WHERE ID = $3",
      [nombre, id_facultad, id],
    );
    if (result.rowCount === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Carrera no encontrada",
        }),
      );
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: { id: parseInt(id), nombre, id_facultad },
        message: "Carrera actualizada correctamente",
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
    const result = await pool.query("DELETE FROM CARRERA WHERE ID = $1", [id]);
    if (result.rowCount === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Carrera no encontrada",
        }),
      );
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: [],
        message: "Carrera eliminada correctamente",
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
