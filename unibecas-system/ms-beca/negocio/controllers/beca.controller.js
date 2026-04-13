const BecaModel = require("../../datos/models/beca.model");

const getAll = async () => {
  return await BecaModel.getBecas();
};

const getById = async (id) => {
  return await BecaModel.getBecaById(id);
};

const create = async (data) => {
  const { nombre, descripcion, porcentaje, activo, id_tipob } = data;
  const id = await BecaModel.createBeca({
    nombre,
    descripcion,
    porcentaje,
    activo,
    id_tipob,
  });
  return { id, nombre, descripcion, porcentaje, activo, id_tipob };
};

const update = async (id, data) => {
  const { nombre, descripcion, porcentaje, activo, id_tipob } = data;
  await BecaModel.updateBeca(id, {
    nombre,
    descripcion,
    porcentaje,
    activo,
    id_tipob,
  });
  return { id, nombre, descripcion, porcentaje, activo, id_tipob };
};

const remove = async (id) => {
  await BecaModel.deleteBeca(id);
  return { id };
};

module.exports = { getAll, getById, create, update, remove };
