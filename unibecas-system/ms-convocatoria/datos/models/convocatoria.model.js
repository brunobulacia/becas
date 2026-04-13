/**
 * ConvocatoriaModel - Capa de Datos
 * Maneja todas las operaciones de base de datos para la entidad CONVOCATORIA
 *
 * Atributos del modelo:
 * - id: number (PK, auto-generated)
 * - descripcion: string
 * - periodo: string
 * - fecha_inicio: date
 * - fecha_fin: date
 * - cupos: number
 * - id_beca: number (FK -> BECA)
 */

const pool = require("../../db");

class ConvocatoriaModel {
  /**
   * Obtiene todas las convocatorias con cupos disponibles calculados
   * @returns {Promise<Array>} Lista de convocatorias
   */
  static async getConvocatorias() {
    const result = await pool.query(`
      SELECT co.*, 
             b.NOMBRE AS beca_nombre,
             co.CUPOS - COALESCE(
               (SELECT COUNT(*) FROM SOLICITUD s 
                WHERE s.ID_CONVOCATORIA = co.ID 
                AND s.ESTADO IN ('PENDIENTE', 'APROBADA')), 0
             ) AS cupos_disponibles
      FROM CONVOCATORIA co 
      JOIN BECA b ON co.ID_BECA = b.ID
    `);
    return result.rows;
  }

  /**
   * Obtiene una convocatoria por su ID
   * @param {number} id - ID de la convocatoria
   * @returns {Promise<Object|null>} Convocatoria encontrada o null
   */
  static async getConvocatoriaById(id) {
    const result = await pool.query(
      "SELECT co.*, b.NOMBRE AS beca_nombre FROM CONVOCATORIA co JOIN BECA b ON co.ID_BECA = b.ID WHERE co.ID = $1",
      [id],
    );
    return result.rows[0] || null;
  }

  /**
   * Crea una nueva convocatoria
   * @param {Object} data - Datos de la convocatoria
   * @returns {Promise<number>} ID de la convocatoria creada
   */
  static async createConvocatoria(data) {
    const { descripcion, periodo, fecha_inicio, fecha_fin, cupos, id_beca } =
      data;
    const result = await pool.query(
      "INSERT INTO CONVOCATORIA (DESCRIPCION, PERIODO, FECHA_INICIO, FECHA_FIN, CUPOS, ID_BECA) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID",
      [descripcion, periodo, fecha_inicio, fecha_fin, cupos, id_beca],
    );
    return result.rows[0].id;
  }

  /**
   * Actualiza una convocatoria existente
   * @param {number} id - ID de la convocatoria
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<boolean>} true si se actualizó, false si no existía
   */
  static async updateConvocatoria(id, data) {
    const { descripcion, periodo, fecha_inicio, fecha_fin, cupos, id_beca } =
      data;
    const result = await pool.query(
      "UPDATE CONVOCATORIA SET DESCRIPCION = $1, PERIODO = $2, FECHA_INICIO = $3, FECHA_FIN = $4, CUPOS = $5, ID_BECA = $6 WHERE ID = $7",
      [descripcion, periodo, fecha_inicio, fecha_fin, cupos, id_beca, id],
    );
    return result.rowCount > 0;
  }

  /**
   * Elimina una convocatoria
   * @param {number} id - ID de la convocatoria
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async deleteConvocatoria(id) {
    const result = await pool.query("DELETE FROM CONVOCATORIA WHERE ID = $1", [
      id,
    ]);
    return result.rowCount > 0;
  }
}

module.exports = ConvocatoriaModel;
