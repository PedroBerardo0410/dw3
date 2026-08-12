-- TABELA CURSOS

CREATE TABLE IF NOT EXISTS cursos (
    cursoid bigserial CONSTRAINT pk_cursos PRIMARY KEY,
    codigo varchar(50) UNIQUE,
    descricao varchar(60),
    ativo boolean,
    deleted boolean DEFAULT false
);

INSERT INTO cursos VALUES
(default, 'BSI', 'Bacharelado em Sistemas de Informação', true),
(default, 'DIREITO', 'Bacharelado em Direito', true),
(default, 'LETRAS', 'Licenciatura em Letras', true),
(default, 'ADM', 'Bacharelado em Administração', false)
ON CONFLICT DO NOTHING;


-- TABELA ALUNOS

CREATE TABLE IF NOT EXISTS alunos (
    alunoid bigserial CONSTRAINT pk_alunos PRIMARY KEY,
    prontuario varchar(10) UNIQUE,
    nome varchar(50),
    endereco varchar(60),
    rendafamiliar numeric(8,2),
    datanascimento date,
    cursoid bigint CONSTRAINT fk_aluno_curso REFERENCES cursos,
    deleted boolean DEFAULT false
);

INSERT INTO alunos VALUES
(
    default,
    'pront1',
    'José das Neves',
    'Rua A, Votuporanga',
    6891.60,
    '2000-01-31',
    (SELECT cursoid FROM cursos WHERE codigo = 'BSI')
),
(
    default,
    'pront2',
    'Maria Silveira',
    'Rua B, São José do Rio Preto',
    7372.41,
    '2002-03-12',
    (SELECT cursoid FROM cursos WHERE codigo = 'DIREITO')
)
ON CONFLICT DO NOTHING;


-- TABELA USUARIOS

CREATE TABLE IF NOT EXISTS usuarios (
    usuarioid bigserial CONSTRAINT pk_usuarios PRIMARY KEY,
    username varchar(10) UNIQUE,
    password text,
    deleted boolean DEFAULT false
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO usuarios VALUES
(default, 'admin', crypt('admin', gen_salt('bf'))),
(default, 'qwe', crypt('qwe', gen_salt('bf')))
ON CONFLICT DO NOTHING;


-- TABELA CLIENTES
-- Utilizada posteriormente nos exercícios

CREATE TABLE IF NOT EXISTS clientes (
    clienteid bigserial CONSTRAINT pk_clientes PRIMARY KEY,
    codigo varchar(50) UNIQUE,
    nome varchar(60),
    endereco varchar(50),
    ativo boolean,
    deleted boolean DEFAULT false
);

INSERT INTO clientes VALUES
(default, 'CLI01', 'João da Silva', 'Rua A1', true),
(default, 'CLI02', 'Marcia Almeida', 'Rua B2', true)
ON CONFLICT DO NOTHING;


-- TABELA PEDIDOS

CREATE TABLE IF NOT EXISTS pedidos (
    pedidoid bigserial CONSTRAINT pk_pedidos PRIMARY KEY,
    numero bigint UNIQUE,
    data date,
    valortotal numeric(9,2),
    clienteid bigint CONSTRAINT fk_pedido_cliente REFERENCES clientes,
    deleted boolean DEFAULT false
);

INSERT INTO pedidos VALUES
(
    default,
    234,
    '2020-01-31',
    6891.60,
    (SELECT clienteid FROM clientes WHERE codigo = 'CLI01')
)
ON CONFLICT DO NOTHING;