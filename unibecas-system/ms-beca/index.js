const http = require("http");
const tipoBecaRoutes = require("./negocio/routes/tipo-beca.routes");
const becaRoutes = require("./negocio/routes/beca.routes");

const PORT = 3002;

const server = http.createServer((req, res) => {
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

  if (req.url.startsWith("/tipos-beca")) {
    tipoBecaRoutes(req, res);
  } else if (req.url.startsWith("/becas")) {
    becaRoutes(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Ruta no encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`ms-beca corriendo en el puerto ${PORT}`);
});
