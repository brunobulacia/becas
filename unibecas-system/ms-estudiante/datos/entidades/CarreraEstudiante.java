package datos.entidades;

public class CarreraEstudiante {
    private int    id;
    private int    idEstudiante;
    private int    idCarrera;
    private String fechaInscripcion;
    private String estudianteNombre;
    private String estudianteApellido;
    private String carreraNombre;

    public CarreraEstudiante() {}

    public CarreraEstudiante(int id, int idEstudiante, int idCarrera, String fechaInscripcion,
                              String estudianteNombre, String estudianteApellido, String carreraNombre) {
        this.id                  = id;
        this.idEstudiante        = idEstudiante;
        this.idCarrera           = idCarrera;
        this.fechaInscripcion    = fechaInscripcion;
        this.estudianteNombre    = estudianteNombre;
        this.estudianteApellido  = estudianteApellido;
        this.carreraNombre       = carreraNombre;
    }

    public int    getId()                  { return id; }
    public int    getIdEstudiante()        { return idEstudiante; }
    public int    getIdCarrera()           { return idCarrera; }
    public String getFechaInscripcion()    { return fechaInscripcion; }
    public String getEstudianteNombre()    { return estudianteNombre; }
    public String getEstudianteApellido()  { return estudianteApellido; }
    public String getCarreraNombre()       { return carreraNombre; }

    public void setId(int id)                          { this.id = id; }
    public void setIdEstudiante(int ie)                { this.idEstudiante = ie; }
    public void setIdCarrera(int ic)                   { this.idCarrera = ic; }
    public void setFechaInscripcion(String f)          { this.fechaInscripcion = f; }
    public void setEstudianteNombre(String en)         { this.estudianteNombre = en; }
    public void setEstudianteApellido(String ea)       { this.estudianteApellido = ea; }
    public void setCarreraNombre(String cn)            { this.carreraNombre = cn; }

    public String toJson() {
        return "{\"id\":" + id
            + ",\"id_estudiante\":"     + idEstudiante
            + ",\"id_carrera\":"         + idCarrera
            + ",\"fecha_inscripcion\":\"" + esc(fechaInscripcion) + "\""
            + (estudianteNombre   != null ? ",\"estudiante_nombre\":\""   + esc(estudianteNombre)   + "\"" : "")
            + (estudianteApellido != null ? ",\"estudiante_apellido\":\"" + esc(estudianteApellido) + "\"" : "")
            + (carreraNombre      != null ? ",\"carrera_nombre\":\""      + esc(carreraNombre)      + "\"" : "")
            + "}";
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
