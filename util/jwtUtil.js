const jwt = require("jsonwebtoken");

function generateToken(id) {
    // TODO: change expires after refresh token implemented
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '5d' });
}

module.exports = { generateToken };
