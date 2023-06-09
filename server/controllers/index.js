const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')
const ENV = require('../config')
const otpGenerator = require('otp-generator')


/** middleware for verify user */
async function verifyUser(req, res, next) {
    try {
        // this middleware available for both get and post requests 
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await User.findOne({ username });
        if (!exist) return res.status(404).json({ error: "Can't find User!" });
        next();

    } catch (error) {
        return res.status(404).json({ error: "Authentication Error" });
    }
}

/** POST: http://localhost:8080/api/register 
 * {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
 */
async function register(req, res) {
    const { username, email, password, profile } = req.body
    try {
        // check user already exists email
        const usernameExist = await User.findOne({ username })
        const emailExist = await User.findOne({ email })
        if (usernameExist) {
            return res.status(400).json({ success, error: 'already User exist, provide unique username' })
        } else if (emailExist) {
            return res.status(400).json({ success, error: 'already User exist, provide unique email' })
        } else {
            // convert into hash password
            const salt = await bcrypt.genSalt(10)
            const passwaordHash = await bcrypt.hash(password, salt)
            // create new user
            const userDoc = new User({ username, email, password: passwaordHash, profile: profile || '' })
            userDoc.save()
                .then(result => res.status(201).send({ msg: "User Register Successfully", result }))
                .catch(error => res.status(400).send({ msg: "User not Registered", error }))
        }
    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error: ", error })
    }
}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
async function login(req, res) {
    const { username, password } = req.body
    try {
        // check user are exist
        const userDbDoc = await User.findOne({ username })
        const passwordMatch = await bcrypt.compare(password, userDbDoc.password)

        if (userDbDoc && passwordMatch) {

            // create jwt token
            const token = jwt.sign({
                userId: userDbDoc._id,
                username: userDbDoc.username
            }, ENV.JWT_SECRET, { expiresIn: "24h" })
            console.log(token);

            return res.status(200).json({ msg: "user login successfully", username: userDbDoc.username, token })

        } else {
            return res.status(400).json({ error: "Invalid Details credentials" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error: ", error })
    }
}

/** GET: http://localhost:8080/api/user/example123 */
async function getUser(req, res) {
    const { username } = req.params
    try {
        if (!username) return res.status(501).json({ error: "Invalid Username" })

        /** remove password from user */
        // mongoose return unnecessary data with object so convert it into json
        // const { password, ...rest } = Object.assign({}, user.toJSON());

        const userInfo = await User.findOne({ username }).select('-password')
        if (!userInfo) {
            return res.status(404).json({ error: "Cannot find user" })
        } else {
            return res.status(201).json({ userInfo })
        }
    } catch (error) {
        return res.status(404).json({ error: "Cannot find user" })
    }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
async function updateUser(req, res) {
    try {
        const { userId } = req.user
        // find the User to be updated and update it
        const currentUser = await User.findOne({ _id: userId })
        if (!currentUser) {
            return res.status(401).json({ error: "user not found...!" })
        } else {
            const body = req.body
            // updated in database
            const updatedUser = await User.findByIdAndUpdate(currentUser._id,   // currentUser._id === req.query.id
                { $set: body },
                { new: true }
            )
            return res.status(201).json({ msg: "Record Updated...!", updatedUser });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error })
    }
}

/** GET: http://localhost:8080/api/generateOTP */
async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    res.status(201).json({ code: req.app.locals.OTP })
}

/** GET: http://localhost:8080/api/verifyOTP */
async function verifyOTP(req, res) {
    const { code } = req.query
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).json({ msg: "verify OTP Successfully" })
    }
    return res.status(400).json({ msg: "Invalid OTP" })
}

// successfully redirect user to resetpassword page when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false
        return res.status(201).json({ msg: "access granted" })
    }
    return res.status(404).json({ msg: "Session expired" })
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
async function resetPassword(req, res) {
    try {

        if (!req.app.locals.resetSession) return res.status(404).send({ error: "Session expired!" });

        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        } else {
            const passwaordHash = await bcrypt.hash(password, 10)
            const updatedUser = await User.findByIdAndUpdate({ _id: user._id }, {
                $set: {
                    password: passwaordHash
                }
            }, { new: true })
            req.app.locals.resetSession = false; // reset session
            return res.status(201).send({ msg: "Record Updated...!", updatedUser })
        }

    } catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports = { register, login, getUser, updateUser, generateOTP, verifyOTP, createResetSession, resetPassword, verifyUser }