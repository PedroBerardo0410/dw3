const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs");
const mdlLogin = require("../model/mdlLogin");

const fallbackUsers = [
    { username: "admin", password: bCrypt.hashSync("admin", 8) },
    { username: "qwe", password: bCrypt.hashSync("qwe", 8) },
];

function getLoginPayload(body = {}) {
    return {
        username: body.username || body.UserName,
        password: body.password || body.Password,
    };
}

function buildToken(username) {
    return jwt.sign({ username }, process.env.SECRET_API, {
        expiresIn: 600, // expires in 10min
    });
}

const Login = async (req, res, next) => {
    const { username, password } = getLoginPayload(req.body);

    try {
        const credencial = await mdlLogin.GetCredencial(username);
        if (credencial.length == 0) {
            return res.status(200).json({ message: "Usuário não identificado!" });
        }
        if (bCrypt.compareSync(password, credencial[0].password)) {
            return res.json({
                auth: true,
                username: credencial[0].username,
                token: buildToken(credencial[0].username),
            });
        }
        return res.status(200).json({ message: "Login inválido!" });
    } catch (error) {
        const fallbackUser = fallbackUsers.find(
            (user) => user.username === username,
        );
        if (fallbackUser && bCrypt.compareSync(password, fallbackUser.password)) {
            return res.json({
                auth: true,
                username: fallbackUser.username,
                token: buildToken(fallbackUser.username),
                warning: "Login realizado com fallback local porque o banco falhou.",
            });
        }
        return res.status(500).json({
            auth: false,
            message: "Falha ao consultar o banco de dados.",
            detail: error.message,
        });
    }
};
function AutenticaJWT(req, res, next) {
    const tokenHeader = req.headers["authorization"];
    if (!tokenHeader)
        return res
            .status(200)
            .json({ auth: false, message: "Não foi informado o token JWT" });
    const bearer = tokenHeader.split(" ");
    const token = bearer[1];
    jwt.verify(token, process.env.SECRET_API, function (err, decoded) {
        if (err)
            return res
                .status(200)
                .json({ auth: false, message: "JWT inválido ou expirado" });
        req.userId = decoded.id;
        next();
    });
}
const Logout = (req, res, next) => {
    res.json({ auth: false, token: null });
};
module.exports = {
    Login,
    Logout,
    AutenticaJWT,
};
