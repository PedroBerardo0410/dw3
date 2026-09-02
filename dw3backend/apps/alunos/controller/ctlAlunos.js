const mdlAlunos = require("../model/mdlAlunos");

function formatDate(value) {
    if (!value) return value;
    if (value instanceof Date) {
        return value.toISOString().split("T")[0];
    }
    if (typeof value === "string") {
        return value.split("T")[0];
    }
    return value;
}

function normalizeRegistro(registro) {
    return registro.map((item) => ({
        ...item,
        datanascimento: formatDate(item.datanascimento),
    }));
}

const GetAllAlunos = (req, res) =>
    (async () => {
        const registro = normalizeRegistro(await mdlAlunos.GetAllAlunos());
        res.json({ status: "ok", registro });
    })();

const GetAlunoByID = (req, res) =>
    (async () => {
        const alunoID = parseInt(req.params.alunoid, 10);
        const registro = normalizeRegistro(await mdlAlunos.GetAlunoByID(alunoID));
        res.json({ status: "ok", registro });
    })();

const InsertAluno = (request, res) =>
    (async () => {
        const alunoREG = request.body;
        const { msg, linhasAfetadas } = await mdlAlunos.InsertAluno(alunoREG);
        res.json({ status: msg, linhasAfetadas });
    })();

const UpdateAluno = (request, res) =>
    (async () => {
        const alunoID = parseInt(request.params.alunoid, 10);
        const alunoREG = request.body;
        const { msg, linhasAfetadas } = await mdlAlunos.UpdateAluno(alunoID, alunoREG);
        res.json({ status: msg, linhasAfetadas });
    })();

const DeleteAluno = (request, res) =>
    (async () => {
        const alunoID = parseInt(request.params.alunoid, 10);
        const { msg, linhasAfetadas } = await mdlAlunos.DeleteAluno(alunoID);
        res.json({ status: msg, linhasAfetadas });
    })();

module.exports = {
    GetAllAlunos,
    GetAlunoByID,
    InsertAluno,
    UpdateAluno,
    DeleteAluno,
};
