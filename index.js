// Importações principais e variaveis de ambiente
require("dotenv").config();
const express = require("express");

// Configuração do APP
const app = express();
app.use(express.json()); // Possibilitar transitar dados usando JSON

// Configuração do Banco de Dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); // efetivar a conexão 
const Cliente = require("./database/cliente"); // Configurar o model da aplicação
const Endereco = require("./database/endereco");
// Definição de rotas

//Escuta deventos (listen)
app.listen(3000, () => {
    // Gerar as tabelas a partir do model
    // Force = apaga tudo e recria as tabelas
    connection.sync({ force: true });
    console.log("Servidor rodando em http://localhost:3000");
});




