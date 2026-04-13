/**
 * SolicitudModel - Capa de Datos
 * Maneja todas las operaciones de base de datos para la entidad SOLICITUD
 *
 * Atributos del modelo:
 * - id: number (PK, auto-generated)
 * - fecha_solicitud: date
 * - estado: string (PENDIENTE, APROBADA, RECHAZADA)
 * - observaciones: string
 * - id_estudiante: number (FK -> ESTUDIANTE en bd_academica)
 * - id_convocatoria: number (FK -> CONVOCATORIA)
 */

const pool = require("../../db");

class SolicitudModel {
  /**
   * Obtiene todas las solicitudes con información de convocatoria
   * @returns {Promise<Array>} Lista de solicitudes
   */
  static async getSolicitudes() {
    const result = await pool.query(`
      SELECT s.*,
          co.DESCRIPCION AS convocatoria_nombre,
          co.PERIODO AS convocatoria_periodo
      FROM SOLICITUD s
      JOIN CONVOCATORIA co ON s.ID_CONVOCATORIA = co.ID
    `);
    return result.rows;
  }

  /**
   * Obtiene una solicitud por su ID
   * @param {number} id - ID de la solicitud
   * @returns {Promise<Object|null>} Solicitud encontrada o null
   */
  static async getSolicitudById(id) {
    const result = await pool.query(
      `SELECT s.*,
          co.DESCRIPCION AS convocatoria_nombre,
          co.PERIODO AS convocatoria_periodo
      FROM SOLICITUD s
      JOIN CONVOCATORIA co ON s.ID_CONVOCATORIA = co.ID
      WHERE s.ID = $1`,
      [id],
    );
    return result.rows[0] || null;
  }

  /**
   * Crea una nueva solicitud
   * @param {Object} data - Datos de la solicitud
   * @returns {Promise<number>} ID de la solicitud creada
   */
  static async createSolicitud(data) {
    const {
      fecha_solicitud,
      estado,
      observaciones,
      id_estudiante,
      id_convocatoria,
    } = data;
    const result = await pool.query(
      "INSERT INTO SOLICITUD (FECHA_SOLICITUD, ESTADO, OBSERVACIONES, ID_ESTUDIANTE, ID_CONVOCATORIA) VALUES ($1, $2, $3, $4, $5) RETURNING ID",
      [
        fecha_solicitud,
        estado || "PENDIENTE",
        observaciones,
        id_estudiante,
        id_convocatoria,
      ],
    );
    return result.rows[0].id;
  }

  /**
   * Actualiza una solicitud existente
   * @param {number} id - ID de la solicitud
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<boolean>} true si se actualizó, false si no existía
   */
  static async updateSolicitud(id, data) {
    const { estado, observaciones } = data;
    const result = await pool.query(
      "UPDATE SOLICITUD SET ESTADO = $1, OBSERVACIONES = $2 WHERE ID = $3",
      [estado, observaciones, id],
    );
    return result.rowCount > 0;
  }

  /**
   * Elimina una solicitud
   * @param {number} id - ID de la solicitud
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async deleteSolicitud(id) {
    const result = await pool.query("DELETE FROM SOLICITUD WHERE ID = $1", [
      id,
    ]);
    return result.rowCount > 0;
  }

  /**
   * Verifica si existe una solicitud del estudiante para la convocatoria
   * @param {number} idEstudiante - ID del estudiante
   * @param {number} idConvocatoria - ID de la convocatoria
   * @returns {Promise<boolean>} true si ya existe
   */
  static async existsSolicitud(idEstudiante, idConvocatoria) {
    const result = await pool.query(
      "SELECT ID FROM SOLICITUD WHERE ID_ESTUDIANTE = $1 AND ID_CONVOCATORIA = $2",
      [idEstudiante, idConvocatoria],
    );
    return result.rows.length > 0;
  }

  /**
   * Cuenta solicitudes pendientes/aprobadas para una convocatoria
   * @param {number} idConvocatoria - ID de la convocatoria
   * @returns {Promise<number>} Cantidad de solicitudes
   */
  static async countByConvocatoria(idConvocatoria) {
    const result = await pool.query(
      "SELECT COUNT(*) as total FROM SOLICITUD WHERE ID_CONVOCATORIA = $1 AND ESTADO IN ('PENDIENTE', 'APROBADA')",
      [idConvocatoria],
    );
    return parseInt(result.rows[0].total);
  }
}

module.exports = SolicitudModel;
