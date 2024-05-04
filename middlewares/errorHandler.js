const errorHandler = (err, req, res, next) => {
    return res.send(err.message)
}
// status(err.statusCode).
module.exports = errorHandler