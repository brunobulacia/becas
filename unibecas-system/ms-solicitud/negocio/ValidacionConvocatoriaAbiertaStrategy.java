package negocio;

import datos.entidades.Solicitud;
import java.net.*;
import java.util.regex.*;

public class ValidacionConvocatoriaAbiertaStrategy implements ValidacionSolicitudStrategy {

    private static final String URL_CONVOCATORIA = "http://localhost:3004/convocatorias/";

    @Override
    public void validar(Solicitud solicitud) throws Exception {
        if (solicitud.getIdConvocatoria() <= 0) {
            throw new Exception("id_convocatoria es obligatorio.");
        }

        String body = get(URL_CONVOCATORIA + solicitud.getIdConvocatoria());

        if (body == null) {
            throw new Exception("No se pudo verificar la convocatoria (ms-convocatoria no disponible).");
        }

        if (!body.contains("\"success\":true")) {
            throw new Exception("La convocatoria con id " + solicitud.getIdConvocatoria() + " no existe.");
        }

        Matcher m = Pattern.compile("\"estado\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
        if (m.find()) {
            String estado = m.group(1).toUpperCase();
            if (!estado.equals("ABIERTA")) {
                throw new Exception("La convocatoria no esta abierta (estado actual: " + estado + ").");
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
