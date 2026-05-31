package negocio;

import datos.TipoBecaDao;
import datos.entidades.TipoBeca;
import java.util.*;

public class TipoBecaN {

    public List<TipoBeca> getAll() throws Exception {
        return TipoBecaDao.getAll();
    }

    public TipoBeca getById(int id) throws Exception {
        return TipoBecaDao.getById(id);
    }

    public TipoBeca create(Map<String, String> d) throws Exception {
        TipoBeca tb = new TipoBeca();
        tb.setNombre(d.get("nombre"));
        int id = TipoBecaDao.create(tb);
        tb.setId(id);
        return tb;
    }

    public TipoBeca update(int id, Map<String, String> d) throws Exception {
        TipoBeca tb = new TipoBeca();
        tb.setNombre(d.get("nombre"));
        boolean ok = TipoBecaDao.update(id, tb);
        if (!ok) return null;
        tb.setId(id);
        return tb;
    }

    public boolean delete(int id) throws Exception {
        return TipoBecaDao.delete(id);
    }
}
