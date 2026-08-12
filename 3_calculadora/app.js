const express = require("express");

const router = require("./routes/routes");

const app = express();

const port = 40000;


// Permite receber JSON no corpo da requisição
app.use(express.json());


// Utiliza as rotas
app.use(router);


// Inicia o servidor
app.listen(port, () => {
    console.log(`Aplicação executando na porta ${port}`);
});