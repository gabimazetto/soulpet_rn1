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
const Pet = require("./database/pet")

// Definição de rotas //

// LISTAR CLIENTES
app.get("/clientes", async (req, res) => {
    // SELECT * FROM clientes;
    const listaClientes = await Cliente.findAll();
    res.json(listaClientes);
});

// LISTAR PETS
app.get("/pets", async (req, res) => {
    const listaPets = await Pet.findAll();
    res.json(listaPets);
});

// DETALHES CLIENTES "/clientes/5", por exemplo
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

// DETALHES PETS "/pets/5", por exemplo
app.get("/pets/:id", async (req, res) => {
    const { id } = req.params;
    const pet = await Pet.findByPk(id);
    if(pet) {
        res.json(pet);
    }else {
        res.status(404).json({ message: "Pet não encontrado" });
    }
});


// ADICIONAR CLIENTES
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

// ADICIONAR PETS
app.post("/pets", async (req, res) => {
    const { nome, tipo, porte, dataNasc, clienteId } = req.body;

    try {
        const cliente = await Cliente.findByPk(clienteId);
        if(cliente){
            const pet = await Pet.create({ nome, tipo, porte, dataNasc, clienteId });
            res.status(201).json(pet);
        } else {
            res.status(404).json({ message: "Cliente não encontrado."});
        }        
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu!" });
    }
});

// ATUALIZAR UM CLIENTE
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

// ATUALIZAR UM PET
app.put("/pets/:id", async (req, res) => {
    // Esses são os dados que virão no corpo JSON (que serão possíveis de alterar);
    const { nome, tipo, porte , dataNasc} = req.body;

    // É necessário checar a existência do pet. 
    // SELECT * FROM pets WHERE id = "req.params.id";
    const pet = await Pet.findByPk(req.params.id);

    // se pet é null => não existe pet com o id
    try {
        if(pet) {
            // IMPORTANTE Indicar qual pet  ser atualizado
            // 1º Argumento: Dados novos; 2º Argumento> Where
            await Pet.update(
                { nome, tipo, porte, dataNasc }, 
                { where: { id: req.params.id } } // WHERE id = "req.params.id"
            );
            res.json({ message: "Pet atualizado com sucesso." });
        } else {
            // caso o id seja inválido, a resposta ao cliente será essa 
            res.status(404).json({ message: "Pet não encontrado" });
        }
    } catch {
        console.log(err);
        // caso aconteça algum erro inesperado, a resposta ao cliente será essa (falha na conexão com o banco de dados, por exemplo).
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});


// EXCLUIR UM CLIENTE
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

// EXCLUIR UM PET
app.delete("/pets/:id", async (req, res) => {
    // Precisamos checar se o pet existe antes de apagar
    const pet = await Pet.findByPk(req.params.id);

    try {
        if(pet) {
            // pet existe, podemos apagar
            await pet.destroy();
            res.json({ message: "Pet removido com sucesso." });
        } else {
            res.status(404).json({ message: "Pet não encontrado." });
        }
    } catch {
        console.log(err);
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




