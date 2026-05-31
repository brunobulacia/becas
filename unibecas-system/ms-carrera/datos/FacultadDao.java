package datos;

import datos.entidades.Facultad;
import java.sql.*;
import java.util.*;

public class FacultadDao {

    public static List<Facultad> getAll() throws SQLException {
        List<Facultad> lista = new ArrayList<>();
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM FACULTAD ORDER BY ID");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public static Facultad getById(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM FACULTAD WHERE ID=?")) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

    public static int create(Facultad f) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("INSERT INTO FACULTAD (NOMBRE) VALUES (?) RETURNING ID")) {
            ps.setString(1, f.getNombre());
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

    public static boolean update(int id, Facultad f) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("UPDATE FACULTAD SET NOMBRE=? WHERE ID=?")) {
            ps.setString(1, f.getNombre());
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        }
    }

    public static boolean delete(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM FACULTAD WHERE ID=?")) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private static Facultad mapear(ResultSet rs) throws SQLException {
        return new Facultad(rs.getInt("id"), rs.getString("nombre"));
    }
}
