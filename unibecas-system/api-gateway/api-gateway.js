const http = require("http");

const ROUTES = {
  "/api/facultades": { host: "localhost", port: 3001 },
  "/api/carreras": { host: "localhost", port: 3001 },
  "/api/tipos-beca": { host: "localhost", port: 3002 },
  "/api/becas": { host: "localhost", port: 3002 },
  "/api/estudiantes": { host: "localhost", port: 3003 },
  "/api/convocatorias": { host: "localhost", port: 3004 },
  "/api/solicitudes": { host: "localhost", port: 3005 },
  "/api/asignaciones": { host: "localhost", port: 3006 },
};

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function findRoute(url) {
  for (const prefix in ROUTES) {
    if (url === prefix || url.startsWith(prefix + "/")) {
      return { target: ROUTES[prefix], prefix };
    }
  }
  return null;
}

function proxyRequest(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const match = findRoute(req.url);

  if (!match) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Ruta no encontrada" }));
    return;
  }

  const { target, prefix } = match;

  // Strip /api prefix: /api/carreras/1 -> /carreras/1
  const targetPath = req.url.substring("/api".length);

  const options = {
    hostname: target.host,
    port: target.port,
    path: targetPath,
    method: req.method,
    headers: { ...req.headers, host: `${target.host}:${target.port}` },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    // Copiar headers de la respuesta del microservicio y agregar CORS
    const headers = {
      ...proxyRes.headers,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    res.writeHead(proxyRes.statusCode, headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error(
      `Error al conectar con el microservicio en puerto ${target.port}:`,
      err.message,
    );
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        message: `Servicio no disponible en puerto ${target.port}`,
      }),
    );
  });

  req.pipe(proxyReq);
}

module.exports = { proxyRequest };
