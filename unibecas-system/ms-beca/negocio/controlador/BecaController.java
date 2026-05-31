package negocio.controlador;

import com.sun.net.httpserver.*;
import negocio.BecaN;
import negocio.TipoBecaN;
import datos.entidades.Beca;
import datos.entidades.TipoBeca;
import java.io.*;
import java.util.*;
import java.util.regex.*;

public class BecaController {

    private final BecaN     becaN     = new BecaN();
    private final TipoBecaN tipoBecaN = new TipoBecaN();

    public void handleBeca(HttpExchange ex) throws IOException {
        setCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); return; }

        String path   = ex.getRequestURI().getPath();
        String[] seg  = path.split("/");
        Integer  id   = seg.length > 2 && !seg[2].isEmpty() ? parseInt(seg[2]) : null;
        String   met  = ex.getRequestMethod();

        try {
            if ("GET".equals(met) && id == null) {
                List<Beca> lista = becaN.getAll();
                responder(ex, 200, ok(listaJson(lista), "Becas obtenidas correctamente"));
            } else if ("GET".equals(met) && id != null) {
                Beca b = becaN.getById(id);
                if (b == null) responder(ex, 404, err("Beca no encontrada"));
                else           responder(ex, 200, ok(b.toJson(), "Beca obtenida correctamente"));
            } else if ("POST".equals(met)) {
                Beca b = becaN.create(parseBody(leerBody(ex)));
                responder(ex, 201, ok(b.toJson(), "Beca creada correctamente"));
            } else if ("PUT".equals(met) && id != null) {
                Beca b = becaN.update(id, parseBody(leerBody(ex)));
                if (b == null) responder(ex, 404, err("Beca no encontrada"));
                else           responder(ex, 200, ok(b.toJson(), "Beca actualizada correctamente"));
            } else if ("DELETE".equals(met) && id != null) {
                boolean ok = becaN.delete(id);
                if (!ok) responder(ex, 404, err("Beca no encontrada"));
                else     responder(ex, 200, ok("null", "Beca eliminada correctamente"));
            } else {
                responder(ex, 405, err("Metodo no permitido"));
            }
        } catch (Exception e) {
            responder(ex, 500, err("Error del servidor: " + e.getMessage()));
        }
    }

    public void handleTipoBeca(HttpExchange ex) throws IOException {
        setCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); return; }

        String path   = ex.getRequestURI().getPath();
        String[] seg  = path.split("/");
        Integer  id   = seg.length > 2 && !seg[2].isEmpty() ? parseInt(seg[2]) : null;
        String   met  = ex.getRequestMethod();

        try {
            if ("GET".equals(met) && id == null) {
                List<TipoBeca> lista = tipoBecaN.getAll();
                responder(ex, 200, ok(listaJsonTB(lista), "Tipos de beca obtenidos correctamente"));
            } else if ("GET".equals(met) && id != null) {
                TipoBeca tb = tipoBecaN.getById(id);
                if (tb == null) responder(ex, 404, err("Tipo de beca no encontrado"));
                else            responder(ex, 200, ok(tb.toJson(), "Tipo de beca obtenido correctamente"));
            } else if ("POST".equals(met)) {
                TipoBeca tb = tipoBecaN.create(parseBody(leerBody(ex)));
                responder(ex, 201, ok(tb.toJson(), "Tipo de beca creado correctamente"));
            } else if ("PUT".equals(met) && id != null) {
                TipoBeca tb = tipoBecaN.update(id, parseBody(leerBody(ex)));
                if (tb == null) responder(ex, 404, err("Tipo de beca no encontrado"));
                else            responder(ex, 200, ok(tb.toJson(), "Tipo de beca actualizado correctamente"));
            } else if ("DELETE".equals(met) && id != null) {
                boolean ok = tipoBecaN.delete(id);
                if (!ok) responder(ex, 404, err("Tipo de beca no encontrado"));
                else     responder(ex, 200, ok("null", "Tipo de beca eliminado correctamente"));
            } else {
                responder(ex, 405, err("Metodo no permitido"));
            }
        } catch (Exception e) {
            responder(ex, 500, err("Error del servidor: " + e.getMessage()));
        }
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private static String listaJson(List<Beca> lista) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < lista.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(lista.get(i).toJson());
        }
        return sb.append("]").toString();
    }

    private static String listaJsonTB(List<TipoBeca> lista) {
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
