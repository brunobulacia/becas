package negocio.controlador;

import com.sun.net.httpserver.*;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class BecaServidor {

    private static final int PUERTO = 3002;

    public static void main(String[] args) throws IOException {
        HttpServer servidor = HttpServer.create(new InetSocketAddress(PUERTO), 0);
        BecaController controller = new BecaController();
        servidor.createContext("/becas",      controller::handleBeca);
        servidor.createContext("/tipos-beca", controller::handleTipoBeca);
        servidor.setExecutor(Executors.newFixedThreadPool(10));
        servidor.start();
        System.out.println("ms-beca corriendo en http://localhost:" + PUERTO);
    }
}
