package negocio;

import datos.entidades.Solicitud;
import java.net.*;
import java.util.regex.*;

public class ValidacionEstudianteActivoStrategy implements ValidacionSolicitudStrategy {

    private static final String URL_ESTUDIANTE = "http://localhost:3003/estudiantes/";

    @Override
    public void validar(Solicitud solicitud) throws Exception {
        if (solicitud.getIdEstudiante() <= 0) {
            throw new Exception("id_estudiante es obligatorio.");
        }

        String body = get(URL_ESTUDIANTE + solicitud.getIdEstudiante());

        if (body == null) {
            throw new Exception("No se pudo verificar el estudiante (ms-estudiante no disponible).");
        }

        if (!body.contains("\"success\":true")) {
            throw new Exception("El estudiante con id " + solicitud.getIdEstudiante() + " no existe.");
        }

        Matcher m = Pattern.compile("\"activo\"\\s*:\\s*(true|false)").matcher(body);
        if (m.find()) {
            boolean activo = Boolean.parseBoolean(m.group(1));
            if (!activo) {
                throw new Exception("El estudiante no esta activo en el sistema.");
            }
        }
    }

    private String get(String urlStr) {
        try {
            HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);
            return new String(conn.getInputStream().readAllBytes());
        } catch (Exception e) {
            return null;
        }
    }
}
