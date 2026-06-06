package negocio;

import datos.entidades.Solicitud;

public interface ValidacionSolicitudStrategy {
    void validar(Solicitud solicitud) throws Exception;
}
