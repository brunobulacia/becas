/**
 * BecaModel - Capa de Datos
 * Maneja todas las operaciones de base de datos para la entidad BECA
 *
 * Atributos del modelo:
 * - id: number (PK, auto-generated)
 * - nombre: string
 * - descripcion: string
 * - porcentaje: number
 * - activo: boolean
 * - id_tipob: number (FK -> TIPO_BECA)
 */

const pool = require("../../db");

class BecaModel {
  /**
   * Obtiene todas las becas con el nombre del tipo de beca
   * @returns {Promise<Array>} Lista de becas
   */
  static async getBecas() {
    const result = await pool.query(`
      SELECT b.*, tb.NOMBRE AS tipo_nombre 
      FROM BECA b 
      JOIN TIPO_BECA tb ON b.ID_TIPOB = tb.ID
    `);
    return result.rows;
  }

  /**
   * Obtiene una beca por su ID
   * @param {number} id - ID de la beca
   * @returns {Promise<Object|null>} Beca encontrada o null
   */
  static async getBecaById(id) {
    const result = await pool.query("SELECT * FROM BECA WHERE ID = $1", [id]);
    return result.rows[0] || null;
  }

  /**
   * Crea una nueva beca
   * @param {Object} data - Datos de la beca
   * @returns {Promise<number>} ID de la beca creada
   */
  static async createBeca(data) {
    const { nombre, descripcion, porcentaje, activo, id_tipob } = data;
    const result = await pool.query(
      "INSERT INTO BECA (NOMBRE, DESCRIPCION, PORCENTAJE, ACTIVO, ID_TIPOB) VALUES ($1, $2, $3, $4, $5) RETURNING ID",
      [nombre, descripcion, porcentaje, activo, id_tipob],
    );
    return result.rows[0].id;
  }

  /**
   * Actualiza una beca existente
   * @param {number} id - ID de la beca
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<boolean>} true si se actualizó, false si no existía
   */
  static async updateBeca(id, data) {
    const { nombre, descripcion, porcentaje, activo, id_tipob } = data;
    const result = await pool.query(
      "UPDATE BECA SET NOMBRE = $1, DESCRIPCION = $2, PORCENTAJE = $3, ACTIVO = $4, ID_TIPOB = $5 WHERE ID = $6",
      [nombre, descripcion, porcentaje, activo, id_tipob, id],
    );
    return result.rowCount > 0;
  }

  /**
   * Elimina una beca
   * @param {number} id - ID de la beca
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async deleteBeca(id) {
    const result = await pool.query("DELETE FROM BECA WHERE ID = $1", [id]);
    return result.rowCount > 0;
  }
}

module.exports = BecaModel;
