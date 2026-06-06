package negocio;

import datos.AsignacionDao;
import datos.entidades.Asignacion;
import java.net.*;
import java.util.*;
import java.util.regex.*;

public class AsignacionN {

    // Patrón Template Method: delega la creación al template concreto
    private final AsignacionTemplate template;

    public AsignacionN() {
        this.template = new AsignacionAprobadaN();
    }

    public AsignacionN(AsignacionTemplate template) {
        this.template = template;
    }

    public List<Asignacion> getAll() throws Exception {
        List<Asignacion> lista = AsignacionDao.getAll();
        enriquecer(lista);
        return lista;
    }

    public Asignacion getById(int id) throws Exception {
        Asignacion a = AsignacionDao.getById(id);
        if (a != null) enriquecer(List.of(a));
        return a;
    }

    public Asignacion create(Map<String, String> d) throws Exception {
        return template.ejecutar(d);
    }

    public Asignacion update(int id, Map<String, String> d) throws Exception {
        Asignacion a = new Asignacion();
        a.setDescripcion(d.get("descripcion"));
        a.setPeriodo(d.get("periodo"));
        a.setFechaInicio(d.get("fecha_inicio"));
        a.setFechaFin(d.get("fecha_fin"));
        a.setIdSolicitud(Integer.parseInt(d.getOrDefault("id_solicitud", "0")));
        boolean ok = AsignacionDao.update(id, a);
        if (!ok) return null;
        a.setId(id);
        return a;
    }

    public boolean delete(int id) throws Exception {
        return AsignacionDao.delete(id);
    }

    // Enriquece con nombre de estudiante via ms-estudiante HTTP
    private static void enriquecer(List<Asignacion> lista) {
        Set<Integer> ids = new HashSet<>();
        for (Asignacion a : lista) ids.add(a.getIdEstudiante());
        Map<Integer, String> nombreMap = new HashMap<>();
        for (int idEst : ids) {
            String nombre = fetchNombreEstudiante(idEst);
            nombreMap.put(idEst, nombre != null ? nombre : "Desconocido");
        }
        for (Asignacion a : lista) {
            a.setEstudianteNombre(nombreMap.get(a.getIdEstudiante()));
        }
    }

    private static String fetchNombreEstudiante(int id) {
        try {
            URL url = new URL("http://localhost:3003/estudiantes/" + id);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);
            String body = new String(conn.getInputStream().readAllBytes());
            Matcher mn = Pattern.compile("\"nombre\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
            Matcher ma = Pattern.compile("\"apellido\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
            String nombre   = mn.find() ? mn.group(1) : "";
            String apellido = ma.find() ? ma.group(1) : "";
            return nombre + " " + apellido;
        } catch (Exception e) {
            return null;
        }
    }
}
