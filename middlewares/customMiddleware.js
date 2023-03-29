const cekUser = (req, res, next) => {
    try {
        console.log("LANAAAAAA");
        next();
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

module.exports = { cekUser };
