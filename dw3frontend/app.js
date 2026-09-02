const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");

require("dotenv").config({
    path: path.join(__dirname, "frontend.env"),
    quiet: true,
});

const indexRouter = require("./routes/rtIndex");
const loginRouter = require("./routes/rtLogin");
const homeRouter = require("./routes/rtHome");
const alunosRouter = require("./routes/rtAlunos");
const cursosRouter = require("./routes/rtCursos");

const app = express();
const viewsPath = path.join(__dirname, "views");
const port = process.env.PORT || 40100;

app.set("views", viewsPath);
app.set("view engine", "njk");
nunjucks.configure(viewsPath, {
    autoescape: true,
    express: app,
    noCache: app.get("env") === "development",
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "dw3frontend-session-secret",
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, sameSite: "lax" },
    }),
);

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);
app.use("/alunos", alunosRouter);
app.use("/cursos", cursosRouter);

app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", {
        title: "Erro",
        showNavbar: Boolean(req.session && req.session.isLogged),
        message: err.message,
    });
});

app.listen(port, () => {
    console.log(`App listening at port ${port}`);
});
