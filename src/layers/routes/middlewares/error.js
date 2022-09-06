const error404 = (req, res, next) => {
    const error = new Error(`${req.url} ${req.method} 존재하지 않습니다.`);
    error.status = 404;
    next(error);
};

const error = (err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500).json({
        msg: err.message,
        err: err.name
    });
};

module.exports = {
    error404,
    error
};
