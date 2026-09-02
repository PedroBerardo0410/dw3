const express = require("express");
const authenticationMiddleware = require("./authentication");
const cursosApp = require("../apps/cursos/controller/ctlCursos");

const router = express.Router();

router.use(authenticationMiddleware);
router.get("/", cursosApp.getAllCursos);
router.get("/novo", cursosApp.newCurso);
router.post("/novo", cursosApp.insertCurso);
router.get("/:id/editar", cursosApp.editCurso);
router.post("/:id/editar", cursosApp.updateCurso);
router.post("/:id/excluir", cursosApp.deleteCurso);
router.get("/:id", cursosApp.viewCurso);

module.exports = router;
