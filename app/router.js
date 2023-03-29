const router = require("express").Router();
const controller = require("./controlers");
const {
    loginRequired,
    logoutRequired,
} = require("../middlewares/UiMiddleware");

router.get("/", loginRequired, controller.beranda);
router.get("/logout", loginRequired, controller.logout);
router.get("/login", logoutRequired, controller.login);
router.get("/register", logoutRequired, controller.daftarakun);
router.get("/status", loginRequired, controller.status);
router.get("/profil", loginRequired, controller.profil);

module.exports = router;
