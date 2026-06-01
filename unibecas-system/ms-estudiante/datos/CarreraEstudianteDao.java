package datos;

import datos.entidades.CarreraEstudiante;
import java.sql.*;
import java.util.*;

public class CarreraEstudianteDao {

    private static final String SQL_JOIN =
        "SELECT ce.ID_ESTUDIANTE, ce.ID_CARRERA, ce.FECHA_INSCRIPCION, " +
        "e.NOMBRE AS estudiante_nombre, e.APELLIDO AS estudiante_apellido, " +
        "c.NOMBRE AS carrera_nombre FROM CARRERA_ESTUDIANTE ce " +
        "JOIN ESTUDIANTE e ON ce.ID_ESTUDIANTE = e.ID " +
        "JOIN CARRERA c ON ce.ID_CARRERA = c.ID ";

    public static List<CarreraEstudiante> getAll() throws SQLException {
        List<CarreraEstudiante> lista = new ArrayList<>();
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(SQL_JOIN + "ORDER BY ce.ID_ESTUDIANTE");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public static List<CarreraEstudiante> getByEstudiante(int idEstudiante) throws SQLException {
        List<CarreraEstudiante> lista = new ArrayList<>();
        String sql = "SELECT ce.ID_ESTUDIANTE, ce.ID_CARRERA, ce.FECHA_INSCRIPCION, " +
                     "c.NOMBRE AS carrera_nombre FROM CARRERA_ESTUDIANTE ce " +
                     "JOIN CARRERA c ON ce.ID_CARRERA = c.ID WHERE ce.ID_ESTUDIANTE=?";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, idEstudiante);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    CarreraEstudiante ce = new CarreraEstudiante();
                    ce.setIdEstudiante(idEstudiante);
                    ce.setIdCarrera(rs.getInt("id_carrera"));
                    ce.setFechaInscripcion(String.valueOf(rs.getDate("fecha_inscripcion")));
                    ce.setCarreraNombre(rs.getString("carrera_nombre"));
                    lista.add(ce);
                }
            }
        }
        return lista;
    }

    public static void create(CarreraEstudiante ce) throws SQLException {
        String sql = "INSERT INTO CARRERA_ESTUDIANTE (ID_ESTUDIANTE, ID_CARRERA, FECHA_INSCRIPCION) VALUES (?,?,?)";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, ce.getIdEstudiante());
            ps.setInt(2, ce.getIdCarrera());
            ps.setDate(3, java.sql.Date.valueOf(ce.getFechaInscripcion()));
            ps.executeUpdate();
        }
    }

    public static boolean delete(int idEstudiante, int idCarrera) throws SQLException {
        String sql = "DELETE FROM CARRERA_ESTUDIANTE WHERE ID_ESTUDIANTE=? AND ID_CARRERA=?";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, idEstudiante);
            ps.setInt(2, idCarrera);
            return ps.executeUpdate() > 0;
        }
    }

    private static CarreraEstudiante mapear(ResultSet rs) throws SQLException {
        return new CarreraEstudiante(
            0,
            rs.getInt("id_estudiante"),
            rs.getInt("id_carrera"),
            String.valueOf(rs.getDate("fecha_inscripcion")),
            rs.getString("estudiante_nombre"),
            rs.getString("estudiante_apellido"),
            rs.getString("carrera_nombre")
        );
    }
}
