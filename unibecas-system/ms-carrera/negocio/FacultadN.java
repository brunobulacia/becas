package negocio;

import datos.FacultadDao;
import datos.entidades.Facultad;
import java.util.*;

public class FacultadN {

    public List<Facultad> getAll() throws Exception {
        return FacultadDao.getAll();
    }

    public Facultad getById(int id) throws Exception {
        return FacultadDao.getById(id);
    }

    public Facultad create(Map<String, String> d) throws Exception {
        Facultad f = new Facultad();
        f.setNombre(d.get("nombre"));
        int id = FacultadDao.create(f);
        f.setId(id);
        return f;
    }

    public Facultad update(int id, Map<String, String> d) throws Exception {
        Facultad f = new Facultad();
        f.setNombre(d.get("nombre"));
        boolean ok = FacultadDao.update(id, f);
        if (!ok) return null;
        f.setId(id);
        return f;
    }

    public boolean delete(int id) throws Exception {
        return FacultadDao.delete(id);
    }
}
