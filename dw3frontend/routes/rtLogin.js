const express = require("express");
const loginApp = require("../apps/login/controller/ctlLogin");

const router = express.Router();

router.get("/", loginApp.showLogin);
router.post("/", loginApp.login);
router.get("/sair", loginApp.logout);

module.exports = router;
