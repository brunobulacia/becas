const http = require("http");
const pool = require("../db");

// Helper para parsear el body de las peticiones POST/PUT
const getBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", (error) => {
      reject(error);
    });
  });
};

// Helper para hacer peticiones HTTP a otros microservicios
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.success ? parsed.data : null);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
  });
}

// Enriquecer asignaciones con datos de estudiante (desde ms-estudiante via HTTP)
async function enrichAsignaciones(asignaciones, solicitudesMap) {
  const uniqueEstudianteIds = [
    ...new Set(
      Object.values(solicitudesMap)
        .filter((s) => s)
        .map((s) => s.id_estudiante),
    ),
  ];

  const estudiantesMap = {};
  await Promise.all(
    uniqueEstudianteIds.map(async (id) => {
      const est = await fetchJSON(`http://localhost:3003/estudiantes/${id}`);
      if (est) estudiantesMap[id] = est;
    }),
  );

  return asignaciones.map((a) => {
    const sol = solicitudesMap[a.id_solicitud];
    const est = sol ? estudiantesMap[sol.id_estudiante] : null;
    return {
      ...a,
      estudiante_nombre: est ? `${est.nombre} ${est.apellido}` : "Desconocido",
      beca_nombre: a.beca_nombre || null,
      convocatoria_periodo: a.convocatoria_periodo || null,
    };
  });
}

// GET /asignaciones
const getAll = async (req, res) => {
  try {
    // JOIN solo con tablas locales (bd_postulacion)
    const result = await pool.query(`
            SELECT a.*,
                b.NOMBRE AS beca_nombre,
                co.PERIODO AS convocatoria_periodo,
                s.ID_ESTUDIANTE
            FROM ASIGNACION a
            JOIN SOLICITUD s ON a.ID_SOLICITUD = s.ID
            JOIN CONVOCATORIA co ON s.ID_CONVOCATORIA = co.ID
            JOIN BECA b ON co.ID_BECA = b.ID
        `);

    // Obtener datos de estudiantes via HTTP
    const solicitudesMap = {};
    result.rows.forEach((r) => {
      solicitudesMap[r.id_solicitud] = { id_estudiante: r.id_estudiante };
    });

    const enriched = await enrichAsignaciones(result.rows, solicitudesMap);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: enriched,
        message: "Asignaciones obtenidas correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        data: [],
        message: "Error al obtener asignaciones: " + error.message,
      }),
    );
  }
};

// GET /asignaciones/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
            SELECT a.*,
                b.NOMBRE AS beca_nombre,
                co.PERIODO AS convocatoria_periodo,
                s.ID_ESTUDIANTE
            FROM ASIGNACION a
            JOIN SOLICITUD s ON a.ID_SOLICITUD = s.ID
            JOIN CONVOCATORIA co ON s.ID_CONVOCATORIA = co.ID
            JOIN BECA b ON co.ID_BECA = b.ID
            WHERE a.ID = $1
        `,
      [id],
    );

    if (result.rows.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Asignacion no encontrada",
        }),
      );
      return;
    }

    const solicitudesMap = {};
    solicitudesMap[result.rows[0].id_solicitud] = {
      id_estudiante: result.rows[0].id_estudiante,
    };

    const enriched = await enrichAsignaciones(result.rows, solicitudesMap);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: enriched[0],
        message: "Asignacion obtenida correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        data: [],
        message: "Error al obtener asignacion: " + error.message,
      }),
    );
  }
};

// POST /asignaciones
const create = async (req, res) => {
  try {
    const body = await getBody(req);
    const { descripcion, periodo, fecha_inicio, fecha_fin, id_solicitud } =
      body;

    const result = await pool.query(
      "INSERT INTO ASIGNACION (DESCRIPCION, PERIODO, FECHA_INICIO, FECHA_FIN, ID_SOLICITUD) VALUES ($1, $2, $3, $4, $5) RETURNING ID",
      [descripcion, periodo, fecha_inicio, fecha_fin, id_solicitud],
    );

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: { id: result.rows[0].id, ...body },
        message: "Asignacion creada correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        data: [],
        message: "Error al crear asignacion: " + error.message,
      }),
    );
  }
};

// PUT /asignaciones/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const body = await getBody(req);
    const { descripcion, periodo, fecha_inicio, fecha_fin, id_solicitud } =
      body;

    const result = await pool.query(
      "UPDATE ASIGNACION SET DESCRIPCION = $1, PERIODO = $2, FECHA_INICIO = $3, FECHA_FIN = $4, ID_SOLICITUD = $5 WHERE ID = $6",
      [descripcion, periodo, fecha_inicio, fecha_fin, id_solicitud, id],
    );

    if (result.rowCount === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Asignacion no encontrada",
        }),
      );
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: { id, ...body },
        message: "Asignacion actualizada correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        data: [],
        message: "Error al actualizar asignacion: " + error.message,
      }),
    );
  }
};

// DELETE /asignaciones/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM ASIGNACION WHERE ID = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          data: [],
          message: "Asignacion no encontrada",
        }),
      );
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: [],
        message: "Asignacion eliminada correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        data: [],
        message: "Error al eliminar asignacion: " + error.message,
      }),
    );
  }
};

module.exports = { getAll, getById, create, update, remove };
