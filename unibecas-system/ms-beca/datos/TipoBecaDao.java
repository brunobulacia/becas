package datos;

import datos.entidades.TipoBeca;
import java.sql.*;
import java.util.*;

public class TipoBecaDao {

    public static List<TipoBeca> getAll() throws SQLException {
        List<TipoBeca> lista = new ArrayList<>();
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM TIPO_BECA");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public static TipoBeca getById(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM TIPO_BECA WHERE ID=?")) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

    public static int create(TipoBeca tb) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("INSERT INTO TIPO_BECA (NOMBRE) VALUES (?) RETURNING ID")) {
            ps.setString(1, tb.getNombre());
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

    public static boolean update(int id, TipoBeca tb) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("UPDATE TIPO_BECA SET NOMBRE=? WHERE ID=?")) {
            ps.setString(1, tb.getNombre());
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        }
    }

    public static boolean delete(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM TIPO_BECA WHERE ID=?")) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private static TipoBeca mapear(ResultSet rs) throws SQLException {
        return new TipoBeca(rs.getInt("id"), rs.getString("nombre"));
    }
}
