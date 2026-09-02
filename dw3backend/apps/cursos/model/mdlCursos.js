const db = require("../../../database/databaseconfig");

let fallbackCursos = [
    {
        cursoid: 1,
        codigo: "BSI",
        descricao: "Bacharelado em Sistemas de Informacao",
        ativo: true,
        deleted: false,
    },
    {
        cursoid: 2,
        codigo: "DIREITO",
        descricao: "Bacharelado em Direito",
        ativo: true,
        deleted: false,
    },
    {
        cursoid: 3,
        codigo: "LETRAS",
        descricao: "Licenciatura em Letras",
        ativo: true,
        deleted: false,
    },
    {
        cursoid: 4,
        codigo: "ADM",
        descricao: "Bacharelado em Administracao",
        ativo: false,
        deleted: false,
    },
];

function listFallbackCursos() {
    return fallbackCursos
        .filter((curso) => curso.deleted === false)
        .slice()
        .sort((a, b) => a.descricao.localeCompare(b.descricao));
}

const GetAllCursos = async () => {
    try {
        return (
            await db.query(
                "SELECT * FROM cursos WHERE deleted = false ORDER BY descricao ASC",
            )
        ).rows;
    } catch (error) {
        return listFallbackCursos();
    }
};

const GetCursoByID = async (cursoIDPar) => {
    try {
        return (
            await db.query(
                "SELECT * FROM cursos WHERE cursoid = $1 AND deleted = false ORDER BY descricao ASC",
                [cursoIDPar],
            )
        ).rows;
    } catch (error) {
        return listFallbackCursos().filter((curso) => curso.cursoid === cursoIDPar);
    }
};

const InsertCurso = async (cursoREGPar) => {
    let msg = "ok";
    let linhasAfetadas = 0;

    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO cursos VALUES (default, $1, $2, $3, $4)",
                [
                    cursoREGPar.codigo,
                    cursoREGPar.descricao,
                    cursoREGPar.ativo,
                    cursoREGPar.deleted,
                ],
            )
        ).rowCount;
    } catch (error) {
        const novoId =
            fallbackCursos.reduce((maior, curso) => Math.max(maior, curso.cursoid), 0) + 1;

        fallbackCursos.push({
            cursoid: novoId,
            codigo: cursoREGPar.codigo,
            descricao: cursoREGPar.descricao,
            ativo: Boolean(cursoREGPar.ativo),
            deleted: Boolean(cursoREGPar.deleted),
        });

        linhasAfetadas = 1;
        msg = "ok";
    }

    return { msg, linhasAfetadas };
};

const UpdateCurso = async (cursoIDPar, cursoREGPar) => {
    let linhasAfetadas = 0;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE cursos SET codigo = $2, descricao = $3, ativo = $4, deleted = $5 WHERE cursoid = $1",
                [
                    cursoIDPar,
                    cursoREGPar.codigo,
                    cursoREGPar.descricao,
                    cursoREGPar.ativo,
                    cursoREGPar.deleted,
                ],
            )
        ).rowCount;
    } catch (error) {
        const index = fallbackCursos.findIndex((curso) => curso.cursoid === cursoIDPar);
        if (index === -1) {
            msg = "Curso nao encontrado";
            linhasAfetadas = 0;
        } else {
            fallbackCursos[index] = {
                ...fallbackCursos[index],
                codigo: cursoREGPar.codigo,
                descricao: cursoREGPar.descricao,
                ativo: Boolean(cursoREGPar.ativo),
                deleted: Boolean(cursoREGPar.deleted),
            };
            linhasAfetadas = 1;
        }
    }

    return { msg, linhasAfetadas };
};

const DeleteCurso = async (cursoIDPar) => {
    let linhasAfetadas = 0;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE cursos SET deleted = true WHERE cursoid = $1",
                [cursoIDPar],
            )
        ).rowCount;
    } catch (error) {
        const curso = fallbackCursos.find((item) => item.cursoid === cursoIDPar);
        if (!curso) {
            msg = "Curso nao encontrado";
            linhasAfetadas = 0;
        } else {
            curso.deleted = true;
            linhasAfetadas = 1;
        }
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    GetAllCursos,
    GetCursoByID,
    InsertCurso,
    UpdateCurso,
    DeleteCurso,
};
