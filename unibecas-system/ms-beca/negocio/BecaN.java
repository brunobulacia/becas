package negocio;

import datos.BecaDao;
import datos.entidades.Beca;
import java.util.*;

public class BecaN {

    public List<Beca> getAll() throws Exception {
        return BecaDao.getAll();
    }

    public Beca getById(int id) throws Exception {
        return BecaDao.getById(id);
    }

    public Beca create(Map<String, String> d) throws Exception {
        Beca b = new Beca();
        b.setNombre(d.get("nombre"));
        b.setDescripcion(d.get("descripcion"));
        b.setPorcentaje(Double.parseDouble(d.getOrDefault("porcentaje", "0")));
        b.setActivo(Boolean.parseBoolean(d.getOrDefault("activo", "true")));
        b.setIdTipob(Integer.parseInt(d.getOrDefault("id_tipob", "0")));
        int id = BecaDao.create(b);
        b.setId(id);
        return b;
    }

    public Beca update(int id, Map<String, String> d) throws Exception {
        Beca b = new Beca();
        b.setNombre(d.get("nombre"));
        b.setDescripcion(d.get("descripcion"));
        b.setPorcentaje(Double.parseDouble(d.getOrDefault("porcentaje", "0")));
        b.setActivo(Boolean.parseBoolean(d.getOrDefault("activo", "true")));
        b.setIdTipob(Integer.parseInt(d.getOrDefault("id_tipob", "0")));
        boolean ok = BecaDao.update(id, b);
        if (!ok) return null;
        b.setId(id);
        return b;
    }

    public boolean delete(int id) throws Exception {
        return BecaDao.delete(id);
    }
}
