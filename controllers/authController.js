const { body } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const { generateToken } = require("../util/jwtUtil");
const { emailLoginValidation, emailSignupValidation } = require("../util/emailAuthValidation");
const validationHandle = require("../middleware/validationHandle");

module.exports.googleGet = (req, res, next) => {
    const authenticator = passport.authenticate('google', {
        scope: ['profile', 'email'],
    });
    authenticator(req, res, next);
};

module.exports.googleRedirectGet = [
    passport.authenticate('google', { session: false }),
    (req, res, next) => {
        const user = req.user;
        //TODO -> check if the user has a username
        if (!user.username){
            return res.redirect("-set-username-form")
        }
        // if they do not redirect the register for username page"
        // then we no longer need to store the email of the user
        const token = generateToken(user.id);
        res.redirect(`${process.env.CLIENT_URL}?token=${token}%username=${user.username}`)
    }
];

module.exports.loginPost = [
    body("email", "Invalid email").trim().isEmail(),
    body("password")
        .trim()
        .isLength({ min: 2, max: 35 })
        .withMessage("Password must be between 2-35 characters long"),
    validationHandle,  // Add your validation handler here
    asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
        const user = await emailLoginValidation(email, password);
        const token = generateToken(user.id);
        res.status(200).json({
            token,
            username: user.username,
        });
    })
];

exports.signupPost = [
    body("email", "Invalid email").trim().isEmail(),
    body("username")
        .trim()
        .isLength({ min: 2, max: 35 })
        .withMessage("username must be between 2-35 characters")
        .matches(/^[a-zA-Z0-9_. ']*$/)
        .withMessage("username characters must be alphanumeric, period, space, or underscore"),
    body("password")
        .trim()
        .isLength({ min: 2, max: 35 })
        .withMessage("Password must be between 2-35 characters long"),
    validationHandle,  // Add your validation handler here
    asyncHandler(async (req, res, next) => {
        console.log("Signup Controller Reached")
        const { username, email, password } = req.body;
        const user = await emailSignupValidation(username, email, password);
        const token = generateToken(user.id);
        res.status(200).json({
            token,
            username
        });
    })
];
