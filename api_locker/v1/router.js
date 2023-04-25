const router = require("express").Router();
const {
    deviceIsExist,
    deviceIsNotUse,
    deviceIsUse,
    deviceIsBooked,
} = require("../../middlewares/lockerMiddleware");
const { loginRequired } = require("../../middlewares/userMiddlewares");
const controllers = require("./controllers");

router
    .route("/")
    .post(controllers.createLockerDevice)
    .get(loginRequired, controllers.list);

router.get("/detail/:name", loginRequired, deviceIsExist, controllers.detail);
router.post(
    "/rent/start",
    loginRequired,
    deviceIsExist,
    deviceIsNotUse,
    // WARNING: Perlu ditambah Cek apakah user punya kartu
    controllers.startRent
);
router.post("/rent/use", deviceIsExist, controllers.startUseLocker);
router.post(
    "/rent/finish",
    loginRequired,
    deviceIsExist,
    deviceIsUse,
    controllers.finishRent
);
router.get("/rent/history", loginRequired, controllers.historyList);
router.post(
    "/card/generate-token",
    loginRequired,
    controllers.createCardRegisterOTP
);

router.post("/card/register-card", controllers.registerCard);

module.exports = router;
