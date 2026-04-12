const pool = require("../db");

const getAll = async () => {
  const result = await pool.query("SELECT * FROM TIPO_BECA");
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query("SELECT * FROM TIPO_BECA WHERE ID = $1", [
    id,
  ]);
  return result.rows[0];
};

const create = async (data) => {
  const { nombre } = data;
  const result = await pool.query(
    "INSERT INTO TIPO_BECA (NOMBRE) VALUES ($1) RETURNING ID",
    [nombre],
  );
  return { id: result.rows[0].id, nombre };
};

const update = async (id, data) => {
  const { nombre } = data;
  await pool.query("UPDATE TIPO_BECA SET NOMBRE = $1 WHERE ID = $2", [
    nombre,
    id,
  ]);
  return { id, nombre };
};

const remove = async (id) => {
  await pool.query("DELETE FROM TIPO_BECA WHERE ID = $1", [id]);
  return { id };
};

module.exports = { getAll, getById, create, update, remove };
