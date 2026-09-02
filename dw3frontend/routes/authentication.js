function authenticationMiddleware(req, res, next) {
    if (!req.session || !req.session.isLogged || !req.session.token) {
        return res.redirect("/login");
    }

    return next();
}

module.exports = authenticationMiddleware;
