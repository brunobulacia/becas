package datos;

import datos.entidades.Estudiante;
import java.sql.*;
import java.util.*;

public class EstudianteDao {

    private static final String SQL_BASE =
        "SELECT e.*, STRING_AGG(c.NOMBRE, ', ') AS carreras " +
        "FROM ESTUDIANTE e " +
        "LEFT JOIN CARRERA_ESTUDIANTE ce ON e.ID = ce.ID_ESTUDIANTE " +
        "LEFT JOIN CARRERA c ON ce.ID_CARRERA = c.ID ";

    public static List<Estudiante> getAll() throws SQLException {
        List<Estudiante> lista = new ArrayList<>();
        String sql = SQL_BASE + "GROUP BY e.ID ORDER BY e.ID";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public static Estudiante getById(int id) throws SQLException {
        String sql = SQL_BASE + "WHERE e.ID=? GROUP BY e.ID";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

    public static int create(Estudiante e) throws SQLException {
        String sql = "INSERT INTO ESTUDIANTE (CODIGOP, NOMBRE, APELLIDO, EMAIL, PPA, ACTIVO) VALUES (?,?,?,?,?,?) RETURNING ID";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, e.getCodigop());
            ps.setString(2, e.getNombre());
            ps.setString(3, e.getApellido());
            ps.setString(4, e.getEmail());
            ps.setDouble(5, e.getPpa());
            ps.setBoolean(6, e.isActivo());
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

    public static boolean update(int id, Estudiante e) throws SQLException {
        String sql = "UPDATE ESTUDIANTE SET CODIGOP=?, NOMBRE=?, APELLIDO=?, EMAIL=?, PPA=?, ACTIVO=? WHERE ID=?";
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, e.getCodigop());
            ps.setString(2, e.getNombre());
            ps.setString(3, e.getApellido());
            ps.setString(4, e.getEmail());
            ps.setDouble(5, e.getPpa());
            ps.setBoolean(6, e.isActivo());
            ps.setInt(7, id);
            return ps.executeUpdate() > 0;
        }
    }

    public static boolean delete(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM ESTUDIANTE WHERE ID=?")) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private static Estudiante mapear(ResultSet rs) throws SQLException {
        return new Estudiante(
            rs.getInt("id"),
            rs.getString("codigop"),
            rs.getString("nombre"),
            rs.getString("apellido"),
            rs.getString("email"),
            rs.getDouble("ppa"),
            rs.getBoolean("activo"),
            rs.getString("carreras")
        );
    }
}
