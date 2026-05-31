package datos.entidades;

public class Convocatoria {
    private int    id;
    private String descripcion;
    private String periodo;
    private String fechaInicio;
    private String fechaFin;
    private int    cupos;
    private int    idBeca;
    private String becaNombre;
    private int    cuposDisponibles;

    public Convocatoria() {}

    public Convocatoria(int id, String descripcion, String periodo, String fechaInicio,
                        String fechaFin, int cupos, int idBeca, String becaNombre, int cuposDisponibles) {
        this.id               = id;
        this.descripcion      = descripcion;
        this.periodo          = periodo;
        this.fechaInicio      = fechaInicio;
        this.fechaFin         = fechaFin;
        this.cupos            = cupos;
        this.idBeca           = idBeca;
        this.becaNombre       = becaNombre;
        this.cuposDisponibles = cuposDisponibles;
    }

    public int    getId()               { return id; }
    public String getDescripcion()      { return descripcion; }
    public String getPeriodo()          { return periodo; }
    public String getFechaInicio()      { return fechaInicio; }
    public String getFechaFin()         { return fechaFin; }
    public int    getCupos()            { return cupos; }
    public int    getIdBeca()           { return idBeca; }
    public String getBecaNombre()       { return becaNombre; }
    public int    getCuposDisponibles() { return cuposDisponibles; }

    public void setId(int id)                      { this.id = id; }
    public void setDescripcion(String d)           { this.descripcion = d; }
    public void setPeriodo(String p)               { this.periodo = p; }
    public void setFechaInicio(String fi)          { this.fechaInicio = fi; }
    public void setFechaFin(String ff)             { this.fechaFin = ff; }
    public void setCupos(int c)                    { this.cupos = c; }
    public void setIdBeca(int ib)                  { this.idBeca = ib; }
    public void setBecaNombre(String bn)           { this.becaNombre = bn; }
    public void setCuposDisponibles(int cd)        { this.cuposDisponibles = cd; }

    public String toJson() {
        return "{\"id\":" + id
            + ",\"descripcion\":\""       + esc(descripcion) + "\""
            + ",\"periodo\":\""           + esc(periodo)     + "\""
            + ",\"fecha_inicio\":\""      + esc(fechaInicio) + "\""
            + ",\"fecha_fin\":\""         + esc(fechaFin)    + "\""
            + ",\"cupos\":"               + cupos
            + ",\"id_beca\":"             + idBeca
            + (becaNombre != null ? ",\"beca_nombre\":\"" + esc(becaNombre) + "\"" : "")
            + ",\"cupos_disponibles\":"   + cuposDisponibles
            + "}";
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
