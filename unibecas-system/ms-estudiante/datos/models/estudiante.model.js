/**
 * EstudianteModel - Capa de Datos
 * Maneja todas las operaciones de base de datos para la entidad ESTUDIANTE
 *
 * Atributos del modelo:
 * + Id
 * + Codigop
 * + Nombre
 * + Apellido
 * + Email
 * + Ppa
 * + Activo
 *
 * Métodos:
 * + getEstudiantes()
 * + getEstudianteById(id)
 * + createEstudiante(data)
 * + updateEstudiante(id, data)
 * + deleteEstudiante(id)
 */

const pool = require("../../db");

class EstudianteModel {
  /**
   * Obtiene todos los estudiantes con sus carreras
   * @returns {Promise<Array>} Lista de estudiantes
   */
  static async getEstudiantes() {
    const result = await pool.query(`
      SELECT e.*, STRING_AGG(c.NOMBRE, ', ') AS carreras
      FROM ESTUDIANTE e
      LEFT JOIN CARRERA_ESTUDIANTE ce ON e.ID = ce.ID_ESTUDIANTE
      LEFT JOIN CARRERA c ON ce.ID_CARRERA = c.ID
      GROUP BY e.ID
      ORDER BY e.ID
    `);
    return result.rows;
  }

  /**
   * Obtiene un estudiante por su ID
   * @param {number} id - ID del estudiante
   * @returns {Promise<Object|null>} Estudiante encontrado o null
   */
  static async getEstudianteById(id) {
    const result = await pool.query(
      `
      SELECT e.*, STRING_AGG(c.NOMBRE, ', ') AS carreras
      FROM ESTUDIANTE e
      LEFT JOIN CARRERA_ESTUDIANTE ce ON e.ID = ce.ID_ESTUDIANTE
      LEFT JOIN CARRERA c ON ce.ID_CARRERA = c.ID
      WHERE e.ID = $1
      GROUP BY e.ID
    `,
      [id],
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Crea un nuevo estudiante
   * @param {Object} data - Datos del estudiante
   * @returns {Promise<Object>} Estudiante creado con su ID
   */
  static async createEstudiante(data) {
    const { codigop, nombre, apellido, email, ppa, activo, carreras } = data;
    const result = await pool.query(
      "INSERT INTO ESTUDIANTE (CODIGOP, NOMBRE, APELLIDO, EMAIL, PPA, ACTIVO) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID",
      [codigop, nombre, apellido, email, ppa, activo],
    );
    const estudianteId = result.rows[0].id;

    // Si se envían carreras, insertar en CARRERA_ESTUDIANTE
    if (carreras && Array.isArray(carreras) && carreras.length > 0) {
      for (const carrera of carreras) {
        await pool.query(
          "INSERT INTO CARRERA_ESTUDIANTE (ID_ESTUDIANTE, ID_CARRERA, FECHA_INSCRIPCION) VALUES ($1, $2, $3)",
          [estudianteId, carrera.id_carrera, carrera.fecha_inscripcion],
        );
      }
    }

    return {
      id: estudianteId,
      codigop,
      nombre,
      apellido,
      email,
      ppa,
      activo,
      carreras: carreras || [],
    };
  }

  /**
   * Actualiza un estudiante existente
   * @param {number} id - ID del estudiante
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object|null>} Estudiante actualizado o null si no existe
   */
  static async updateEstudiante(id, data) {
    const { codigop, nombre, apellido, email, ppa, activo } = data;
    const result = await pool.query(
      "UPDATE ESTUDIANTE SET CODIGOP = $1, NOMBRE = $2, APELLIDO = $3, EMAIL = $4, PPA = $5, ACTIVO = $6 WHERE ID = $7",
      [codigop, nombre, apellido, email, ppa, activo, id],
    );
    if (result.rowCount === 0) {
      return null;
    }
    return { id: parseInt(id), codigop, nombre, apellido, email, ppa, activo };
  }

  /**
   * Elimina un estudiante
   * @param {number} id - ID del estudiante
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async deleteEstudiante(id) {
    const result = await pool.query("DELETE FROM ESTUDIANTE WHERE ID = $1", [
      id,
    ]);
    return result.rowCount > 0;
  }
}

module.exports = EstudianteModel;
