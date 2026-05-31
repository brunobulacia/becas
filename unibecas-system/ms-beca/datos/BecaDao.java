package datos;

import datos.entidades.Beca;
import java.sql.*;
import java.util.*;

public class BecaDao {

    public static List<Beca> getAll() throws SQLException {
        List<Beca> lista = new ArrayList<>();
        String sql = "SELECT b.*, tb.NOMBRE AS tipo_nombre FROM BECA b JOIN TIPO_BECA tb ON b.ID_TIPOB = tb.ID";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public static Beca getById(int id) throws SQLException {
        String sql = "SELECT b.*, tb.NOMBRE AS tipo_nombre FROM BECA b JOIN TIPO_BECA tb ON b.ID_TIPOB = tb.ID WHERE b.ID = ?";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

    public static int create(Beca b) throws SQLException {
        String sql = "INSERT INTO BECA (NOMBRE, DESCRIPCION, PORCENTAJE, ACTIVO, ID_TIPOB) VALUES (?,?,?,?,?) RETURNING ID";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, b.getNombre());
            ps.setString(2, b.getDescripcion());
            ps.setDouble(3, b.getPorcentaje());
            ps.setBoolean(4, b.isActivo());
            ps.setInt(5, b.getIdTipob());
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

    public static boolean update(int id, Beca b) throws SQLException {
        String sql = "UPDATE BECA SET NOMBRE=?, DESCRIPCION=?, PORCENTAJE=?, ACTIVO=?, ID_TIPOB=? WHERE ID=?";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, b.getNombre());
            ps.setString(2, b.getDescripcion());
            ps.setDouble(3, b.getPorcentaje());
            ps.setBoolean(4, b.isActivo());
            ps.setInt(5, b.getIdTipob());
            ps.setInt(6, id);
            return ps.executeUpdate() > 0;
        }
    }

    public static boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM BECA WHERE ID=?";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private static Beca mapear(ResultSet rs) throws SQLException {
        return new Beca(
            rs.getInt("id"),
            rs.getString("nombre"),
            rs.getString("descripcion"),
            rs.getDouble("porcentaje"),
            rs.getBoolean("activo"),
            rs.getInt("id_tipob"),
            rs.getString("tipo_nombre")
        );
    }
}
