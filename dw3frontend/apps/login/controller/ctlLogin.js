const { callBackend } = require("../../shared/backend");

const showLogin = (req, res) => {
    if (req.session && req.session.isLogged) {
        return res.redirect("/home");
    }

    return res.render("login", { title: "Login", showNavbar: false });
};

const login = async (req, res) => {
    const username = (req.body.usuario || "").trim();
    const password = req.body.senha || "";

    if (!username || !password) {
        return res.status(400).render("login", {
            title: "Login",
            showNavbar: false,
            error: "Informe usuario e senha.",
        });
    }

    try {
        const data = await callBackend(req, "/Login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!data.auth || !data.token) {
            throw new Error(data.message || "Usuario ou senha invalidos.");
        }

        req.session.isLogged = true;
        req.session.token = data.token;
        req.session.userName = data.username || username;
        return req.session.save(() => res.redirect("/home"));
    } catch (error) {
        return res.status(401).render("login", {
            title: "Login",
            showNavbar: false,
            error: error.message || "Nao foi possivel realizar o login.",
        });
    }
};

const logout = (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
};

module.exports = { showLogin, login, logout };
