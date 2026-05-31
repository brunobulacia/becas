package negocio;

import datos.EstudianteDao;
import datos.entidades.Estudiante;
import java.util.*;

public class EstudianteN {

    public List<Estudiante> getAll() throws Exception {
        return EstudianteDao.getAll();
    }

    public Estudiante getById(int id) throws Exception {
        return EstudianteDao.getById(id);
    }

    public Estudiante create(Map<String, String> d) throws Exception {
        Estudiante e = new Estudiante();
        e.setCodigop(d.get("codigop"));
        e.setNombre(d.get("nombre"));
        e.setApellido(d.get("apellido"));
        e.setEmail(d.get("email"));
        e.setPpa(Double.parseDouble(d.getOrDefault("ppa", "0")));
        e.setActivo(Boolean.parseBoolean(d.getOrDefault("activo", "true")));
        int id = EstudianteDao.create(e);
        e.setId(id);
        return e;
    }

    public Estudiante update(int id, Map<String, String> d) throws Exception {
        Estudiante e = new Estudiante();
        e.setCodigop(d.get("codigop"));
        e.setNombre(d.get("nombre"));
        e.setApellido(d.get("apellido"));
        e.setEmail(d.get("email"));
        e.setPpa(Double.parseDouble(d.getOrDefault("ppa", "0")));
        e.setActivo(Boolean.parseBoolean(d.getOrDefault("activo", "true")));
        boolean ok = EstudianteDao.update(id, e);
        if (!ok) return null;
        e.setId(id);
        return e;
    }

    public boolean delete(int id) throws Exception {
        return EstudianteDao.delete(id);
    }
}
