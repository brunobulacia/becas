package datos.entidades;

public class Estudiante {
    private int     id;
    private String  codigop;
    private String  nombre;
    private String  apellido;
    private String  email;
    private double  ppa;
    private boolean activo;
    private String  carreras;

    public Estudiante() {}

    public Estudiante(int id, String codigop, String nombre, String apellido,
                      String email, double ppa, boolean activo, String carreras) {
        this.id       = id;
        this.codigop  = codigop;
        this.nombre   = nombre;
        this.apellido = apellido;
        this.email    = email;
        this.ppa      = ppa;
        this.activo   = activo;
        this.carreras = carreras;
    }

    public int     getId()       { return id; }
    public String  getCodigop()  { return codigop; }
    public String  getNombre()   { return nombre; }
    public String  getApellido() { return apellido; }
    public String  getEmail()    { return email; }
    public double  getPpa()      { return ppa; }
    public boolean isActivo()    { return activo; }
    public String  getCarreras() { return carreras; }

    public void setId(int id)              { this.id = id; }
    public void setCodigop(String c)       { this.codigop = c; }
    public void setNombre(String n)        { this.nombre = n; }
    public void setApellido(String a)      { this.apellido = a; }
    public void setEmail(String e)         { this.email = e; }
    public void setPpa(double p)           { this.ppa = p; }
    public void setActivo(boolean a)       { this.activo = a; }
    public void setCarreras(String c)      { this.carreras = c; }

    public String toJson() {
        return "{\"id\":" + id
            + ",\"codigop\":\""  + esc(codigop)  + "\""
            + ",\"nombre\":\""   + esc(nombre)   + "\""
            + ",\"apellido\":\"" + esc(apellido) + "\""
            + ",\"email\":\""    + esc(email)    + "\""
            + ",\"ppa\":"        + ppa
            + ",\"activo\":"     + activo
            + (carreras != null ? ",\"carreras\":\"" + esc(carreras) + "\"" : "")
            + "}";
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
