import http from "http";
import dotenv from 'dotenv';
import sensorHandler from "./api/sensor.js";

dotenv.config();

const routes = {
  "/api/sensor": sensorHandler
};

const server = http.createServer(async (req, res) => {
  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      req.body = body ? JSON.parse(body) : {};
    } catch {
      req.body = {};
    }

    // Adiciona status() e json() para compatibilidade com handler
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    };

    const route = routes[req.url];
    if (route) {
      await route(req, res);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
});

server.listen(3000, '0.0.0.0', () => {
    console.log("Servidor rodando em http://0.0.0.0:3000");
});