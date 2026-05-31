package negocio.controlador;

import com.sun.net.httpserver.*;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class SolicitudServidor {

    private static final int PUERTO = 3005;

    public static void main(String[] args) throws IOException {
        HttpServer servidor = HttpServer.create(new InetSocketAddress(PUERTO), 0);
        SolicitudController controller = new SolicitudController();
        servidor.createContext("/solicitudes", controller::handle);
        servidor.setExecutor(Executors.newFixedThreadPool(10));
        servidor.start();
        System.out.println("ms-solicitud corriendo en http://localhost:" + PUERTO);
    }
}
