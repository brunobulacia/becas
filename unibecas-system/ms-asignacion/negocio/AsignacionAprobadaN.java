package negocio;

import datos.entidades.Asignacion;
import java.io.*;
import java.net.*;
import java.util.*;
import java.util.regex.*;

public class AsignacionAprobadaN extends AsignacionTemplate {

    private static final String URL_SOLICITUD  = "http://localhost:3005/solicitudes/";
    private static final String URL_ESTUDIANTE = "http://localhost:3003/estudiantes/";

    @Override
    protected Asignacion construirAsignacion(Map<String, String> d) throws Exception {
        if (d.get("fecha_inicio") == null || d.get("fecha_fin") == null) {
            throw new Exception("fecha_inicio y fecha_fin son obligatorios para la asignacion.");
        }
        Asignacion a = new Asignacion();
        a.setDescripcion(d.getOrDefault("descripcion", "Asignacion de beca aprobada"));
        a.setPeriodo(d.get("periodo"));
        a.setFechaInicio(d.get("fecha_inicio"));
        a.setFechaFin(d.get("fecha_fin"));
        a.setIdSolicitud(Integer.parseInt(d.getOrDefault("id_solicitud", "0")));
        return a;
    }

    @Override
    protected void validarSolicitud(Asignacion a) throws Exception {
        if (a.getIdSolicitud() <= 0) {
            throw new Exception("id_solicitud es obligatorio.");
        }
        String body = get(URL_SOLICITUD + a.getIdSolicitud());
        if (body == null || !body.contains("\"success\":true")) {
            throw new Exception("La solicitud con id " + a.getIdSolicitud() + " no existe.");
        }
        Matcher m = Pattern.compile("\"estado\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
        if (m.find()) {
            String estado = m.group(1).toUpperCase();
            if (!estado.equals("PENDIENTE")) {
                throw new Exception("La solicitud ya fue procesada (estado: " + estado + "). Solo se pueden asignar solicitudes PENDIENTES.");
            }
        }
        Matcher me = Pattern.compile("\"id_estudiante\"\\s*:\\s*(\\d+)").matcher(body);
        if (me.find()) {
            a.setIdEstudiante(Integer.parseInt(me.group(1)));
        }
    }

    @Override
    protected void actualizarEstadoSolicitud(Asignacion a) throws Exception {
        String bodyPut = "{\"estado\":\"APROBADA\",\"observaciones\":\"Solicitud aprobada y beca asignada\"}";
        try {
            HttpURLConnection conn = (HttpURLConnection) new URL(URL_SOLICITUD + a.getIdSolicitud()).openConnection();
            conn.setRequestMethod("PUT");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);
            conn.getOutputStream().write(bodyPut.getBytes("UTF-8"));
            int code = conn.getResponseCode();
            if (code != 200) {
                throw new Exception("No se pudo actualizar el estado de la solicitud (HTTP " + code + ").");
            }
        } catch (IOException e) {
            throw new Exception("Error al comunicarse con ms-solicitud: " + e.getMessage());
        }
    }

    @Override
    protected void enriquecer(Asignacion a) throws Exception {
        if (a.getIdEstudiante() <= 0) return;
        try {
            String body = get(URL_ESTUDIANTE + a.getIdEstudiante());
            if (body == null) return;
            Matcher mn = Pattern.compile("\"nombre\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
            Matcher ma = Pattern.compile("\"apellido\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
            String nombre   = mn.find() ? mn.group(1) : "";
            String apellido = ma.find() ? ma.group(1) : "";
            a.setEstudianteNombre(nombre + " " + apellido);
        } catch (Exception ignored) {
            a.setEstudianteNombre("Desconocido");
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
