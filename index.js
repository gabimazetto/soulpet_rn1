// Importações principais e variaveis de ambiente
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

// Configuração do APP
const app = express();
app.use(express.json()); // Possibilitar transitar dados usando JSON
app.use(morgan("dev"));

// Configuração do Banco de Dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); // efetivar a conexão 


// Definição de rotas
const rotasClientes = require("./routes/clientes");
const rotasPets = require("./routes/pets");

// Configurar o grupo de rotas no app
app.use(rotasClientes);
app.use(rotasPets);

//Escuta deventos (listen)
app.listen(3000, () => {
    // Gerar as tabelas a partir do model
    // Force = apaga tudo e recria as tabelas
    // connection.sync({ force: true });
    console.log("Servidor rodando em http://localhost:3000");
});