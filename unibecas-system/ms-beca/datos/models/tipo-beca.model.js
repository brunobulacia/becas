/**
 * TipoBecaModel - Capa de Datos
 * Maneja todas las operaciones de base de datos para la entidad TIPO_BECA
 *
 * Atributos del modelo:
 * - id: number (PK, auto-generated)
 * - nombre: string
 */

const pool = require("../../db");

class TipoBecaModel {
  /**
   * Obtiene todos los tipos de beca
   * @returns {Promise<Array>} Lista de tipos de beca
   */
  static async getTiposBeca() {
    const result = await pool.query("SELECT * FROM TIPO_BECA");
    return result.rows;
  }

  /**
   * Obtiene un tipo de beca por su ID
   * @param {number} id - ID del tipo de beca
   * @returns {Promise<Object|null>} Tipo de beca encontrado o null
   */
  static async getTipoBecaById(id) {
    const result = await pool.query("SELECT * FROM TIPO_BECA WHERE ID = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  /**
   * Crea un nuevo tipo de beca
   * @param {Object} data - Datos del tipo de beca
   * @param {string} data.nombre - Nombre del tipo de beca
   * @returns {Promise<number>} ID del tipo de beca creado
   */
  static async createTipoBeca(data) {
    const { nombre } = data;
    const result = await pool.query(
      "INSERT INTO TIPO_BECA (NOMBRE) VALUES ($1) RETURNING ID",
      [nombre],
    );
    return result.rows[0].id;
  }

  /**
   * Actualiza un tipo de beca existente
   * @param {number} id - ID del tipo de beca
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<boolean>} true si se actualizó, false si no existía
   */
  static async updateTipoBeca(id, data) {
    const { nombre } = data;
    const result = await pool.query(
      "UPDATE TIPO_BECA SET NOMBRE = $1 WHERE ID = $2",
      [nombre, id],
    );
    return result.rowCount > 0;
  }

  /**
   * Elimina un tipo de beca
   * @param {number} id - ID del tipo de beca
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async deleteTipoBeca(id) {
    const result = await pool.query("DELETE FROM TIPO_BECA WHERE ID = $1", [
      id,
    ]);
    return result.rowCount > 0;
  }
}

module.exports = TipoBecaModel;
