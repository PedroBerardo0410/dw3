const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect(req.session && req.session.isLogged ? "/home" : "/login");
});

module.exports = router;
