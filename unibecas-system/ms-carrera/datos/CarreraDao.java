package datos;

import datos.entidades.Carrera;
import java.sql.*;
import java.util.*;

public class CarreraDao {

    private static final String SQL_JOIN =
        "SELECT c.*, f.NOMBRE AS facultad_nombre FROM CARRERA c JOIN FACULTAD f ON c.ID_FACULTAD = f.ID";

    public static List<Carrera> getAll() throws SQLException {
        List<Carrera> lista = new ArrayList<>();
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(SQL_JOIN + " ORDER BY c.ID");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public static Carrera getById(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(SQL_JOIN + " WHERE c.ID=?")) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

    public static int create(Carrera carrera) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(
                 "INSERT INTO CARRERA (NOMBRE, ID_FACULTAD) VALUES (?,?) RETURNING ID")) {
            ps.setString(1, carrera.getNombre());
            ps.setInt(2, carrera.getIdFacultad());
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

    public static boolean update(int id, Carrera carrera) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement(
                 "UPDATE CARRERA SET NOMBRE=?, ID_FACULTAD=? WHERE ID=?")) {
            ps.setString(1, carrera.getNombre());
            ps.setInt(2, carrera.getIdFacultad());
            ps.setInt(3, id);
            return ps.executeUpdate() > 0;
        }
    }

    public static boolean delete(int id) throws SQLException {
        try (Connection c = ConexionBD.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM CARRERA WHERE ID=?")) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private static Carrera mapear(ResultSet rs) throws SQLException {
        return new Carrera(
            rs.getInt("id"),
            rs.getString("nombre"),
            rs.getInt("id_facultad"),
            rs.getString("facultad_nombre")
        );
    }
}
