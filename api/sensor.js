import { Client } from "pg";

export default async function handler(req, res) {

  // Métodos permitidos
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(req.method)) {
    console.log("Metodo nao permitido:", req.method);
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Autenticação
  const auth = req.headers["x-api-key"];
  if (!auth || auth !== process.env.API_KEY) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  // Gerencia de metodos
  switch (req.method) {
    case "GET":
      return handleGet(req, res);

    case "POST":
      return handlePost(req, res);
  }
}

// Gerencia GET
async function handleGet(req, res) {
  return res.status(200).json({ status: "OK" });
}

// Gerencia POST
async function handlePost(req, res) {
  const { sensor_id, leituras } = req.body || {};

  if (!sensor_id || !Array.isArray(leituras) || leituras.length === 0) {
    return res.status(400).json({ error: "Campos inválidos ou array vazio" });
  }

  if (typeof sensor_id !== "string") {
    return res.status(400).json({ error: "sensor_id deve ser uma string" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    for (const leitura of leituras) {
      const { temperatura, umidade, luminosidade } = leitura;

      if (
        temperatura === undefined ||
        umidade === undefined ||
        luminosidade === undefined
      ) {
        return res.status(400).json({ error: "Campos faltando em uma leitura" });
      }

      if (
        typeof temperatura !== "number" ||
        typeof umidade !== "number" ||
        typeof luminosidade !== "number"
      ) {
        return res.status(400).json({ error: "Campos devem ser números" });
      }

      if (
        !Number.isFinite(temperatura) ||
        !Number.isFinite(umidade) ||
        !Number.isFinite(luminosidade)
      ) {
        return res.status(400).json({ error: "Campos devem ser números finitos" });
      }
      
      await client.query(
        `INSERT INTO pi5.sensor_data (sensor_id, temperatura, umidade, luminosidade)
         VALUES ($1,$2,$3,$4)`,
        [sensor_id, temperatura, umidade, luminosidade]
      );
    }

    return res.status(200).json({ success: true, registros: leituras.length });

  } catch (err) {
    console.error("Erro no banco de dados:", err);
    return res.status(500).json({ error: "Erro no banco de dados" });

  } finally {
    await client.end();
  }
}