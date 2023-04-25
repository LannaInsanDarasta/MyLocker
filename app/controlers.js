const { setCookie, getUser } = require("../services/auth");
const prisma = require("../prisma/client");
// Put your controller code here
exports.beranda = async (req, res) => {
    const { username } = await prisma.user.findUnique({
        where: {
            id: await getUser(req),
        },
        select: {
            username: true,
        },
    });

    const data = {
        title: "MyLocker",
        styles: ["/style/beranda.css"],
        scripts: ["/js/beranda.js"],
        icon: "/image/logo_akun.png",
        username,
    };
    res.render("beranda", data);
};

exports.login = (req, res) => {
    const data = {
        styles: ["/style/login.css"],
        scripts: ["/js/login.js"],
        layout: "layout/auth",
    };
    res.render("login", data);
};

exports.daftarakun = (req, res) => {
    const data = {
        styles: ["/style/daftarakun.css"],
        scripts: ["js/daftarakun.js"],
        layout: "layout/auth",
    };
    res.render("daftarakun", data);
};

exports.status = async (req, res) => {
    const lockerName = req.params.name.replace("-", " ").replace("l", "L");
    const user = await prisma.user.findUnique({
        where: {
            id: await getUser(req),
        },
        select: {
            username: true,
            Card: {
                select: {
                    cardNumber: true,
                },
            },
        },
    });
    const data = {
        title: `Status ${lockerName}`,
        styles: ["/style/digunakan.css"],
        scripts: ["/js/status.js"],
        icon: "/image/humberger-menu.svg",
        username: user.username,
        card: user.Card.cardNumber,
        lockerName,
    };
    res.render("status", data);
};

exports.profil = (req, res) => {
    const data = {
        title: "Profil",
        styles: ["/style/profil.css"],
        scripts: ["js/profil.js"],
        icon: "/image/humberger-menu.svg",
    };
    res.render("profil", data);
};

exports.logout = (req, res) => {
    setCookie({ res, title: "Authorization", data: "", maxAge: 1 });
    return res.redirect("/login");
};
