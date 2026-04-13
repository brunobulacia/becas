/**
 * AsignacionModel - Capa de Datos
 * Maneja todas las operaciones de base de datos para la entidad ASIGNACION
 *
 * Atributos del modelo:
 * - id: number (PK, auto-generated)
 * - descripcion: string
 * - periodo: string
 * - fecha_inicio: date
 * - fecha_fin: date
 * - id_solicitud: number (FK -> SOLICITUD)
 */

const pool = require("../../db");

class AsignacionModel {
  /**
   * Obtiene todas las asignaciones con información de beca, convocatoria y estudiante
   * @returns {Promise<Array>} Lista de asignaciones
   */
  static async getAsignaciones() {
    const result = await pool.query(`
      SELECT a.*,
          b.NOMBRE AS beca_nombre,
          co.PERIODO AS convocatoria_periodo,
          s.ID_ESTUDIANTE
      FROM ASIGNACION a
      JOIN SOLICITUD s ON a.ID_SOLICITUD = s.ID
      JOIN CONVOCATORIA co ON s.ID_CONVOCATORIA = co.ID
      JOIN BECA b ON co.ID_BECA = b.ID
    `);
    return result.rows;
  }

  /**
   * Obtiene una asignación por su ID
   * @param {number} id - ID de la asignación
   * @returns {Promise<Object|null>} Asignación encontrada o null
   */
  static async getAsignacionById(id) {
    const result = await pool.query(
      `SELECT a.*,
          b.NOMBRE AS beca_nombre,
          co.PERIODO AS convocatoria_periodo,
          s.ID_ESTUDIANTE
      FROM ASIGNACION a
      JOIN SOLICITUD s ON a.ID_SOLICITUD = s.ID
      JOIN CONVOCATORIA co ON s.ID_CONVOCATORIA = co.ID
      JOIN BECA b ON co.ID_BECA = b.ID
      WHERE a.ID = $1`,
      [id],
    );
    return result.rows[0] || null;
  }

  /**
   * Crea una nueva asignación
   * @param {Object} data - Datos de la asignación
   * @returns {Promise<number>} ID de la asignación creada
   */
  static async createAsignacion(data) {
    const { descripcion, periodo, fecha_inicio, fecha_fin, id_solicitud } =
      data;
    const result = await pool.query(
      "INSERT INTO ASIGNACION (DESCRIPCION, PERIODO, FECHA_INICIO, FECHA_FIN, ID_SOLICITUD) VALUES ($1, $2, $3, $4, $5) RETURNING ID",
      [descripcion, periodo, fecha_inicio, fecha_fin, id_solicitud],
    );
    return result.rows[0].id;
  }

  /**
   * Actualiza una asignación existente
   * @param {number} id - ID de la asignación
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<boolean>} true si se actualizó, false si no existía
   */
  static async updateAsignacion(id, data) {
    const { descripcion, periodo, fecha_inicio, fecha_fin, id_solicitud } =
      data;
    const result = await pool.query(
      "UPDATE ASIGNACION SET DESCRIPCION = $1, PERIODO = $2, FECHA_INICIO = $3, FECHA_FIN = $4, ID_SOLICITUD = $5 WHERE ID = $6",
      [descripcion, periodo, fecha_inicio, fecha_fin, id_solicitud, id],
    );
    return result.rowCount > 0;
  }

  /**
   * Elimina una asignación
   * @param {number} id - ID de la asignación
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async deleteAsignacion(id) {
    const result = await pool.query("DELETE FROM ASIGNACION WHERE ID = $1", [
      id,
    ]);
    return result.rowCount > 0;
  }

  /**
   * Verifica si existe una asignación para una solicitud
   * @param {number} idSolicitud - ID de la solicitud
   * @returns {Promise<boolean>} true si existe
   */
  static async existsBySolicitud(idSolicitud) {
    const result = await pool.query(
      "SELECT ID FROM ASIGNACION WHERE ID_SOLICITUD = $1",
      [idSolicitud],
    );
    return result.rows.length > 0;
  }
}

module.exports = AsignacionModel;
