const nodemailer = require("nodemailer")
const Mailgen = require("mailgen")
const ENV = require("../config")

// Create auth plain transport
let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: ENV.EMAIL, // generated ethereal user
        pass: ENV.PASSWORD, // generated ethereal password
    },
}

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(nodeConfig) // create and send mail

// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Mailgen',
        link: 'https://mailgen.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/
async function registerMail(req, res) {
    const { username, userEmail, text, subject } = req.body
    var email = {
        body: {
            name: username,
            intro: text || 'Welcome to Mailgen! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    // Generate an HTML email with the provided contents
    var emailBody = mailGenerator.generate(email);

    // send email with defined transport object
    let message = {
        from: ENV.EMAIL, // sender address
        to: userEmail, // list of receivers
        subject: subject || "Signup Successfully", // Subject line
        html: emailBody, // html body
    };
    // send mail
    transporter.sendMail(message)
        .then(() => res.status(200).send({ msg: "You should receive an email from us." }))
        .catch(error => {

            console.log(error)
            return res.status(500).send({ error })
        })
}

module.exports = registerMail