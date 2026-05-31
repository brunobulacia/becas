package negocio.controlador;

import com.sun.net.httpserver.*;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class CarreraServidor {

    private static final int PUERTO = 3001;

    public static void main(String[] args) throws IOException {
        HttpServer servidor = HttpServer.create(new InetSocketAddress(PUERTO), 0);
        CarreraController controller = new CarreraController();
        servidor.createContext("/carreras",  controller::handleCarrera);
        servidor.createContext("/facultades", controller::handleFacultad);
        servidor.setExecutor(Executors.newFixedThreadPool(10));
        servidor.start();
        System.out.println("ms-carrera corriendo en http://localhost:" + PUERTO);
    }
}
