package datos;

import datos.entidades.Solicitud;
import java.sql.*;
import java.util.*;

public class SolicitudDao {

    private static final String SQL_BASE =
        "SELECT s.*, co.DESCRIPCION AS convocatoria_nombre, co.PERIODO AS convocatoria_periodo " +
        "FROM SOLICITUD s JOIN CONVOCATORIA co ON s.ID_CONVOCATORIA = co.ID";

    public static List<Solicitud> getAll() throws SQLException {
        List<Solicitud> lista = new ArrayList<>();
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(SQL_BASE);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public static Solicitud getById(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(SQL_BASE + " WHERE s.ID=?")) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

    public static int create(Solicitud s) throws SQLException {
        String sql = "INSERT INTO SOLICITUD (FECHA_SOLICITUD, ESTADO, OBSERVACIONES, ID_ESTUDIANTE, ID_CONVOCATORIA) " +
                     "VALUES (?,?,?,?,?) RETURNING ID";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setDate(1, java.sql.Date.valueOf(s.getFechaSolicitud()));
            ps.setString(2, s.getEstado() != null ? s.getEstado() : "PENDIENTE");
            ps.setString(3, s.getObservaciones());
            ps.setInt(4, s.getIdEstudiante());
            ps.setInt(5, s.getIdConvocatoria());
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

    public static boolean update(int id, Solicitud s) throws SQLException {
        String sql = "UPDATE SOLICITUD SET ESTADO=?, OBSERVACIONES=? WHERE ID=?";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, s.getEstado());
            ps.setString(2, s.getObservaciones());
            ps.setInt(3, id);
            return ps.executeUpdate() > 0;
        }
    }

    public static boolean delete(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM SOLICITUD WHERE ID=?")) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private static Solicitud mapear(ResultSet rs) throws SQLException {
        return new Solicitud(
            rs.getInt("id"),
            String.valueOf(rs.getDate("fecha_solicitud")),
            rs.getString("estado"),
            rs.getString("observaciones"),
            rs.getInt("id_estudiante"),
            rs.getInt("id_convocatoria"),
            rs.getString("convocatoria_nombre"),
            rs.getString("convocatoria_periodo")
        );
    }
}
