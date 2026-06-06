package negocio;

import datos.entidades.Solicitud;
import java.util.ArrayList;
import java.util.List;

public class ValidacionContext {

    private List<ValidacionSolicitudStrategy> estrategias;

    public ValidacionContext() {
        this.estrategias = new ArrayList<>();
    }

    public void agregarEstrategia(ValidacionSolicitudStrategy estrategia) {
        this.estrategias.add(estrategia);
    }

    public void ejecutar(Solicitud solicitud) throws Exception {
        for (ValidacionSolicitudStrategy estrategia : estrategias) {
            estrategia.validar(solicitud);
        }
    }
}
