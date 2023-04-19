const Cliente = require("../database/cliente");
const Pet = require("../database/pet");

const { Router } = require("express");


// Criar o grupo de rotas (/pets);
const router = Router();


// LISTAR PETS
router.get("/pets", async (req, res) => {
    const listaPets = await Pet.findAll();
    res.json(listaPets);
});

// DETALHES PETS "/pets/5", por exemplo
router.get("/pets/:id", async (req, res) => {
    const { id } = req.params;
    const pet = await Pet.findByPk(id);
    if(pet) {
        res.json(pet);
    }else {
        res.status(404).json({ message: "Pet não encontrado" });
    }
});

// ADICIONAR PETS
router.post("/pets", async (req, res) => {
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

// ATUALIZAR UM PET
router.put("/pets/:id", async (req, res) => {
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

// EXCLUIR UM PET
router.delete("/pets/:id", async (req, res) => {
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


module.exports = router;