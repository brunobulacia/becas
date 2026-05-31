package negocio.controlador;

import com.sun.net.httpserver.*;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class ConvocatoriaServidor {

    private static final int PUERTO = 3004;

    public static void main(String[] args) throws IOException {
        HttpServer servidor = HttpServer.create(new InetSocketAddress(PUERTO), 0);
        ConvocatoriaController controller = new ConvocatoriaController();
        servidor.createContext("/convocatorias", controller::handle);
        servidor.setExecutor(Executors.newFixedThreadPool(10));
        servidor.start();
        System.out.println("ms-convocatoria corriendo en http://localhost:" + PUERTO);
    }
}
