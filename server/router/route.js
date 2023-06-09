const router = require('express').Router()
const controller = require('../controllers')
const registerMail = require('../controllers/mailer')
const { auth, localVaribles } = require("../middleware/auth")

/** POST METHOD */
router.route('/register').post(controller.register) // register new user
router.route('/register-mail').post(registerMail) // send the email
router.route('/authentication').post(controller.verifyUser, (req, res) => res.end()) // authenticate user, first verifyUser middleware and then return response to helper.js(client)
router.route('/login').post(controller.verifyUser, controller.login)  // login in app 

/** GET METHOD */
router.route('/user/:username').get(controller.getUser) // get the user with username
router.route('/generate-otp').get(controller.verifyUser, localVaribles, controller.generateOTP) // to generate random OTP
router.route('/verify-otp').get(controller.verifyUser, controller.verifyOTP)  // verify generated  OTP
router.route('/create-reset-session').get(controller.createResetSession) // reset all the variables

/** PUT METHOD */
router.route('/update-user').put(auth, controller.updateUser)  // use to update the user profile
router.route('/reset-password').put(controller.verifyUser, controller.resetPassword) // use to reset password


module.exports = router