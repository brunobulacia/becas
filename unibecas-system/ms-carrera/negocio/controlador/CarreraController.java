package negocio.controlador;

import com.sun.net.httpserver.*;
import negocio.CarreraN;
import negocio.FacultadN;
import datos.entidades.Carrera;
import datos.entidades.Facultad;
import java.io.*;
import java.util.*;
import java.util.regex.*;

public class CarreraController {

    private final CarreraN  carreraN  = new CarreraN();
    private final FacultadN facultadN = new FacultadN();

    public void handleCarrera(HttpExchange ex) throws IOException {
        setCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); return; }

        String[] seg = ex.getRequestURI().getPath().split("/");
        Integer  id  = seg.length > 2 && !seg[2].isEmpty() ? parseInt(seg[2]) : null;
        String   met = ex.getRequestMethod();

        try {
            if ("GET".equals(met) && id == null) {
                List<Carrera> lista = carreraN.getAll();
                responder(ex, 200, ok(listaJson(lista), "Carreras obtenidas correctamente"));
            } else if ("GET".equals(met) && id != null) {
                Carrera c = carreraN.getById(id);
                if (c == null) responder(ex, 404, err("Carrera no encontrada"));
                else           responder(ex, 200, ok(c.toJson(), "Carrera obtenida correctamente"));
            } else if ("POST".equals(met)) {
                Carrera c = carreraN.create(parseBody(leerBody(ex)));
                responder(ex, 201, ok(c.toJson(), "Carrera creada correctamente"));
            } else if ("PUT".equals(met) && id != null) {
                Carrera c = carreraN.update(id, parseBody(leerBody(ex)));
                if (c == null) responder(ex, 404, err("Carrera no encontrada"));
                else           responder(ex, 200, ok(c.toJson(), "Carrera actualizada correctamente"));
            } else if ("DELETE".equals(met) && id != null) {
                boolean ok = carreraN.delete(id);
                if (!ok) responder(ex, 404, err("Carrera no encontrada"));
                else     responder(ex, 200, ok("null", "Carrera eliminada correctamente"));
            } else {
                responder(ex, 405, err("Metodo no permitido"));
            }
        } catch (Exception e) {
            responder(ex, 500, err("Error del servidor: " + e.getMessage()));
        }
    }

    public void handleFacultad(HttpExchange ex) throws IOException {
        setCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); return; }

        String[] seg = ex.getRequestURI().getPath().split("/");
        Integer  id  = seg.length > 2 && !seg[2].isEmpty() ? parseInt(seg[2]) : null;
        String   met = ex.getRequestMethod();

        try {
            if ("GET".equals(met) && id == null) {
                List<Facultad> lista = facultadN.getAll();
                responder(ex, 200, ok(listaJsonF(lista), "Facultades obtenidas correctamente"));
            } else if ("GET".equals(met) && id != null) {
                Facultad f = facultadN.getById(id);
                if (f == null) responder(ex, 404, err("Facultad no encontrada"));
                else           responder(ex, 200, ok(f.toJson(), "Facultad obtenida correctamente"));
            } else if ("POST".equals(met)) {
                Facultad f = facultadN.create(parseBody(leerBody(ex)));
                responder(ex, 201, ok(f.toJson(), "Facultad creada correctamente"));
            } else if ("PUT".equals(met) && id != null) {
                Facultad f = facultadN.update(id, parseBody(leerBody(ex)));
                if (f == null) responder(ex, 404, err("Facultad no encontrada"));
                else           responder(ex, 200, ok(f.toJson(), "Facultad actualizada correctamente"));
            } else if ("DELETE".equals(met) && id != null) {
                boolean ok = facultadN.delete(id);
                if (!ok) responder(ex, 404, err("Facultad no encontrada"));
                else     responder(ex, 200, ok("null", "Facultad eliminada correctamente"));
            } else {
                responder(ex, 405, err("Metodo no permitido"));
            }
        } catch (Exception e) {
            responder(ex, 500, err("Error del servidor: " + e.getMessage()));
        }
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private static String listaJson(List<Carrera> lista) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < lista.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(lista.get(i).toJson());
        }
        return sb.append("]").toString();
    }

    private static String listaJsonF(List<Facultad> lista) {
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
