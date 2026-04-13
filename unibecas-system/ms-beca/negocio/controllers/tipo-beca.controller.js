const TipoBecaModel = require("../../datos/models/tipo-beca.model");

const getAll = async () => {
  return await TipoBecaModel.getTiposBeca();
};

const getById = async (id) => {
  return await TipoBecaModel.getTipoBecaById(id);
};

const create = async (data) => {
  const { nombre } = data;
  const id = await TipoBecaModel.createTipoBeca({ nombre });
  return { id, nombre };
};

const update = async (id, data) => {
  const { nombre } = data;
  await TipoBecaModel.updateTipoBeca(id, { nombre });
  return { id, nombre };
};

const remove = async (id) => {
  await TipoBecaModel.deleteTipoBeca(id);
  return { id };
};

module.exports = { getAll, getById, create, update, remove };
