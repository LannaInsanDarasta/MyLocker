// Put your controller code here
exports.beranda = (req, res) => {
    const data = {
        title: "MyLocker",
        styles: ["/style/beranda.css"],
        scripts: [],
        icon: "/image/logo_akun.png"
    };
    res.render("beranda", data);
};

exports.login = (req, res) => {
    const data = {
        styles: ["/style/login.css"],
        scripts: [],
        layout: "layout/auth",
    };
    res.render("login", data);
};

exports.daftarakun = (req, res) => {
    const data = {
        styles: ["/style/daftarakun.css"],
        scripts: [],
        layout: "layout/auth",
    };
    res.render("daftarakun", data);
};

exports.status = (req, res) => {
    const data = {
        title: "Status Loker 1",
        styles: ["/style/digunakan.css"],
        scripts: [],
        icon: "/image/logo_back.png",
    };
    res.render("status", data);
};

exports.profil = (req, res) => {
    const data = {
        title: "Profil",
        styles: ["/style/profil.css"],
        scripts: [],
        icon: "/image/logo_back.png",
    };
    res.render("profil", data);
};