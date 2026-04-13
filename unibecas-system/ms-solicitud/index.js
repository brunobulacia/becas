const http = require("http");
const solicitudRoutes = require("./negocio/routes/solicitud.routes");

const PORT = 3005;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  solicitudRoutes(req, res);
});

server.listen(PORT, () => {
  console.log(`MS-Solicitud corriendo en el puerto ${PORT}`);
});
