const router = require("express").Router();
const controller = require("./controlers");

router.get("/", controller.beranda);
router.get("/login", controller.login);
router.get("/register", controller.daftarakun);
router.get("/status", controller.status);
router.get("/profil", controller.profil);

module.exports = router;
