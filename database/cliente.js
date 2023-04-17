// Modelo para gerar a tabela de clientes no MySQL
//Mapeamento: cada propriedade vira uma coluna da tabela

/*  const cliente = {
     nome: "José Almir", // VARCHAR
     email: "jose.almir@gmail.com", // VARCHAR
     telefone: "(88) 9-9999-9999", // VARCHAR
};*/

// DataTypes = serve para definir qual o tipo da coluna
const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const Cliente = connection.define("cliente", {
    // Configurar a coluna 'nome'
    nome: { // nome VARCHAR NOT NULL 
        type: DataTypes.STRING(150), // TIPO DA COLUNA (COMO NÃO TEM VARCHAR, VAI STRING)
        allowNull: false, // NOT NULL 
    },
    email: { // email VARCHAR UNIQUE NOT NULL 
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true
    }, 
    telefone: { // telefone VARCHAR NOT NULL
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Cliente;