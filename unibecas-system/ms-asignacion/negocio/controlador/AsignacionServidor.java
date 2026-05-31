package negocio.controlador;

import com.sun.net.httpserver.*;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class AsignacionServidor {

    private static final int PUERTO = 3006;

    public static void main(String[] args) throws IOException {
        HttpServer servidor = HttpServer.create(new InetSocketAddress(PUERTO), 0);
        AsignacionController controller = new AsignacionController();
        servidor.createContext("/asignaciones", controller::handle);
        servidor.setExecutor(Executors.newFixedThreadPool(10));
        servidor.start();
        System.out.println("ms-asignacion corriendo en http://localhost:" + PUERTO);
    }
}
