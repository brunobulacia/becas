package datos.entidades;

public class Beca {
    private int    id;
    private String nombre;
    private String descripcion;
    private double porcentaje;
    private boolean activo;
    private int    idTipob;
    private String tipoNombre;

    public Beca() {}

    public Beca(int id, String nombre, String descripcion, double porcentaje, boolean activo, int idTipob, String tipoNombre) {
        this.id          = id;
        this.nombre      = nombre;
        this.descripcion = descripcion;
        this.porcentaje  = porcentaje;
        this.activo      = activo;
        this.idTipob     = idTipob;
        this.tipoNombre  = tipoNombre;
    }

    public int     getId()          { return id; }
    public String  getNombre()      { return nombre; }
    public String  getDescripcion() { return descripcion; }
    public double  getPorcentaje()  { return porcentaje; }
    public boolean isActivo()       { return activo; }
    public int     getIdTipob()     { return idTipob; }
    public String  getTipoNombre()  { return tipoNombre; }

    public void setId(int id)                  { this.id = id; }
    public void setNombre(String nombre)       { this.nombre = nombre; }
    public void setDescripcion(String d)       { this.descripcion = d; }
    public void setPorcentaje(double p)        { this.porcentaje = p; }
    public void setActivo(boolean a)           { this.activo = a; }
    public void setIdTipob(int idTipob)        { this.idTipob = idTipob; }
    public void setTipoNombre(String tn)       { this.tipoNombre = tn; }

    public String toJson() {
        return "{\"id\":" + id
            + ",\"nombre\":\""      + esc(nombre)      + "\""
            + ",\"descripcion\":\""  + esc(descripcion)  + "\""
            + ",\"porcentaje\":"     + porcentaje
            + ",\"activo\":"         + activo
            + ",\"id_tipob\":"       + idTipob
            + (tipoNombre != null ? ",\"tipo_nombre\":\"" + esc(tipoNombre) + "\"" : "")
            + "}";
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
