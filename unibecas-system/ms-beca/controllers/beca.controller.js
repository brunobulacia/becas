const pool = require("../db");

const getAll = async () => {
  const result = await pool.query(
    "SELECT b.*, tb.NOMBRE AS tipo_nombre FROM BECA b JOIN TIPO_BECA tb ON b.ID_TIPOB = tb.ID",
  );
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query("SELECT * FROM BECA WHERE ID = $1", [id]);
  return result.rows[0];
};

const create = async (data) => {
  const { nombre, descripcion, porcentaje, activo, id_tipob } = data;
  const result = await pool.query(
    "INSERT INTO BECA (NOMBRE, DESCRIPCION, PORCENTAJE, ACTIVO, ID_TIPOB) VALUES ($1, $2, $3, $4, $5) RETURNING ID",
    [nombre, descripcion, porcentaje, activo, id_tipob],
  );
  return {
    id: result.rows[0].id,
    nombre,
    descripcion,
    porcentaje,
    activo,
    id_tipob,
  };
};

const update = async (id, data) => {
  const { nombre, descripcion, porcentaje, activo, id_tipob } = data;
  await pool.query(
    "UPDATE BECA SET NOMBRE = $1, DESCRIPCION = $2, PORCENTAJE = $3, ACTIVO = $4, ID_TIPOB = $5 WHERE ID = $6",
    [nombre, descripcion, porcentaje, activo, id_tipob, id],
  );
  return { id, nombre, descripcion, porcentaje, activo, id_tipob };
};

const remove = async (id) => {
  await pool.query("DELETE FROM BECA WHERE ID = $1", [id]);
  return { id };
};

module.exports = { getAll, getById, create, update, remove };
