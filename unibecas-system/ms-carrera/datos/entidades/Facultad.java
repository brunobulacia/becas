package datos.entidades;

public class Facultad {
    private int    id;
    private String nombre;

    public Facultad() {}

    public Facultad(int id, String nombre) {
        this.id     = id;
        this.nombre = nombre;
    }

    public int    getId()     { return id; }
    public String getNombre() { return nombre; }

    public void setId(int id)            { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String toJson() {
        return "{\"id\":" + id + ",\"nombre\":\"" + esc(nombre) + "\"}";
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
