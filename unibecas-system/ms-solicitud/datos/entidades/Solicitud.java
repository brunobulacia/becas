package datos.entidades;

public class Solicitud {
    private int    id;
    private String fechaSolicitud;
    private String estado;
    private String observaciones;
    private int    idEstudiante;
    private int    idConvocatoria;
    private String convocatoriaNombre;
    private String convocatoriaPeriodo;
    private String estudianteNombre;
    private String estudianteCodigo;

    public Solicitud() {}

    public Solicitud(int id, String fechaSolicitud, String estado, String observaciones,
                     int idEstudiante, int idConvocatoria, String convocatoriaNombre, String convocatoriaPeriodo) {
        this.id                  = id;
        this.fechaSolicitud      = fechaSolicitud;
        this.estado              = estado;
        this.observaciones       = observaciones;
        this.idEstudiante        = idEstudiante;
        this.idConvocatoria      = idConvocatoria;
        this.convocatoriaNombre  = convocatoriaNombre;
        this.convocatoriaPeriodo = convocatoriaPeriodo;
    }

    public int    getId()                  { return id; }
    public String getFechaSolicitud()      { return fechaSolicitud; }
    public String getEstado()              { return estado; }
    public String getObservaciones()       { return observaciones; }
    public int    getIdEstudiante()        { return idEstudiante; }
    public int    getIdConvocatoria()      { return idConvocatoria; }
    public String getConvocatoriaNombre()  { return convocatoriaNombre; }
    public String getConvocatoriaPeriodo() { return convocatoriaPeriodo; }
    public String getEstudianteNombre()    { return estudianteNombre; }
    public String getEstudianteCodigo()    { return estudianteCodigo; }

    public void setId(int id)                          { this.id = id; }
    public void setFechaSolicitud(String f)            { this.fechaSolicitud = f; }
    public void setEstado(String e)                    { this.estado = e; }
    public void setObservaciones(String o)             { this.observaciones = o; }
    public void setIdEstudiante(int ie)                { this.idEstudiante = ie; }
    public void setIdConvocatoria(int ic)              { this.idConvocatoria = ic; }
    public void setConvocatoriaNombre(String cn)       { this.convocatoriaNombre = cn; }
    public void setConvocatoriaPeriodo(String cp)      { this.convocatoriaPeriodo = cp; }
    public void setEstudianteNombre(String en)         { this.estudianteNombre = en; }
    public void setEstudianteCodigo(String ec)         { this.estudianteCodigo = ec; }

    public String toJson() {
        return "{\"id\":" + id
            + ",\"fecha_solicitud\":\"" + esc(fechaSolicitud)      + "\""
            + ",\"estado\":\""          + esc(estado)              + "\""
            + ",\"observaciones\":\""   + esc(observaciones)       + "\""
            + ",\"id_estudiante\":"     + idEstudiante
            + ",\"id_convocatoria\":"   + idConvocatoria
            + (convocatoriaNombre  != null ? ",\"convocatoria_nombre\":\""  + esc(convocatoriaNombre)  + "\"" : "")
            + (convocatoriaPeriodo != null ? ",\"convocatoria_periodo\":\"" + esc(convocatoriaPeriodo) + "\"" : "")
            + (estudianteNombre    != null ? ",\"estudiante_nombre\":\""    + esc(estudianteNombre)    + "\"" : "")
            + (estudianteCodigo    != null ? ",\"estudiante_codigo\":\""    + esc(estudianteCodigo)    + "\"" : "")
            + "}";
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
