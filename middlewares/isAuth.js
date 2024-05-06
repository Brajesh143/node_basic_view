const isAuth = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.redirect("/login")
    }
}

module.exports = isAuth