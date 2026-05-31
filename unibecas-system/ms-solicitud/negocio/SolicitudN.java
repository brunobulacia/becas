package negocio;

import datos.SolicitudDao;
import datos.entidades.Solicitud;
import java.io.*;
import java.net.*;
import java.util.*;
import java.util.regex.*;

public class SolicitudN {

    public List<Solicitud> getAll() throws Exception {
        List<Solicitud> lista = SolicitudDao.getAll();
        enriquecer(lista);
        return lista;
    }

    public Solicitud getById(int id) throws Exception {
        Solicitud s = SolicitudDao.getById(id);
        if (s != null) enriquecer(List.of(s));
        return s;
    }

    public Solicitud create(Map<String, String> d) throws Exception {
        Solicitud s = new Solicitud();
        s.setFechaSolicitud(d.get("fecha_solicitud"));
        s.setEstado("PENDIENTE");
        s.setObservaciones(d.get("observaciones"));
        s.setIdEstudiante(Integer.parseInt(d.getOrDefault("id_estudiante", "0")));
        s.setIdConvocatoria(Integer.parseInt(d.getOrDefault("id_convocatoria", "0")));
        int id = SolicitudDao.create(s);
        s.setId(id);
        return s;
    }

    public Solicitud update(int id, Map<String, String> d) throws Exception {
        Solicitud s = new Solicitud();
        s.setEstado(d.get("estado"));
        s.setObservaciones(d.get("observaciones"));
        boolean ok = SolicitudDao.update(id, s);
        if (!ok) return null;
        s.setId(id);
        return s;
    }

    public boolean delete(int id) throws Exception {
        return SolicitudDao.delete(id);
    }

    // Enriquece las solicitudes con datos del ms-estudiante via HTTP
    private static void enriquecer(List<Solicitud> lista) {
        Set<Integer> ids = new HashSet<>();
        for (Solicitud s : lista) ids.add(s.getIdEstudiante());
        Map<Integer, String[]> estudiantesMap = new HashMap<>();
        for (int idEst : ids) {
            String[] datos = fetchEstudiante(idEst);
            if (datos != null) estudiantesMap.put(idEst, datos);
        }
        for (Solicitud s : lista) {
            String[] datos = estudiantesMap.get(s.getIdEstudiante());
            if (datos != null) {
                s.setEstudianteNombre(datos[0]);
                s.setEstudianteCodigo(datos[1]);
            } else {
                s.setEstudianteNombre("Desconocido");
            }
        }
    }

    // Retorna [nombreCompleto, codigop] o null si falla
    private static String[] fetchEstudiante(int id) {
        try {
            URL url = new URL("http://localhost:3003/estudiantes/" + id);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);
            String body = new String(conn.getInputStream().readAllBytes());
            Matcher mn = Pattern.compile("\"nombre\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
            Matcher ma = Pattern.compile("\"apellido\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
            Matcher mc = Pattern.compile("\"codigop\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
            String nombre   = mn.find() ? mn.group(1) : "";
            String apellido = ma.find() ? ma.group(1) : "";
            String codigo   = mc.find() ? mc.group(1) : "";
            return new String[]{nombre + " " + apellido, codigo};
        } catch (Exception e) {
            return null;
        }
    }
}
