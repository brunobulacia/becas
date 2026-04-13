const http = require("http");
const estudianteRoutes = require("./negocio/routes/estudiante.routes");
const carreraEstudianteRoutes = require("./negocio/routes/carrera-estudiante.routes");

const PORT = 3003;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Route dispatch
  if (req.url.startsWith("/estudiantes") && req.url.includes("/carreras")) {
    carreraEstudianteRoutes(req, res);
  } else if (req.url.startsWith("/estudiantes")) {
    estudianteRoutes(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Ruta no encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`ms-estudiante corriendo en http://localhost:${PORT}`);
});
