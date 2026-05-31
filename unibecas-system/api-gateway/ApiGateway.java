import com.sun.net.httpserver.*;
import java.io.*;
import java.net.*;
import java.util.*;

public class ApiGateway {

    private static final int PORT = 3000;

    private static final Map<String, Integer> RUTAS = new LinkedHashMap<>();

    static {
        RUTAS.put("/api/facultades",   3001);
        RUTAS.put("/api/carreras",     3001);
        RUTAS.put("/api/tipos-beca",   3002);
        RUTAS.put("/api/becas",        3002);
        RUTAS.put("/api/estudiantes",  3003);
        RUTAS.put("/api/convocatorias",3004);
        RUTAS.put("/api/solicitudes",  3005);
        RUTAS.put("/api/asignaciones", 3006);
    }

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/", ApiGateway::manejar);
        server.setExecutor(java.util.concurrent.Executors.newFixedThreadPool(20));
        server.start();
        System.out.println("API Gateway corriendo en http://localhost:" + PORT);
    }

    private static void manejar(HttpExchange ex) throws IOException {
        setCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) {
            ex.sendResponseHeaders(204, -1);
            return;
        }

        String url = ex.getRequestURI().toString();
        Integer puerto = buscarRuta(url);

        if (puerto == null) {
            responder(ex, 404, "{\"success\":false,\"message\":\"Ruta no encontrada\"}");
            return;
        }

        String rutaDestino = url.substring("/api".length());
        proxy(ex, puerto, rutaDestino);
    }

    private static Integer buscarRuta(String url) {
        for (Map.Entry<String, Integer> entrada : RUTAS.entrySet()) {
            String prefijo = entrada.getKey();
            if (url.equals(prefijo) || url.startsWith(prefijo + "/") || url.startsWith(prefijo + "?")) {
                return entrada.getValue();
            }
        }
        return null;
    }

    private static void proxy(HttpExchange ex, int puerto, String ruta) throws IOException {
        try {
            URL destino = new URL("http://localhost:" + puerto + ruta);
            HttpURLConnection conn = (HttpURLConnection) destino.openConnection();
            conn.setRequestMethod(ex.getRequestMethod());
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("Content-Type", "application/json");

            if ("POST".equals(ex.getRequestMethod()) || "PUT".equals(ex.getRequestMethod())) {
                conn.setDoOutput(true);
                byte[] cuerpo = ex.getRequestBody().readAllBytes();
                conn.getOutputStream().write(cuerpo);
                conn.getOutputStream().flush();
            }

            int estado = conn.getResponseCode();
            InputStream stream = estado >= 400 ? conn.getErrorStream() : conn.getInputStream();
            byte[] respBytes = stream != null ? stream.readAllBytes() : new byte[0];

            setCors(ex);
            ex.getResponseHeaders().set("Content-Type", "application/json");
            ex.sendResponseHeaders(estado, respBytes.length);
            ex.getResponseBody().write(respBytes);

        } catch (Exception e) {
            String msg = "{\"success\":false,\"message\":\"Servicio no disponible en puerto " + puerto + "\"}";
            responder(ex, 503, msg);
        } finally {
            ex.getResponseBody().close();
        }
    }

    private static void setCors(HttpExchange ex) {
        Headers h = ex.getResponseHeaders();
        h.set("Access-Control-Allow-Origin",  "*");
        h.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static void responder(HttpExchange ex, int codigo, String json) throws IOException {
        setCors(ex);
        ex.getResponseHeaders().set("Content-Type", "application/json");
        byte[] bytes = json.getBytes();
        ex.sendResponseHeaders(codigo, bytes.length);
        ex.getResponseBody().write(bytes);
        ex.getResponseBody().close();
    }
}
