package datos.entidades;

public class Asignacion {
    private int    id;
    private String descripcion;
    private String periodo;
    private String fechaInicio;
    private String fechaFin;
    private int    idSolicitud;
    private String becaNombre;
    private String convocatoriaPeriodo;
    private int    idEstudiante;
    private String estudianteNombre;

    public Asignacion() {}

    public Asignacion(int id, String descripcion, String periodo, String fechaInicio, String fechaFin,
                      int idSolicitud, String becaNombre, String convocatoriaPeriodo, int idEstudiante) {
        this.id                  = id;
        this.descripcion         = descripcion;
        this.periodo             = periodo;
        this.fechaInicio         = fechaInicio;
        this.fechaFin            = fechaFin;
        this.idSolicitud         = idSolicitud;
        this.becaNombre          = becaNombre;
        this.convocatoriaPeriodo = convocatoriaPeriodo;
        this.idEstudiante        = idEstudiante;
    }

    public int    getId()                  { return id; }
    public String getDescripcion()         { return descripcion; }
    public String getPeriodo()             { return periodo; }
    public String getFechaInicio()         { return fechaInicio; }
    public String getFechaFin()            { return fechaFin; }
    public int    getIdSolicitud()         { return idSolicitud; }
    public String getBecaNombre()          { return becaNombre; }
    public String getConvocatoriaPeriodo() { return convocatoriaPeriodo; }
    public int    getIdEstudiante()        { return idEstudiante; }
    public String getEstudianteNombre()    { return estudianteNombre; }

    public void setId(int id)                          { this.id = id; }
    public void setDescripcion(String d)               { this.descripcion = d; }
    public void setPeriodo(String p)                   { this.periodo = p; }
    public void setFechaInicio(String fi)              { this.fechaInicio = fi; }
    public void setFechaFin(String ff)                 { this.fechaFin = ff; }
    public void setIdSolicitud(int is)                 { this.idSolicitud = is; }
    public void setBecaNombre(String bn)               { this.becaNombre = bn; }
    public void setConvocatoriaPeriodo(String cp)      { this.convocatoriaPeriodo = cp; }
    public void setIdEstudiante(int ie)                { this.idEstudiante = ie; }
    public void setEstudianteNombre(String en)         { this.estudianteNombre = en; }

    public String toJson() {
        return "{\"id\":" + id
            + ",\"descripcion\":\""          + esc(descripcion)         + "\""
            + ",\"periodo\":\""              + esc(periodo)             + "\""
            + ",\"fecha_inicio\":\""         + esc(fechaInicio)         + "\""
            + ",\"fecha_fin\":\""            + esc(fechaFin)            + "\""
            + ",\"id_solicitud\":"           + idSolicitud
            + (becaNombre          != null ? ",\"beca_nombre\":\""           + esc(becaNombre)          + "\"" : "")
            + (convocatoriaPeriodo != null ? ",\"convocatoria_periodo\":\""  + esc(convocatoriaPeriodo) + "\"" : "")
            + (estudianteNombre    != null ? ",\"estudiante_nombre\":\""     + esc(estudianteNombre)    + "\"" : "")
            + "}";
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
