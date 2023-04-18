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


// Definição de rotas //

app.get("/clientes", async (req, res) => {
    // SELECT * FROM clientes;
    const listaClientes = await Cliente.findAll();
    res.json(listaClientes);
});

// "/clientes/5", por exemplo
app.get("/clientes/:id", async (req, res) => {
    // SELECT * FROM clientes WHERE id = 5
    const cliente = await Cliente.findOne({ 
        where: {id: req.params.id }, 
        include: [Endereco] // traz o endereço do cliente junto
});
    if(cliente) {
        res.json(cliente);
    } else {
        res.status(404).json({ message: "Cliente não encontrado!"});
    }
});


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

// Atualizar um cliente
app.put("/clientes/:id", async (req, res) => {
    // obter dados do corpo da requisição
    const { nome, email, telefone, endereco } = req.body;
    // obter identificação do cliente pelos parâmetros da rota
    const { id } = req.params;

    try {
        // buscar cliente pelo id passado
        const cliente = await Cliente.findOne({ where: { id } });
        // validar a existência desse cliente no banco de dados
        if(cliente) {
            // validar a existência do endereço passado no corpo da requisição
            if(endereco) {
                await Endereco.update(endereco, { where: { clienteId: id }});
            }
            // atualizar o cliente com nome, email e telefone
            await cliente.update({nome, email, telefone});
            res.status(200).json({ message: "Cliente editado"});
        } else {
            res.status(404).json({ message: "Cliente não encontrado." });
        }
    } catch(err) {
        res.status(500).json({ message: "Um erro aconteceu!" });
    }
});

// excluir o cliente
app.delete("/clientes/:id", async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findOne({ where: { id } });
    try {
        if(cliente) {
            await cliente.destroy();
            res.status(200).json({ message: "Cliente removido" });
        } 
        else {
            res.status(404).json({ message: "Cliente não encontrado." });
        }
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});
















//Escuta deventos (listen)
app.listen(3000, () => {
    // Gerar as tabelas a partir do model
    // Force = apaga tudo e recria as tabelas
    connection.sync({ force: true });
    console.log("Servidor rodando em http://localhost:3000");
});




