module.exports = (err, req, res, next) => {
    if (err) {
        return res.send(err.message);
    }
    next();
}