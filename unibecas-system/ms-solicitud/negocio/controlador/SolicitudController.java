package negocio.controlador;

import com.sun.net.httpserver.*;
import negocio.SolicitudN;
import datos.entidades.Solicitud;
import java.io.*;
import java.util.*;
import java.util.regex.*;

public class SolicitudController {

    private final SolicitudN solicitudN = new SolicitudN();

    public void handle(HttpExchange ex) throws IOException {
        setCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); return; }

        String[] seg = ex.getRequestURI().getPath().split("/");
        Integer  id  = seg.length > 2 && !seg[2].isEmpty() ? parseInt(seg[2]) : null;
        String   met = ex.getRequestMethod();

        try {
            if ("GET".equals(met) && id == null) {
                List<Solicitud> lista = solicitudN.getAll();
                responder(ex, 200, ok(listaJson(lista), "Solicitudes obtenidas correctamente"));
            } else if ("GET".equals(met) && id != null) {
                Solicitud s = solicitudN.getById(id);
                if (s == null) responder(ex, 404, err("Solicitud no encontrada"));
                else           responder(ex, 200, ok(s.toJson(), "Solicitud obtenida correctamente"));
            } else if ("POST".equals(met)) {
                Solicitud s = solicitudN.create(parseBody(leerBody(ex)));
                responder(ex, 201, ok(s.toJson(), "Solicitud creada correctamente"));
            } else if ("PUT".equals(met) && id != null) {
                Solicitud s = solicitudN.update(id, parseBody(leerBody(ex)));
                if (s == null) responder(ex, 404, err("Solicitud no encontrada"));
                else           responder(ex, 200, ok(s.toJson(), "Solicitud actualizada correctamente"));
            } else if ("DELETE".equals(met) && id != null) {
                boolean ok = solicitudN.delete(id);
                if (!ok) responder(ex, 404, err("Solicitud no encontrada"));
                else     responder(ex, 200, ok("null", "Solicitud eliminada correctamente"));
            } else {
                responder(ex, 405, err("Metodo no permitido"));
            }
        } catch (Exception e) {
            responder(ex, 500, err("Error del servidor: " + e.getMessage()));
        }
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private static String listaJson(List<Solicitud> lista) {
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
