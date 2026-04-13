const http = require("http");
const facultadRoutes = require("./negocio/routes/facultad.routes");
const carreraRoutes = require("./negocio/routes/carrera.routes");

const PORT = 3001;

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
  if (req.url.startsWith("/facultades")) {
    facultadRoutes(req, res);
  } else if (req.url.startsWith("/carreras")) {
    carreraRoutes(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Ruta no encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`ms-carrera corriendo en http://localhost:${PORT}`);
});
