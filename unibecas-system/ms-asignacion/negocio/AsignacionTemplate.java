package negocio;

import datos.AsignacionDao;
import datos.entidades.Asignacion;
import java.util.Map;

public abstract class AsignacionTemplate {

    public final Asignacion ejecutar(Map<String, String> d) throws Exception {
        Asignacion a = construirAsignacion(d);
        validarSolicitud(a);
        actualizarEstadoSolicitud(a);
        int id = AsignacionDao.create(a);
        a.setId(id);
        enriquecer(a);
        return a;
    }

    protected abstract Asignacion construirAsignacion(Map<String, String> d) throws Exception;
    protected abstract void validarSolicitud(Asignacion a) throws Exception;
    protected abstract void actualizarEstadoSolicitud(Asignacion a) throws Exception;
    protected abstract void enriquecer(Asignacion a) throws Exception;
}
