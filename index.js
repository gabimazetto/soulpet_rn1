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
app.post("/clientes", async (req, res) => {
    // - coletar informações do req.body
    const { nome, email, telefone, endereco } = req.body;

    try {
        // Dentro de 'novo' estará o objeto criado
        const novo = await Cliente.create(
            { nome, email, telefone, endereco }, 
            { include: [Endereco]}// Permite insereir cliente e endereço num comando 
        );
        res.status(201).json(novo);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu!" });
    }
});

// Passos para adicionar:
// - coletar informações do req.body
// Chamar o Model e a função create



//Escuta deventos (listen)
app.listen(3000, () => {
    // Gerar as tabelas a partir do model
    // Force = apaga tudo e recria as tabelas
    connection.sync({ force: true });
    console.log("Servidor rodando em http://localhost:3000");
});




