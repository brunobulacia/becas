/**
 * CarreraModel - Capa de Datos
 * Maneja todas las operaciones de base de datos para la entidad CARRERA
 *
 * Atributos del modelo:
 * + Id
 * + Nombre
 * + IdFacultad
 *
 * Métodos:
 * + getCarreras()
 * + getCarreraById(id)
 * + createCarrera(data)
 * + updateCarrera(id, data)
 * + deleteCarrera(id)
 */

const pool = require("../../db");

class CarreraModel {
  /**
   * Obtiene todas las carreras con información de facultad
   * @returns {Promise<Array>} Lista de carreras
   */
  static async getCarreras() {
    const result = await pool.query(`
      SELECT c.*, f.NOMBRE AS facultad_nombre 
      FROM CARRERA c 
      JOIN FACULTAD f ON c.ID_FACULTAD = f.ID 
      ORDER BY c.ID
    `);
    return result.rows;
  }

  /**
   * Obtiene una carrera por su ID
   * @param {number} id - ID de la carrera
   * @returns {Promise<Object|null>} Carrera encontrada o null
   */
  static async getCarreraById(id) {
    const result = await pool.query(
      `
      SELECT c.*, f.NOMBRE AS facultad_nombre 
      FROM CARRERA c 
      JOIN FACULTAD f ON c.ID_FACULTAD = f.ID 
      WHERE c.ID = $1
    `,
      [id],
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Crea una nueva carrera
   * @param {Object} data - Datos de la carrera
   * @param {string} data.nombre - Nombre de la carrera
   * @param {number} data.id_facultad - ID de la facultad
   * @returns {Promise<Object>} Carrera creada con su ID
   */
  static async createCarrera(data) {
    const { nombre, id_facultad } = data;
    const result = await pool.query(
      "INSERT INTO CARRERA (NOMBRE, ID_FACULTAD) VALUES ($1, $2) RETURNING ID",
      [nombre, id_facultad],
    );
    return {
      id: result.rows[0].id,
      nombre,
      id_facultad,
    };
  }

  /**
   * Actualiza una carrera existente
   * @param {number} id - ID de la carrera
   * @param {Object} data - Datos a actualizar
   * @param {string} data.nombre - Nuevo nombre
   * @param {number} data.id_facultad - Nueva facultad
   * @returns {Promise<Object|null>} Carrera actualizada o null si no existe
   */
  static async updateCarrera(id, data) {
    const { nombre, id_facultad } = data;
    const result = await pool.query(
      "UPDATE CARRERA SET NOMBRE = $1, ID_FACULTAD = $2 WHERE ID = $3",
      [nombre, id_facultad, id],
    );
    if (result.rowCount === 0) {
      return null;
    }
    return { id: parseInt(id), nombre, id_facultad };
  }

  /**
   * Elimina una carrera
   * @param {number} id - ID de la carrera
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async deleteCarrera(id) {
    const result = await pool.query("DELETE FROM CARRERA WHERE ID = $1", [id]);
    return result.rowCount > 0;
  }
}

module.exports = CarreraModel;
