package datos;

import datos.entidades.Convocatoria;
import java.sql.*;
import java.util.*;

public class ConvocatoriaDao {

    private static final String SQL_BASE =
        "SELECT co.*, b.NOMBRE AS beca_nombre, " +
        "co.CUPOS - COALESCE((SELECT COUNT(*) FROM SOLICITUD s " +
        "WHERE s.ID_CONVOCATORIA = co.ID AND s.ESTADO IN ('PENDIENTE','APROBADA')), 0) AS cupos_disponibles " +
        "FROM CONVOCATORIA co JOIN BECA b ON co.ID_BECA = b.ID";

    public static List<Convocatoria> getAll() throws SQLException {
        List<Convocatoria> lista = new ArrayList<>();
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(SQL_BASE);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public static Convocatoria getById(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(SQL_BASE + " WHERE co.ID=?")) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

    public static int create(Convocatoria conv) throws SQLException {
        String sql = "INSERT INTO CONVOCATORIA (DESCRIPCION, PERIODO, FECHA_INICIO, FECHA_FIN, CUPOS, ID_BECA) " +
                     "VALUES (?,?,?,?,?,?) RETURNING ID";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, conv.getDescripcion());
            ps.setString(2, conv.getPeriodo());
            ps.setDate(3, java.sql.Date.valueOf(conv.getFechaInicio()));
            ps.setDate(4, java.sql.Date.valueOf(conv.getFechaFin()));
            ps.setInt(5, conv.getCupos());
            ps.setInt(6, conv.getIdBeca());
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

    public static boolean update(int id, Convocatoria conv) throws SQLException {
        String sql = "UPDATE CONVOCATORIA SET DESCRIPCION=?, PERIODO=?, FECHA_INICIO=?, FECHA_FIN=?, CUPOS=?, ID_BECA=? WHERE ID=?";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, conv.getDescripcion());
            ps.setString(2, conv.getPeriodo());
            ps.setDate(3, java.sql.Date.valueOf(conv.getFechaInicio()));
            ps.setDate(4, java.sql.Date.valueOf(conv.getFechaFin()));
            ps.setInt(5, conv.getCupos());
            ps.setInt(6, conv.getIdBeca());
            ps.setInt(7, id);
            return ps.executeUpdate() > 0;
        }
    }

    public static boolean delete(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM CONVOCATORIA WHERE ID=?")) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private static Convocatoria mapear(ResultSet rs) throws SQLException {
        return new Convocatoria(
            rs.getInt("id"),
            rs.getString("descripcion"),
            rs.getString("periodo"),
            String.valueOf(rs.getDate("fecha_inicio")),
            String.valueOf(rs.getDate("fecha_fin")),
            rs.getInt("cupos"),
            rs.getInt("id_beca"),
            rs.getString("beca_nombre"),
            rs.getInt("cupos_disponibles")
        );
    }
}
