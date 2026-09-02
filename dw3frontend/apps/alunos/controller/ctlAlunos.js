const { callBackend, formAluno } = require("../../shared/backend");

const emptyAluno = {
    alunoid: 0,
    prontuario: "",
    nome: "",
    endereco: "",
    rendafamiliar: "",
    datanascimento: "",
    cursoid: "",
};

function renderForm(res, req, options) {
    return res.render("alunos/form", {
        title: options.aluno.alunoid ? "Cadastro de aluno" : "Novo aluno",
        showNavbar: true,
        activeMenu: "alunos",
        userName: req.session.userName,
        ...options,
    });
}

async function getCursos(req) {
    const data = await callBackend(req, "/getAllCursos");
    return data.registro || [];
}

const getAllAlunos = async (req, res, next) => {
    try {
        const data = await callBackend(req, "/getAllAlunos");
        return res.render("alunos/lista", {
            title: "Alunos",
            showNavbar: true,
            activeMenu: "alunos",
            userName: req.session.userName,
            alunos: data.registro || [],
        });
    } catch (error) {
        return next(error);
    }
};

const newAluno = async (req, res, next) => {
    try {
        return renderForm(res, req, { aluno: emptyAluno, cursos: await getCursos(req), mode: "create" });
    } catch (error) {
        return next(error);
    }
};

const insertAluno = async (req, res, next) => {
    const aluno = formAluno(req.body);
    try {
        await callBackend(req, "/insertAluno", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(aluno),
        });
        return res.redirect("/alunos");
    } catch (error) {
        try {
            return res.status(400).render("alunos/form", {
                title: "Novo aluno",
                showNavbar: true,
                activeMenu: "alunos",
                userName: req.session.userName,
                aluno,
                cursos: await getCursos(req),
                mode: "create",
                error: error.message,
            });
        } catch (cursoError) {
            return next(error);
        }
    }
};

async function loadAluno(req) {
    const data = await callBackend(req, `/getAlunoByID/${req.params.id}`);
    const aluno = (data.registro || [])[0];
    if (!aluno) {
        const error = new Error("Aluno nao encontrado.");
        error.status = 404;
        throw error;
    }
    return aluno;
}

const viewAluno = async (req, res, next) => {
    try {
        return renderForm(res, req, {
            aluno: await loadAluno(req),
            cursos: await getCursos(req),
            mode: "view",
        });
    } catch (error) {
        return next(error);
    }
};

const editAluno = async (req, res, next) => {
    try {
        return renderForm(res, req, {
            aluno: await loadAluno(req),
            cursos: await getCursos(req),
            mode: "edit",
        });
    } catch (error) {
        return next(error);
    }
};

const updateAluno = async (req, res, next) => {
    const aluno = { ...formAluno(req.body), alunoid: Number(req.params.id) };
    try {
        await callBackend(req, `/updateAluno/${req.params.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(aluno),
        });
        return res.redirect(`/alunos/${req.params.id}`);
    } catch (error) {
        try {
            return res.status(400).render("alunos/form", {
                title: "Cadastro de aluno",
                showNavbar: true,
                activeMenu: "alunos",
                userName: req.session.userName,
                aluno,
                cursos: await getCursos(req),
                mode: "edit",
                error: error.message,
            });
        } catch (cursoError) {
            return next(error);
        }
    }
};

const deleteAluno = async (req, res, next) => {
    try {
        await callBackend(req, `/deleteAluno/${req.params.id}`, { method: "DELETE" });
        return res.redirect("/alunos");
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAllAlunos, newAluno, insertAluno, viewAluno, editAluno, updateAluno, deleteAluno };
