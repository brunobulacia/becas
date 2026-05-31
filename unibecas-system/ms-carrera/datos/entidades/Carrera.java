package datos.entidades;

public class Carrera {
    private int    id;
    private String nombre;
    private int    idFacultad;
    private String facultadNombre;

    public Carrera() {}

    public Carrera(int id, String nombre, int idFacultad, String facultadNombre) {
        this.id             = id;
        this.nombre         = nombre;
        this.idFacultad     = idFacultad;
        this.facultadNombre = facultadNombre;
    }

    public int    getId()             { return id; }
    public String getNombre()         { return nombre; }
    public int    getIdFacultad()     { return idFacultad; }
    public String getFacultadNombre() { return facultadNombre; }

    public void setId(int id)                      { this.id = id; }
    public void setNombre(String nombre)           { this.nombre = nombre; }
    public void setIdFacultad(int idFacultad)      { this.idFacultad = idFacultad; }
    public void setFacultadNombre(String fn)       { this.facultadNombre = fn; }

    public String toJson() {
        return "{\"id\":" + id
            + ",\"nombre\":\""          + esc(nombre)         + "\""
            + ",\"id_facultad\":"        + idFacultad
            + (facultadNombre != null ? ",\"facultad_nombre\":\"" + esc(facultadNombre) + "\"" : "")
            + "}";
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
