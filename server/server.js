const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connect = require('./db/connect')
const router = require('./router/route')
const app = express();
const port = process.env.PORT || 8080;

/** middleware */
app.use(express.json())
app.use(express.urlencoded({ extended: false })) // form ky andr jo bh likha hy ab ussy get krna kaly
app.use(cors()) // direct browser sy api call marni hoto error fix krna cors policy ka
app.use(morgan('tiny'))
app.disable('x-powered-by') // less hackers know wabout our stacks

/** API Routes */
app.use('/api', router)

/** http get request */
app.get('/', (req, res) => {
    res.status(201).send('Hello World!')
})

/** start server */

connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
    } catch (error) {
        console.log("Cannot connect with server");
    }
}).catch((error) => {
    console.log("Database not connected");
})


/** morgan library is used to log all the http request inside the console */