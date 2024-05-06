const errorHandler = (err, req, res, next) => {
    return res.status(err.statusCode).send(err.message)
}

module.exports = errorHandler