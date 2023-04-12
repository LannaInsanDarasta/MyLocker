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
    controllers.startRent
);
router.post(
    "/rent/finish",
    loginRequired,
    deviceIsExist,
    deviceIsUse,
    controllers.finishRent
);
router.post(
    "/card/generate-token",
    loginRequired,
    controllers.createCardRegisterOTP
);

router.post("/card/register-card", controllers.registerCard);

router.post("/rent/use", deviceIsExist, controllers.startUseLocker);

module.exports = router;
