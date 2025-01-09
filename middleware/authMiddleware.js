const { StatusCodes } = require("http-status-codes");


const protect = (req, res, next) => {
    const {user} = req.session;
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({status: 'fail', message: 'unauthorized'});
    }
    req.user = user;
    next();
}

module.exports = protect 