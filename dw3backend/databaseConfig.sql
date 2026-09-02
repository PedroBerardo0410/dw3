-- create database dw3;

create table IF NOT EXISTS cursos (
    cursoid bigserial constraint pk_cursos PRIMARY KEY,
    codigo varchar(50) UNIQUE,
    descricao varchar(60),
    ativo boolean,
    deleted boolean DEFAULT false
);

insert into cursos values
    (default, 'BSI', 'Bacharelado em Sistemas de Informacao', true, false),
    (default, 'DIREITO', 'Bacharelado em Direito', true, false),
    (default, 'LETRAS', 'Licenciatura em Letras', true, false),
    (default, 'ADM', 'Bacharelado em Administracao', false, false)
ON CONFLICT DO NOTHING;

create table IF NOT EXISTS alunos (
    alunoid bigserial constraint pk_alunos PRIMARY KEY,
    prontuario varchar(10) UNIQUE,
    nome varchar(50),
    endereco varchar(60),
    rendafamiliar numeric(8,2),
    datanascimento date,
    cursoid bigint constraint fk_aluno_curso REFERENCES cursos,
    deleted boolean DEFAULT false
);

insert into alunos values
    (default, 'pront1', 'Jose das Neves', 'Rua A, Votuporanga', 6891.60, '2000-01-31', (SELECT cursoid from cursos where codigo = 'BSI'), false),
    (default, 'pront2', 'Maria Silveira', 'Rua B, Sao Jose do Rio Preto', 7372.41, '2002-03-12', (SELECT cursoid from cursos where codigo = 'DIREITO'), false)
ON CONFLICT DO NOTHING;

create table IF NOT EXISTS usuarios (
    usuarioid bigserial constraint pk_usuarios PRIMARY KEY,
    username varchar(10) UNIQUE,
    password text,
    deleted boolean DEFAULT false
);

CREATE EXTENSION if NOT EXISTS pgcrypto;

insert into usuarios values
    (default, 'admin', crypt('admin', gen_salt('bf')), false),
    (default, 'qwe', crypt('qwe', gen_salt('bf')), false)
ON CONFLICT DO NOTHING;
