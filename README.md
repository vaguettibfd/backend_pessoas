# 🧭 API REST — Gerenciamento de Pessoas (PF e PJ)

API REST desenvolvida em **Node.js + Express + MongoDB (Mongoose)**  
para gerenciamento de **Pessoas Físicas (PF)** e **Pessoas Jurídicas (PJ)**,  
com suporte a **CRUD completo**, **relacionamentos entre coleções**, e **filtros via Query Params**.

---

## 🚀 Tecnologias

- **Node.js / Express**
- **MongoDB Atlas (Mongoose ODM)**
- **ES Modules**
- **Vercel (Deploy Serverless)**
- **Swagger (OpenAPI 3.0)**
- **JavaScript moderno (async/await)**

---

## 🌐 URL Base da API

```
https://backend-pessoas.vercel.app/
```

Todas as rotas abaixo são relativas a essa URL.

---

## ⚙️ Estrutura de Dados

### 👤 Pessoa Física (PF)
- **Campos principais:** `nome`, `email`, `cpf`
- **Relacionamentos:**
  - `endereco`: 1-N (compartilhado entre várias pessoas)
  - `telefones`: N-N (compartilhado)
  - `titulo`: 1-1 (exclusivo da PF)

### 🏢 Pessoa Jurídica (PJ)
- **Campos principais:** `nome`, `email`, `cnpj`
- **Relacionamentos:**
  - `endereco`: 1-N (compartilhado)
  - `telefones`: N-N (compartilhado)
  - `ie` (Inscrição Estadual): 1-1 (exclusiva da PJ)

---

## 📂 Endpoints da API

### 🧩 Pessoas Físicas — `/pf`

| Método | Rota | Descrição |
|---------|-------|-----------|
| **GET** | `/pf` | Lista todas as PFs ou filtra por nome (`?nome=...`) |
| **POST** | `/pf` | Cria nova PF com dados aninhados ou referências |
| **PUT** | `/pf/:id` | Atualiza PF existente (aceita objetos ou `_id`s) |
| **DELETE** | `/pf/:id` | Remove PF e seu Título associado (1:1) |

#### 🧾 Exemplo de inserção (`POST /pf`)

```json
{
  "nome": "Leandro Vaguetti 3",
  "email": "leandro@ifb.edu.br",
  "cpf": "12345678903",
  "endereco": {
    "cep": "71000-000",
    "logradouro": "Rua das Palmeiras",
    "bairro": "Centro",
    "cidade": "Brasília",
    "uf": "DF",
    "regiao": "Centro-Oeste"
  },
  "telefones": [
    { "ddd": "61", "numero": "998887776" }
  ],
  "titulo": {
    "numero": "123456",
    "zona": "001",
    "secao": "002"
  }
}
```

#### 🔍 Exemplo de busca por nome
```
GET /pf?nome=leandro
```

#### ✏️ Exemplo de atualização (`PUT /pf/:id`)
```json
{
  "nome": "Leandro Vaguetti",
  "email": "leandro@ifb.edu.br",
  "cpf": "12345678903",
  "titulo": {
    "_id": "675a1234f8a1e6f5b04c0001",
    "zona": "002",
    "secao": "004"
  }
}
```

#### 🗑️ Exclusão (`DELETE /pf/:id`)
Remove o documento PF e o **Título** vinculado (relacionamento 1:1).  
**Telefones e Endereços compartilhados não são apagados.**

---

### 🧩 Pessoas Jurídicas — `/pj`

| Método | Rota | Descrição |
|---------|-------|-----------|
| **GET** | `/pj` | Lista todas as PJs ou filtra por nome (`?nome=...`) |
| **POST** | `/pj` | Cria nova PJ com dados aninhados ou referências |
| **PUT** | `/pj/:id` | Atualiza PJ existente (aceita objetos ou `_id`s) |
| **DELETE** | `/pj/:id` | Remove PJ e sua Inscrição Estadual (1:1) |

#### 🧾 Exemplo de inserção (`POST /pj`)

```json
{
  "nome": "Tech Soluções LTDA 2",
  "email": "contato@tech.com.br",
  "cnpj": "12345678000190",
  "endereco": {
    "cep": "72000-000",
    "logradouro": "Avenida das Nações",
    "bairro": "Taguatinga",
    "cidade": "Brasília",
    "uf": "DF",
    "regiao": "Centro-Oeste"
  },
  "telefones": [
    { "ddd": "61", "numero": "33445566" }
  ],
  "ie": {
    "numero": "DF12345",
    "estado": "DF",
    "dataRegistro": "2023-01-01T00:00:00Z"
  }
}
```

#### 🔍 Exemplo de busca por nome
```
GET /pj?nome=tech
```

#### ✏️ Exemplo de atualização (`PUT /pj/:id`)
```json
{
  "nome": "Tech Soluções LTDA",
  "email": "contato@tech.com.br",
  "cnpj": "12345678000190",
  "ie": {
    "_id": "675b301b7a9d48a52b7a0011",
    "numero": "DF12345",
    "estado": "DF",
    "dataRegistro": "2024-01-01T00:00:00Z"
  }
}
```

#### 🗑️ Exclusão (`DELETE /pj/:id`)
Remove o documento PJ e sua **Inscrição Estadual (IE)** vinculada.  
**Telefones e Endereços compartilhados são preservados.**

---

## 🔍 Exemplos de Query Param

Os filtros de nome funcionam em **ambas** as rotas (`/pf` e `/pj`):

| Exemplo | Descrição |
|----------|------------|
| `/pf?nome=leandro` | Retorna PFs cujo nome contém “Leandro” |
| `/pj?nome=tech` | Retorna PJs cujo nome contém “Tech” |

A busca é **case-insensitive** e usa **regex parcial**.

---

## 🧠 Erros comuns

| Código | Causa | Solução |
|--------|--------|----------|
| **400** | Dados inválidos ou ausentes | Verifique o corpo da requisição |
| **404** | ID não encontrado | Verifique se o documento existe |
| **500** | Erro interno | Verifique logs de conexão MongoDB ou servidor |

---

## 📜 Estrutura do Projeto

```
src/
 ├── dao/
 │   ├── PFDAO.js
 │   └── PJDAO.js
 ├── models/
 │   ├── Endereco.js
 │   ├── Telefone.js
 │   ├── Titulo.js
 │   ├── IE.js
 │   ├── PF.js
 │   └── PJ.js
 ├── routes/
 │   ├── pfRoutes.js
 │   └── pjRoutes.js
 ├── database/
 │   └── connect.js
 └── server.js
```

---

## 📘 Documentação Interativa (Swagger)

A documentação completa em **Swagger/OpenAPI** está disponível no arquivo:

📄 [`openapi.json`](./openapi.json)

Você pode testá-la interativamente em:

🔗 [https://editor.swagger.io](https://editor.swagger.io)

Basta importar o arquivo `openapi.json`.

---

## ⚙️ Instalação local

```bash
# Clone o repositório
git clone https://github.com/<usuario>/<repositorio>.git

# Acesse o diretório
cd <repositorio>

# Instale as dependências
npm install

# Crie o arquivo .env
echo "MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/pessoas" > .env

# Execute em modo desenvolvimento
npm run dev
```

---

## 👥 Autores e Contato

**Coordenação:** Leandro Vaguetti  
**Instituição:** Universidade Católica de Brasília / Instituto Federal de Brasília  
**Contato:** [leandro@ifb.edu.br](mailto:leandro@ifb.edu.br)

---

## 🧩 Licença

Este projeto é distribuído sob a licença **MIT** — veja o arquivo `LICENSE` para mais detalhes.
