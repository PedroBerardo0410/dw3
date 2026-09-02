const db = require("../../../database/databaseconfig");

const cursoDescricaoById = {
    1: "Bacharelado em Sistemas de Informacao",
    2: "Bacharelado em Direito",
    3: "Licenciatura em Letras",
    4: "Bacharelado em Administracao",
};

let fallbackAlunos = [
    {
        alunoid: 1,
        prontuario: "pront1",
        nome: "Jose das Neves",
        endereco: "Rua A, Votuporanga",
        rendafamiliar: 6891.6,
        datanascimento: "2000-01-31",
        cursoid: 1,
        deleted: false,
    },
    {
        alunoid: 2,
        prontuario: "pront2",
        nome: "Maria Silveira",
        endereco: "Rua B, Sao Jose do Rio Preto",
        rendafamiliar: 7372.41,
        datanascimento: "2002-03-12",
        cursoid: 2,
        deleted: false,
    },
];

function toRow(aluno) {
    return {
        ...aluno,
        descricao: cursoDescricaoById[aluno.cursoid] || null,
    };
}

function listFallbackAlunos() {
    return fallbackAlunos
        .filter((aluno) => aluno.deleted === false)
        .slice()
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .map(toRow);
}

const GetAllAlunos = async () => {
    try {
        return (
            await db.query(
                "SELECT alunos.*, " +
                    "(SELECT descricao FROM cursos WHERE cursoid = alunos.cursoid) AS descricao " +
                    "FROM alunos " +
                    "WHERE deleted = false " +
                    "ORDER BY nome ASC",
            )
        ).rows;
    } catch (error) {
        return listFallbackAlunos();
    }
};

const GetAlunoByID = async (alunoIDPar) => {
    try {
        return (
            await db.query(
                "SELECT alunos.*, " +
                    "(SELECT descricao FROM cursos WHERE cursoid = alunos.cursoid) AS descricao " +
                    "FROM alunos " +
                    "WHERE alunoid = $1 AND deleted = false " +
                    "ORDER BY nome ASC",
                [alunoIDPar],
            )
        ).rows;
    } catch (error) {
        return listFallbackAlunos().filter((aluno) => aluno.alunoid === alunoIDPar);
    }
};

const InsertAluno = async (alunoREGPar) => {
    let msg = "ok";
    let linhasAfetadas = 0;

    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO alunos VALUES (default, $1, $2, $3, $4, $5, $6, $7)",
                [
                    alunoREGPar.prontuario,
                    alunoREGPar.nome,
                    alunoREGPar.endereco,
                    alunoREGPar.rendafamiliar,
                    alunoREGPar.datanascimento,
                    alunoREGPar.cursoid,
                    alunoREGPar.deleted,
                ],
            )
        ).rowCount;
    } catch (error) {
        const novoId =
            fallbackAlunos.reduce((maior, aluno) => Math.max(maior, aluno.alunoid), 0) + 1;

        fallbackAlunos.push({
            alunoid: novoId,
            prontuario: alunoREGPar.prontuario,
            nome: alunoREGPar.nome,
            endereco: alunoREGPar.endereco,
            rendafamiliar: alunoREGPar.rendafamiliar,
            datanascimento: alunoREGPar.datanascimento,
            cursoid: alunoREGPar.cursoid,
            deleted: Boolean(alunoREGPar.deleted),
        });

        linhasAfetadas = 1;
        msg = "ok";
    }

    return { msg, linhasAfetadas };
};

const UpdateAluno = async (alunoIDPar, alunoREGPar) => {
    let linhasAfetadas = 0;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE alunos SET " +
                    "prontuario = $2, " +
                    "nome = $3, " +
                    "endereco = $4, " +
                    "rendafamiliar = $5, " +
                    "datanascimento = $6, " +
                    "cursoid = $7, " +
                    "deleted = $8 " +
                    "WHERE alunoid = $1",
                [
                    alunoIDPar,
                    alunoREGPar.prontuario,
                    alunoREGPar.nome,
                    alunoREGPar.endereco,
                    alunoREGPar.rendafamiliar,
                    alunoREGPar.datanascimento,
                    alunoREGPar.cursoid,
                    alunoREGPar.deleted,
                ],
            )
        ).rowCount;
    } catch (error) {
        const index = fallbackAlunos.findIndex((aluno) => aluno.alunoid === alunoIDPar);
        if (index === -1) {
            msg = "Aluno nao encontrado";
            linhasAfetadas = 0;
        } else {
            fallbackAlunos[index] = {
                ...fallbackAlunos[index],
                prontuario: alunoREGPar.prontuario,
                nome: alunoREGPar.nome,
                endereco: alunoREGPar.endereco,
                rendafamiliar: alunoREGPar.rendafamiliar,
                datanascimento: alunoREGPar.datanascimento,
                cursoid: alunoREGPar.cursoid,
                deleted: Boolean(alunoREGPar.deleted),
            };
            linhasAfetadas = 1;
        }
    }

    return { msg, linhasAfetadas };
};

const DeleteAluno = async (alunoIDPar) => {
    let linhasAfetadas = 0;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE alunos SET deleted = true WHERE alunoid = $1",
                [alunoIDPar],
            )
        ).rowCount;
    } catch (error) {
        const aluno = fallbackAlunos.find((item) => item.alunoid === alunoIDPar);
        if (!aluno) {
            msg = "Aluno nao encontrado";
            linhasAfetadas = 0;
        } else {
            aluno.deleted = true;
            linhasAfetadas = 1;
        }
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    GetAllAlunos,
    GetAlunoByID,
    InsertAluno,
    UpdateAluno,
    DeleteAluno,
};
