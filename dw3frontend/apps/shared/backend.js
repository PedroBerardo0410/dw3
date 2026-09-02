function apiError(message, status) {
    const error = new Error(message);
    error.status = status || 502;
    return error;
}

async function callBackend(req, endpoint, options = {}) {
    const headers = {
        Accept: "application/json",
        ...options.headers,
    };

    if (req.session.token) {
        headers.Authorization = `Bearer ${req.session.token}`;
    }

    let response;
    try {
        response = await fetch(`${process.env.SERVIDOR_DW3}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (error) {
        throw apiError("Nao foi possivel conectar ao servidor back-end.");
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw apiError("O servidor back-end retornou uma resposta invalida.");
    }

    if (!response.ok || data.auth === false) {
        if (data.auth === false) {
            req.session.destroy(() => {});
        }
        throw apiError(data.message || "Nao foi possivel concluir a operacao.", response.status);
    }

    if (data.status && data.status !== "ok") {
        throw apiError(data.message || data.status, response.status);
    }

    return data;
}

function formAluno(body) {
    return {
        prontuario: (body.prontuario || "").trim(),
        nome: (body.nome || "").trim(),
        endereco: (body.endereco || "").trim(),
        rendafamiliar: Number(body.rendafamiliar || 0),
        datanascimento: body.datanascimento || null,
        cursoid: Number(body.cursoid),
        deleted: false,
    };
}

function formCurso(body) {
    return {
        codigo: (body.codigo || "").trim(),
        descricao: (body.descricao || "").trim(),
        ativo: body.ativo === "true" || body.ativo === "on",
        deleted: false,
    };
}

module.exports = { callBackend, formAluno, formCurso };
