package datos;

import java.sql.*;

public class ConexionBD {
    private static final String URL  = "jdbc:postgresql://localhost:5432/bd_postulacion";
    private static final String USER = "postgres";
    private static final String PASS = "BRUNO6464";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}
