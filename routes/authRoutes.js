const router = require("express").Router();
const controller = require("../controllers/authController.js")

// console.log("Auth Controller:", controller); // Debugging line

//TODO implement this after local implementation
router.get('/google',controller.googleGet) 
router.get('/google/redirect',controller.googleRedirectGet)
router.post('/local/login',controller.loginPost)
router.post('/local/signup',controller.signupPost)

module.exports = router;