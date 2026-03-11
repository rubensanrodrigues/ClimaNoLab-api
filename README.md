# Clima no Lab API

API para ingestão de dados de sensores ambientais utilizada no projeto "Clima no Lab".

Esta API recebe leituras enviadas por sensores e armazena os dados em um banco PostgreSQL para posterior análise e visualização.

---

# Sobre o projeto

O "Clima no Lab" é uma plataforma de aquisição e observação ambiental em laboratório, desenvolvida para coletar dados como:

- temperatura
- umidade
- luminosidade

Os dados são enviados por sensores e armazenados para análise, monitoramento e visualização.

Este repositório contém o serviço responsável pela ingestão desses dados via API HTTP.

---

# Funcionamento da API

A API expõe o endpoint:

```
/api/sensor
```

### Autenticação

As requisições devem incluir o header:

```
x-api-key: SUA_API_KEY
```

---

# Endpoint

## POST /api/sensor

Envia leituras de um sensor para armazenamento.

### Exemplo de requisição

```json
{
  "sensor_id": "sensor_lab_01",
  "leituras": [
    {
      "temperatura": 22.5,
      "umidade": 60.2,
      "luminosidade": 300
    },
    {
      "temperatura": 22.7,
      "umidade": 59.8,
      "luminosidade": 310
    }
  ]
}
```

### Resposta

```json
{
  "success": true,
  "registros": 2
}
```

---

## GET /api/sensor

Endpoint simples para verificação de funcionamento da API.

### Resposta

```json
{
  "status": "OK"
}
```

---

# Banco de dados

Os dados são armazenados em uma tabela PostgreSQL:

```
pi5.sensor_data
```

Campos utilizados:

- sensor_id
- temperatura
- umidade
- luminosidade

---

# Requisitos

Para executar o projeto são necessários:

- Node.js
- PostgreSQL
- biblioteca Node "pg"
- "dotenv" (apenas para desenvolvimento)

Dependências principais:

```
pg
dotenv
```

---

# Variáveis de ambiente

Crie um arquivo ".env" durante o desenvolvimento:

```
DATABASE_URL=postgres://usuario:senha@host:porta/database
API_KEY=sua_chave_de_api
```

---

# Executando localmente

Instalar dependências:

```bash
npm install
```

Executar em modo desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```
http://localhost:3000
```

---

# Deploy

A versão de produção é preparada para Vercel.

Para deploy:

- utilize a branch específica de "release para Vercel"
- configure as variáveis de ambiente na plataforma

---

# Estrutura do projeto

```
.
├── api
│   └── sensor.js
├── server.js
├── package.json
└── README.md
```

server.js

Servidor HTTP simples que roteia requisições para os handlers da API.

api/sensor.js

Handler responsável por:

- autenticação via API key
- validação das leituras
- inserção no PostgreSQL

---

# Licença

Este projeto foi criado para fins educacionais.

O uso, modificação e redistribuição são permitidos livremente **desde que a autoria original seja mantida**.

Remover ou ocultar a autoria original é expressamente proibido. Caso a autoria seja removida, **você não tem permissão para usar este código em nenhuma forma**.