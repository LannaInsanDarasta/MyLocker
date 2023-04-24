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

exports.status = (req, res) => {
    const data = {
        title: "Status Loker 1",
        styles: ["/style/digunakan.css"],
        scripts: [],
        icon: "/image/humberger-menu.svg",
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
