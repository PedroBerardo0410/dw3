const express = require("express");

const routerApp = express.Router();

const calculadora = require("../controller/calculadora");


routerApp.post("/somar", calculadora.somar);

routerApp.post("/subtrair", calculadora.subtrair);

routerApp.post("/multiplicar", calculadora.multiplicar);

routerApp.post("/dividir", calculadora.dividir);


module.exports = routerApp;