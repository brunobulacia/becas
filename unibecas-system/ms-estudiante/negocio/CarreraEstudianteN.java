package negocio;

import datos.CarreraEstudianteDao;
import datos.entidades.CarreraEstudiante;
import java.util.*;

public class CarreraEstudianteN {

    public List<CarreraEstudiante> getAll() throws Exception {
        return CarreraEstudianteDao.getAll();
    }

    public List<CarreraEstudiante> getByEstudiante(int idEstudiante) throws Exception {
        return CarreraEstudianteDao.getByEstudiante(idEstudiante);
    }

    public CarreraEstudiante create(int idEstudiante, Map<String, String> d) throws Exception {
        CarreraEstudiante ce = new CarreraEstudiante();
        ce.setIdEstudiante(idEstudiante);
        ce.setIdCarrera(Integer.parseInt(d.getOrDefault("id_carrera", "0")));
        ce.setFechaInscripcion(d.getOrDefault("fecha_inscripcion",
            new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())));
        CarreraEstudianteDao.create(ce);
        return ce;
    }

    public boolean delete(int idEstudiante, int idCarrera) throws Exception {
        return CarreraEstudianteDao.delete(idEstudiante, idCarrera);
    }
}
