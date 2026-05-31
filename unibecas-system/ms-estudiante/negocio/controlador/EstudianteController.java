package negocio.controlador;

import com.sun.net.httpserver.*;
import negocio.EstudianteN;
import negocio.CarreraEstudianteN;
import datos.entidades.Estudiante;
import datos.entidades.CarreraEstudiante;
import java.io.*;
import java.util.*;
import java.util.regex.*;

public class EstudianteController {

    private final EstudianteN        estudianteN = new EstudianteN();
    private final CarreraEstudianteN ceN         = new CarreraEstudianteN();

    public void handleEstudiante(HttpExchange ex) throws IOException {
        setCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); return; }

        String path = ex.getRequestURI().getPath();
        String[] seg = path.split("/");
        // /estudiantes, /estudiantes/5, /estudiantes/5/carreras, /estudiantes/5/carreras/2
        Integer idEst    = seg.length > 2 && !seg[2].isEmpty() ? parseInt(seg[2]) : null;
        boolean esCarrera = seg.length > 3 && "carreras".equals(seg[3]);
        Integer idCar    = seg.length > 4 && !seg[4].isEmpty() ? parseInt(seg[4]) : null;
        String  met      = ex.getRequestMethod();

        try {
            if (esCarrera) {
                manejarCarreraEstudiante(ex, met, idEst, idCar);
                return;
            }

            if ("GET".equals(met) && idEst == null) {
                List<Estudiante> lista = estudianteN.getAll();
                responder(ex, 200, ok(listaJson(lista), "Estudiantes obtenidos correctamente"));
            } else if ("GET".equals(met) && idEst != null) {
                Estudiante e = estudianteN.getById(idEst);
                if (e == null) responder(ex, 404, err("Estudiante no encontrado"));
                else           responder(ex, 200, ok(e.toJson(), "Estudiante obtenido correctamente"));
            } else if ("POST".equals(met)) {
                Estudiante e = estudianteN.create(parseBody(leerBody(ex)));
                responder(ex, 201, ok(e.toJson(), "Estudiante creado correctamente"));
            } else if ("PUT".equals(met) && idEst != null) {
                Estudiante e = estudianteN.update(idEst, parseBody(leerBody(ex)));
                if (e == null) responder(ex, 404, err("Estudiante no encontrado"));
                else           responder(ex, 200, ok(e.toJson(), "Estudiante actualizado correctamente"));
            } else if ("DELETE".equals(met) && idEst != null) {
                boolean ok = estudianteN.delete(idEst);
                if (!ok) responder(ex, 404, err("Estudiante no encontrado"));
                else     responder(ex, 200, ok("null", "Estudiante eliminado correctamente"));
            } else {
                responder(ex, 405, err("Metodo no permitido"));
            }
        } catch (Exception e) {
            responder(ex, 500, err("Error del servidor: " + e.getMessage()));
        }
    }

    private void manejarCarreraEstudiante(HttpExchange ex, String met, Integer idEst, Integer idCar)
            throws Exception {
        if ("GET".equals(met)) {
            List<CarreraEstudiante> lista = ceN.getByEstudiante(idEst);
            responder(ex, 200, ok(listaJsonCE(lista), "Carreras del estudiante obtenidas"));
        } else if ("POST".equals(met)) {
            CarreraEstudiante ce = ceN.create(idEst, parseBody(leerBody(ex)));
            responder(ex, 201, ok(ce.toJson(), "Carrera inscrita correctamente"));
        } else if ("DELETE".equals(met) && idCar != null) {
            boolean ok = ceN.delete(idEst, idCar);
            if (!ok) responder(ex, 404, err("Relacion no encontrada"));
            else     responder(ex, 200, ok("null", "Carrera desinscrita correctamente"));
        } else {
            responder(ex, 405, err("Metodo no permitido"));
        }
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private static String listaJson(List<Estudiante> lista) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < lista.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(lista.get(i).toJson());
        }
        return sb.append("]").toString();
    }

    private static String listaJsonCE(List<CarreraEstudiante> lista) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < lista.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(lista.get(i).toJson());
        }
        return sb.append("]").toString();
    }

    private static String ok(String data, String msg) {
        return "{\"success\":true,\"data\":" + data + ",\"message\":\"" + msg + "\"}";
    }

    private static String err(String msg) {
        return "{\"success\":false,\"data\":null,\"message\":\"" + msg + "\"}";
    }

    private static void setCors(HttpExchange ex) {
        ex.getResponseHeaders().set("Access-Control-Allow-Origin",  "*");
        ex.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void responder(HttpExchange ex, int codigo, String json) throws IOException {
        ex.getResponseHeaders().set("Content-Type", "application/json");
        byte[] bytes = json.getBytes("UTF-8");
        ex.sendResponseHeaders(codigo, bytes.length);
        ex.getResponseBody().write(bytes);
        ex.getResponseBody().close();
    }

    private static String leerBody(HttpExchange ex) throws IOException {
        return new String(ex.getRequestBody().readAllBytes(), "UTF-8");
    }

    private static Map<String, String> parseBody(String json) {
        Map<String, String> map = new LinkedHashMap<>();
        Pattern p = Pattern.compile("\"([^\"]+)\"\\s*:\\s*(\"[^\"]*\"|true|false|null|-?\\d+(?:\\.\\d+)?)");
        Matcher m = p.matcher(json);
        while (m.find()) {
            String k = m.group(1);
            String v = m.group(2);
            if (v.startsWith("\"")) v = v.substring(1, v.length() - 1);
            map.put(k, v);
        }
        return map;
    }

    private static Integer parseInt(String s) {
        try { return Integer.parseInt(s); } catch (NumberFormatException e) { return null; }
    }
}
