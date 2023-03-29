const { resError, ErrorException } = require("../services/responseHandler");
const prisma = require("../prisma/client");
const jwt = require("jsonwebtoken");
const { getAuthorizationToken, getUser } = require("../services/auth");
const crypto = require("crypto");

const loginRequired = async (req, res, next) => {
    const jwtToken = await getAuthorizationToken(req);
    try {
        // check if token exits
        if (!jwtToken) throw "Login Requires! Please Login";
        // find user
        const user = await prisma.user.findUnique({
            where: {
                id: jwtToken.userID,
            },
            select: {
                id: true,
                username: true,
                updatedAt: true,
            },
        });
        if (
            new Date(Number(jwtToken.iat * 1000)) <
            new Date(user.passwordUpdatedAt)
        )
            throw "User password has changed, please relogin";

        if (!user) throw "Cant find the user";

        if (user) return next();
    } catch (error) {
        return res.redirect("/login");
    }
};

const logoutRequired = async (req, res, next) => {
    const jwtToken = await getAuthorizationToken(req);
    // check if token exits
    if (jwtToken) return res.redirect("/");
    next();
};

module.exports = { loginRequired, logoutRequired };
