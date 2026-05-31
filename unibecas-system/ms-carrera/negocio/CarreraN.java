package negocio;

import datos.CarreraDao;
import datos.entidades.Carrera;
import java.util.*;

public class CarreraN {

    public List<Carrera> getAll() throws Exception {
        return CarreraDao.getAll();
    }

    public Carrera getById(int id) throws Exception {
        return CarreraDao.getById(id);
    }

    public Carrera create(Map<String, String> d) throws Exception {
        Carrera carrera = new Carrera();
        carrera.setNombre(d.get("nombre"));
        carrera.setIdFacultad(Integer.parseInt(d.getOrDefault("id_facultad", "0")));
        int id = CarreraDao.create(carrera);
        carrera.setId(id);
        return carrera;
    }

    public Carrera update(int id, Map<String, String> d) throws Exception {
        Carrera carrera = new Carrera();
        carrera.setNombre(d.get("nombre"));
        carrera.setIdFacultad(Integer.parseInt(d.getOrDefault("id_facultad", "0")));
        boolean ok = CarreraDao.update(id, carrera);
        if (!ok) return null;
        carrera.setId(id);
        return carrera;
    }

    public boolean delete(int id) throws Exception {
        return CarreraDao.delete(id);
    }
}
