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
    // Obtener convocatorias con cupos disponibles calculados
    const result = await pool.query(`
      SELECT co.*, 
             b.NOMBRE AS beca_nombre,
             co.CUPOS - COALESCE(
               (SELECT COUNT(*) FROM SOLICITUD s 
                WHERE s.ID_CONVOCATORIA = co.ID 
                AND s.ESTADO IN ('PENDIENTE', 'APROBADA')), 0
             ) AS cupos_disponibles
      FROM CONVOCATORIA co 
      JOIN BECA b ON co.ID_BECA = b.ID
    `);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: result.rows,
        message: "Convocatorias obtenidas correctamente",
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
      "SELECT co.*, b.NOMBRE AS beca_nombre FROM CONVOCATORIA co JOIN BECA b ON co.ID_BECA = b.ID WHERE co.ID = $1",
      [id],
    );
    if (result.rows.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Convocatoria no encontrada",
        }),
      );
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: result.rows[0],
        message: "Convocatoria obtenida correctamente",
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
    const { descripcion, periodo, fecha_inicio, fecha_fin, cupos, id_beca } =
      body;
    const result = await pool.query(
      "INSERT INTO CONVOCATORIA (DESCRIPCION, PERIODO, FECHA_INICIO, FECHA_FIN, CUPOS, ID_BECA) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID",
      [descripcion, periodo, fecha_inicio, fecha_fin, cupos, id_beca],
    );
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: {
          ID: result.rows[0].id,
          descripcion,
          periodo,
          fecha_inicio,
          fecha_fin,
          cupos,
          id_beca,
        },
        message: "Convocatoria creada correctamente",
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
    const { descripcion, periodo, fecha_inicio, fecha_fin, cupos, id_beca } =
      body;
    const result = await pool.query(
      "UPDATE CONVOCATORIA SET DESCRIPCION = $1, PERIODO = $2, FECHA_INICIO = $3, FECHA_FIN = $4, CUPOS = $5, ID_BECA = $6 WHERE ID = $7",
      [descripcion, periodo, fecha_inicio, fecha_fin, cupos, id_beca, id],
    );
    if (result.rowCount === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Convocatoria no encontrada",
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
          descripcion,
          periodo,
          fecha_inicio,
          fecha_fin,
          cupos,
          id_beca,
        },
        message: "Convocatoria actualizada correctamente",
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
    const result = await pool.query("DELETE FROM CONVOCATORIA WHERE ID = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Convocatoria no encontrada",
        }),
      );
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: [],
        message: "Convocatoria eliminada correctamente",
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
