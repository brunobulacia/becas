const ConvocatoriaModel = require("../../datos/models/convocatoria.model");

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
    const convocatorias = await ConvocatoriaModel.getConvocatorias();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: convocatorias,
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
    const convocatoria = await ConvocatoriaModel.getConvocatoriaById(id);
    if (!convocatoria) {
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
        data: convocatoria,
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

    const id = await ConvocatoriaModel.createConvocatoria({
      descripcion,
      periodo,
      fecha_inicio,
      fecha_fin,
      cupos,
      id_beca,
    });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: {
          ID: id,
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

    const updated = await ConvocatoriaModel.updateConvocatoria(id, {
      descripcion,
      periodo,
      fecha_inicio,
      fecha_fin,
      cupos,
      id_beca,
    });

    if (!updated) {
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
    const deleted = await ConvocatoriaModel.deleteConvocatoria(id);
    if (!deleted) {
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
