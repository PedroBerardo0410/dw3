const express = require("express");
const authenticationMiddleware = require("./authentication");
const alunosApp = require("../apps/alunos/controller/ctlAlunos");

const router = express.Router();

router.use(authenticationMiddleware);
router.get("/", alunosApp.getAllAlunos);
router.get("/novo", alunosApp.newAluno);
router.post("/novo", alunosApp.insertAluno);
router.get("/:id/editar", alunosApp.editAluno);
router.post("/:id/editar", alunosApp.updateAluno);
router.post("/:id/excluir", alunosApp.deleteAluno);
router.get("/:id", alunosApp.viewAluno);

module.exports = router;
