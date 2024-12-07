const { validationResult } = require("express-validator");

/**
 * Middleware that uses validationResult from express-validator
 * To throw any detected errors
 * @returns undefined, it's middleware
 */
function validationHandle(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    next();
}

module.exports = validationHandle;
