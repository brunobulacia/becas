/**
 * FacultadModel - Capa de Datos
 * Maneja todas las operaciones de base de datos para la entidad FACULTAD
 *
 * Atributos del modelo:
 * + Id
 * + Nombre
 *
 * Métodos:
 * + getFacultades()
 * + getFacultadById(id)
 * + createFacultad(data)
 * + updateFacultad(id, data)
 * + deleteFacultad(id)
 */

const pool = require("../../db");

class FacultadModel {
  /**
   * Obtiene todas las facultades
   * @returns {Promise<Array>} Lista de facultades
   */
  static async getFacultades() {
    const result = await pool.query("SELECT * FROM FACULTAD ORDER BY ID");
    return result.rows;
  }

  /**
   * Obtiene una facultad por su ID
   * @param {number} id - ID de la facultad
   * @returns {Promise<Object|null>} Facultad encontrada o null
   */
  static async getFacultadById(id) {
    const result = await pool.query("SELECT * FROM FACULTAD WHERE ID = $1", [
      id,
    ]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Crea una nueva facultad
   * @param {Object} data - Datos de la facultad
   * @param {string} data.nombre - Nombre de la facultad
   * @returns {Promise<Object>} Facultad creada con su ID
   */
  static async createFacultad(data) {
    const { nombre } = data;
    const result = await pool.query(
      "INSERT INTO FACULTAD (NOMBRE) VALUES ($1) RETURNING ID",
      [nombre],
    );
    return {
      id: result.rows[0].id,
      nombre,
    };
  }

  /**
   * Actualiza una facultad existente
   * @param {number} id - ID de la facultad
   * @param {Object} data - Datos a actualizar
   * @param {string} data.nombre - Nuevo nombre
   * @returns {Promise<Object|null>} Facultad actualizada o null si no existe
   */
  static async updateFacultad(id, data) {
    const { nombre } = data;
    const result = await pool.query(
      "UPDATE FACULTAD SET NOMBRE = $1 WHERE ID = $2",
      [nombre, id],
    );
    if (result.rowCount === 0) {
      return null;
    }
    return { id: parseInt(id), nombre };
  }

  /**
   * Elimina una facultad
   * @param {number} id - ID de la facultad
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async deleteFacultad(id) {
    const result = await pool.query("DELETE FROM FACULTAD WHERE ID = $1", [id]);
    return result.rowCount > 0;
  }
}

module.exports = FacultadModel;
