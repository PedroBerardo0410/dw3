const express = require("express");
const authenticationMiddleware = require("./authentication");

const router = express.Router();

router.get("/", authenticationMiddleware, (req, res) => {
    res.render("home", {
        title: "Painel principal",
        showNavbar: true,
        userName: req.session.userName,
    });
});

module.exports = router;
