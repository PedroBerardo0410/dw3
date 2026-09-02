const { callBackend, formCurso } = require("../../shared/backend");

const emptyCurso = { cursoid: 0, codigo: "", descricao: "", ativo: true };

function renderForm(res, req, options) {
    return res.render("cursos/form", {
        title: options.curso.cursoid ? "Cadastro de curso" : "Novo curso",
        showNavbar: true,
        activeMenu: "cursos",
        userName: req.session.userName,
        ...options,
    });
}

const getAllCursos = async (req, res, next) => {
    try {
        const data = await callBackend(req, "/getAllCursos");
        return res.render("cursos/lista", {
            title: "Cursos",
            showNavbar: true,
            activeMenu: "cursos",
            userName: req.session.userName,
            cursos: data.registro || [],
        });
    } catch (error) {
        return next(error);
    }
};

const newCurso = (req, res) => renderForm(res, req, { curso: emptyCurso, mode: "create" });

const insertCurso = async (req, res, next) => {
    const curso = formCurso(req.body);
    try {
        await callBackend(req, "/insertCurso", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(curso),
        });
        return res.redirect("/cursos");
    } catch (error) {
        return res.status(400).render("cursos/form", {
            title: "Novo curso", showNavbar: true, activeMenu: "cursos", userName: req.session.userName,
            curso, mode: "create", error: error.message,
        });
    }
};

async function loadCurso(req) {
    const data = await callBackend(req, `/getCursoByID/${req.params.id}`);
    const curso = (data.registro || [])[0];
    if (!curso) {
        const error = new Error("Curso nao encontrado.");
        error.status = 404;
        throw error;
    }
    return curso;
}

const viewCurso = async (req, res, next) => {
    try {
        return renderForm(res, req, { curso: await loadCurso(req), mode: "view" });
    } catch (error) {
        return next(error);
    }
};

const editCurso = async (req, res, next) => {
    try {
        return renderForm(res, req, { curso: await loadCurso(req), mode: "edit" });
    } catch (error) {
        return next(error);
    }
};

const updateCurso = async (req, res, next) => {
    const curso = { ...formCurso(req.body), cursoid: Number(req.params.id) };
    try {
        await callBackend(req, `/updateCurso/${req.params.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(curso),
        });
        return res.redirect(`/cursos/${req.params.id}`);
    } catch (error) {
        return res.status(400).render("cursos/form", {
            title: "Cadastro de curso", showNavbar: true, activeMenu: "cursos", userName: req.session.userName,
            curso, mode: "edit", error: error.message,
        });
    }
};

const deleteCurso = async (req, res, next) => {
    try {
        await callBackend(req, `/deleteCurso/${req.params.id}`, { method: "DELETE" });
        return res.redirect("/cursos");
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAllCursos, newCurso, insertCurso, viewCurso, editCurso, updateCurso, deleteCurso };
