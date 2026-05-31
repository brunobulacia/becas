package datos;

import datos.entidades.Asignacion;
import java.sql.*;
import java.util.*;

public class AsignacionDao {

    private static final String SQL_BASE =
        "SELECT a.*, b.NOMBRE AS beca_nombre, co.PERIODO AS convocatoria_periodo, s.ID_ESTUDIANTE " +
        "FROM ASIGNACION a " +
        "JOIN SOLICITUD s ON a.ID_SOLICITUD = s.ID " +
        "JOIN CONVOCATORIA co ON s.ID_CONVOCATORIA = co.ID " +
        "JOIN BECA b ON co.ID_BECA = b.ID";

    public static List<Asignacion> getAll() throws SQLException {
        List<Asignacion> lista = new ArrayList<>();
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(SQL_BASE);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public static Asignacion getById(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(SQL_BASE + " WHERE a.ID=?")) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

    public static int create(Asignacion a) throws SQLException {
        String sql = "INSERT INTO ASIGNACION (DESCRIPCION, PERIODO, FECHA_INICIO, FECHA_FIN, ID_SOLICITUD) VALUES (?,?,?,?,?) RETURNING ID";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, a.getDescripcion());
            ps.setString(2, a.getPeriodo());
            ps.setDate(3, java.sql.Date.valueOf(a.getFechaInicio()));
            ps.setDate(4, java.sql.Date.valueOf(a.getFechaFin()));
            ps.setInt(5, a.getIdSolicitud());
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

    public static boolean update(int id, Asignacion a) throws SQLException {
        String sql = "UPDATE ASIGNACION SET DESCRIPCION=?, PERIODO=?, FECHA_INICIO=?, FECHA_FIN=?, ID_SOLICITUD=? WHERE ID=?";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, a.getDescripcion());
            ps.setString(2, a.getPeriodo());
            ps.setDate(3, java.sql.Date.valueOf(a.getFechaInicio()));
            ps.setDate(4, java.sql.Date.valueOf(a.getFechaFin()));
            ps.setInt(5, a.getIdSolicitud());
            ps.setInt(6, id);
            return ps.executeUpdate() > 0;
        }
    }

    public static boolean delete(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM ASIGNACION WHERE ID=?")) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private static Asignacion mapear(ResultSet rs) throws SQLException {
        return new Asignacion(
            rs.getInt("id"),
            rs.getString("descripcion"),
            rs.getString("periodo"),
            String.valueOf(rs.getDate("fecha_inicio")),
            String.valueOf(rs.getDate("fecha_fin")),
            rs.getInt("id_solicitud"),
            rs.getString("beca_nombre"),
            rs.getString("convocatoria_periodo"),
            rs.getInt("id_estudiante")
        );
    }
}
