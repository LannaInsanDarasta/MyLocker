// Put your controller code here
exports.beranda = (req, res) => {
    const data = {
        title: "MyLocker",
        styles: ["/style/beranda.css"],
        scripts: [],
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
