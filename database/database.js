// database.js = arquivo de conexão com o banco de dados
// ele vai ler as variáveis de ambiente e tentar conectar ao MySQL(ou ao outro tipo de banco que estivermos usando)
// vai ser meio padrão. em todos projetos vai ser igual (a não ser que tenha algo bem específico que tenha que ser mudado)

const { Sequelize } = require("sequelize");

// Criamos o objeto de conexão
const connection = new Sequelize(
    process.env.DB_NAME, // nome reservado para o database
    process.env.DB_USER, // usuário reservado para conecão
    process.env.DB_PASSWORD, // senha para acesso
    {
        host: process.env.DB_HOST, // endereço (banco local)
        dialect: 'mysql', // o banco utilizado

    }
);

// Estabelecer conexão usando o objeto 
async function authenticate(connection) {
    try {
        // Tentar estabelecer conexão com o banco de dados (usar as informações pasadas acima)
        await connection.authenticate();
        console.log("Conexão estabelecida com sucesso!");
    } catch (err){
        // err = objeto que guarda detalhes sobre o erro que aconteceu
        console.log("Um erro inesperado aconteceu", err);
    }
}

module.exports = { connection, authenticate };