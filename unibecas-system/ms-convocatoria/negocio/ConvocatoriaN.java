package negocio;

import datos.ConvocatoriaDao;
import datos.entidades.Convocatoria;
import java.util.*;

public class ConvocatoriaN {

    public List<Convocatoria> getAll() throws Exception {
        return ConvocatoriaDao.getAll();
    }

    public Convocatoria getById(int id) throws Exception {
        return ConvocatoriaDao.getById(id);
    }

    public Convocatoria create(Map<String, String> d) throws Exception {
        Convocatoria conv = new Convocatoria();
        conv.setDescripcion(d.get("descripcion"));
        conv.setPeriodo(d.get("periodo"));
        conv.setFechaInicio(d.get("fecha_inicio"));
        conv.setFechaFin(d.get("fecha_fin"));
        conv.setCupos(Integer.parseInt(d.getOrDefault("cupos", "0")));
        conv.setIdBeca(Integer.parseInt(d.getOrDefault("id_beca", "0")));
        int id = ConvocatoriaDao.create(conv);
        conv.setId(id);
        return conv;
    }

    public Convocatoria update(int id, Map<String, String> d) throws Exception {
        Convocatoria conv = new Convocatoria();
        conv.setDescripcion(d.get("descripcion"));
        conv.setPeriodo(d.get("periodo"));
        conv.setFechaInicio(d.get("fecha_inicio"));
        conv.setFechaFin(d.get("fecha_fin"));
        conv.setCupos(Integer.parseInt(d.getOrDefault("cupos", "0")));
        conv.setIdBeca(Integer.parseInt(d.getOrDefault("id_beca", "0")));
        boolean ok = ConvocatoriaDao.update(id, conv);
        if (!ok) return null;
        conv.setId(id);
        return conv;
    }

    public boolean delete(int id) throws Exception {
        return ConvocatoriaDao.delete(id);
    }
}
