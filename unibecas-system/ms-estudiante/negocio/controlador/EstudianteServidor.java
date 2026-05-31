package negocio.controlador;

import com.sun.net.httpserver.*;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class EstudianteServidor {

    private static final int PUERTO = 3003;

    public static void main(String[] args) throws IOException {
        HttpServer servidor = HttpServer.create(new InetSocketAddress(PUERTO), 0);
        EstudianteController controller = new EstudianteController();
        servidor.createContext("/estudiantes", controller::handleEstudiante);
        servidor.setExecutor(Executors.newFixedThreadPool(10));
        servidor.start();
        System.out.println("ms-estudiante corriendo en http://localhost:" + PUERTO);
    }
}
