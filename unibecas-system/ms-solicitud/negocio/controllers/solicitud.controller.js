const http = require("http");
const SolicitudModel = require("../../datos/models/solicitud.model");

// Helper para hacer peticiones HTTP al microservicio de estudiantes
function fetchEstudiante(id) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:3003/estudiantes/${id}`, (res) => {
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

// Helper para obtener múltiples estudiantes en paralelo
async function enrichWithEstudiantes(solicitudes) {
  const uniqueIds = [...new Set(solicitudes.map((s) => s.id_estudiante))];
  const estudiantesMap = {};

  await Promise.all(
    uniqueIds.map(async (id) => {
      const est = await fetchEstudiante(id);
      if (est) {
        estudiantesMap[id] = est;
      }
    }),
  );

  return solicitudes.map((s) => {
    const est = estudiantesMap[s.id_estudiante];
    return {
      ...s,
      estudiante_nombre: est ? `${est.nombre} ${est.apellido}` : "Desconocido",
      estudiante_codigo: est ? est.codigop : null,
    };
  });
}

const getAll = async (req, res) => {
  try {
    const solicitudes = await SolicitudModel.getSolicitudes();
    const enriched = await enrichWithEstudiantes(solicitudes);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: enriched,
        message: "Solicitudes obtenidas correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        data: null,
        message: "Error al obtener solicitudes: " + error.message,
      }),
    );
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await SolicitudModel.getSolicitudById(id);

    if (!solicitud) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          success: false,
          data: null,
          message: "Solicitud no encontrada",
        }),
      );
    }

    const enriched = await enrichWithEstudiantes([solicitud]);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: enriched[0],
        message: "Solicitud obtenida correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        data: null,
        message: "Error al obtener solicitud: " + error.message,
      }),
    );
  }
};

const create = async (req, res) => {
  try {
    const { fecha_solicitud, observaciones, id_estudiante, id_convocatoria } =
      req.body;

    // Validar que el estudiante existe via API del ms-estudiante
    const estudiante = await fetchEstudiante(id_estudiante);
    if (!estudiante) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          success: false,
          data: null,
          message:
            "El estudiante no existe o el servicio de estudiantes no está disponible",
        }),
      );
    }

    const id = await SolicitudModel.createSolicitud({
      fecha_solicitud,
      estado: "PENDIENTE",
      observaciones,
      id_estudiante,
      id_convocatoria,
    });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: {
          id,
          fecha_solicitud,
          estado: "PENDIENTE",
          observaciones,
          id_estudiante,
          id_convocatoria,
        },
        message: "Solicitud creada correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        data: null,
        message: "Error al crear solicitud: " + error.message,
      }),
    );
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body;

    const updated = await SolicitudModel.updateSolicitud(id, {
      estado,
      observaciones,
    });

    if (!updated) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          success: false,
          data: null,
          message: "Solicitud no encontrada",
        }),
      );
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: { id, estado, observaciones },
        message: "Solicitud actualizada correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        data: null,
        message: "Error al actualizar solicitud: " + error.message,
      }),
    );
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SolicitudModel.deleteSolicitud(id);

    if (!deleted) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          success: false,
          data: null,
          message: "Solicitud no encontrada",
        }),
      );
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: null,
        message: "Solicitud eliminada correctamente",
      }),
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        data: null,
        message: "Error al eliminar solicitud: " + error.message,
      }),
    );
  }
};

module.exports = { getAll, getById, create, update, remove };
