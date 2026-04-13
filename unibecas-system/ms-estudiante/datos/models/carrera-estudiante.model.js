/**
 * CarreraEstudianteModel - Capa de Datos
 * Maneja las operaciones de base de datos para la relación CARRERA_ESTUDIANTE
 *
 * Atributos del modelo:
 * + Id
 * + IdEstudiante
 * + IdCarrera
 * + FechaInscripcion
 *
 * Métodos:
 * + getCarrerasEstudiante()
 * + getCarreraEstudianteById(id)
 * + getCarrerasByEstudiante(idEstudiante)
 * + createCarreraEstudiante(data)
 * + updateCarreraEstudiante(id, data)
 * + deleteCarreraEstudiante(id)
 */

const pool = require("../../db");

class CarreraEstudianteModel {
  /**
   * Obtiene todas las relaciones carrera-estudiante
   * @returns {Promise<Array>} Lista de relaciones
   */
  static async getCarrerasEstudiante() {
    const result = await pool.query(`
      SELECT ce.*, 
             e.NOMBRE AS estudiante_nombre, 
             e.APELLIDO AS estudiante_apellido,
             c.NOMBRE AS carrera_nombre
      FROM CARRERA_ESTUDIANTE ce
      JOIN ESTUDIANTE e ON ce.ID_ESTUDIANTE = e.ID
      JOIN CARRERA c ON ce.ID_CARRERA = c.ID
      ORDER BY ce.ID
    `);
    return result.rows;
  }

  /**
   * Obtiene una relación por su ID
   * @param {number} id - ID de la relación
   * @returns {Promise<Object|null>} Relación encontrada o null
   */
  static async getCarreraEstudianteById(id) {
    const result = await pool.query(
      `
      SELECT ce.*, 
             e.NOMBRE AS estudiante_nombre, 
             e.APELLIDO AS estudiante_apellido,
             c.NOMBRE AS carrera_nombre
      FROM CARRERA_ESTUDIANTE ce
      JOIN ESTUDIANTE e ON ce.ID_ESTUDIANTE = e.ID
      JOIN CARRERA c ON ce.ID_CARRERA = c.ID
      WHERE ce.ID = $1
    `,
      [id],
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Obtiene las carreras de un estudiante
   * @param {number} idEstudiante - ID del estudiante
   * @returns {Promise<Array>} Lista de carreras del estudiante
   */
  static async getCarrerasByEstudiante(idEstudiante) {
    const result = await pool.query(
      `
      SELECT ce.*, c.NOMBRE AS carrera_nombre
      FROM CARRERA_ESTUDIANTE ce
      JOIN CARRERA c ON ce.ID_CARRERA = c.ID
      WHERE ce.ID_ESTUDIANTE = $1
    `,
      [idEstudiante],
    );
    return result.rows;
  }

  /**
   * Crea una nueva relación carrera-estudiante
   * @param {Object} data - Datos de la relación
   * @returns {Promise<Object>} Relación creada con su ID
   */
  static async createCarreraEstudiante(data) {
    const { id_estudiante, id_carrera, fecha_inscripcion } = data;
    const result = await pool.query(
      "INSERT INTO CARRERA_ESTUDIANTE (ID_ESTUDIANTE, ID_CARRERA, FECHA_INSCRIPCION) VALUES ($1, $2, $3) RETURNING ID",
      [id_estudiante, id_carrera, fecha_inscripcion],
    );
    return {
      id: result.rows[0].id,
      id_estudiante,
      id_carrera,
      fecha_inscripcion,
    };
  }

  /**
   * Actualiza una relación existente
   * @param {number} id - ID de la relación
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object|null>} Relación actualizada o null si no existe
   */
  static async updateCarreraEstudiante(id, data) {
    const { id_estudiante, id_carrera, fecha_inscripcion } = data;
    const result = await pool.query(
      "UPDATE CARRERA_ESTUDIANTE SET ID_ESTUDIANTE = $1, ID_CARRERA = $2, FECHA_INSCRIPCION = $3 WHERE ID = $4",
      [id_estudiante, id_carrera, fecha_inscripcion, id],
    );
    if (result.rowCount === 0) {
      return null;
    }
    return { id: parseInt(id), id_estudiante, id_carrera, fecha_inscripcion };
  }

  /**
   * Elimina una relación
   * @param {number} id - ID de la relación
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async deleteCarreraEstudiante(id) {
    const result = await pool.query(
      "DELETE FROM CARRERA_ESTUDIANTE WHERE ID = $1",
      [id],
    );
    return result.rowCount > 0;
  }
}

module.exports = CarreraEstudianteModel;
