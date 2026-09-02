const mdlCursos = require("../model/mdlCursos");

const GetAllCursos = (req, res) =>
    (async () => {
        const registro = await mdlCursos.GetAllCursos();
        res.json({ status: "ok", registro });
    })();

const GetCursoByID = (req, res) =>
    (async () => {
        const cursoID = parseInt(req.params.cursoid, 10);
        const registro = await mdlCursos.GetCursoByID(cursoID);
        res.json({ status: "ok", registro });
    })();

const InsertCurso = (request, res) =>
    (async () => {
        const cursoREG = request.body;
        const { msg, linhasAfetadas } = await mdlCursos.InsertCurso(cursoREG);
        res.json({ status: msg, linhasAfetadas });
    })();

const UpdateCurso = (request, res) =>
    (async () => {
        const cursoID = parseInt(request.params.cursoid, 10);
        const cursoREG = request.body;
        const { msg, linhasAfetadas } = await mdlCursos.UpdateCurso(cursoID, cursoREG);
        res.json({ status: msg, linhasAfetadas });
    })();

const DeleteCurso = (request, res) =>
    (async () => {
        const cursoID = parseInt(request.params.cursoid, 10);
        const { msg, linhasAfetadas } = await mdlCursos.DeleteCurso(cursoID);
        res.json({ status: msg, linhasAfetadas });
    })();

module.exports = {
    GetAllCursos,
    GetCursoByID,
    InsertCurso,
    UpdateCurso,
    DeleteCurso,
};
