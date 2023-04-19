const Cliente = require("../database/cliente");
const Endereco = require("../database/endereco");

const { Router } = require("express");

// Criar o grupo de rotas(/clientes)
const router = Router();

// LISTAR CLIENTES
router.get("/clientes", async (req, res) => {
    // SELECT * FROM clientes;
    const listaClientes = await Cliente.findAll();
    res.json(listaClientes);
});

// DETALHES CLIENTES "/clientes/5", por exemplo
router.get("/clientes/:id", async (req, res) => {
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

// ADICIONAR CLIENTES
router.post("/clientes", async (req, res) => {
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

// ATUALIZAR UM CLIENTE
router.put("/clientes/:id", async (req, res) => {
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

// EXCLUIR UM CLIENTE
router.delete("/clientes/:id", async (req, res) => {
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


module.exports = router;
