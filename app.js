const express = require("express")
const connectToDB = require('./config/connectToDB')
require("dotenv").config()
const {errorHandler, notFoundHandler} = require('./middlewares/error')
require('./tokenCleanup');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const hpp = require('hpp')

// Init App
const app = express()

// Middlewares
app.use(express.json())

// Security Headers (helmet)
app.use(helmet())

// Prevent Http Param Pollution
app.use(hpp())

// Prevent XSS (Cross Site Scripting) Attacks
app.use(xss())

// Trust the first proxy (e.g., Render)
app.set('trust proxy', 1);

// Rate Limiting
app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200, 
}))


// Custom CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_DOMAIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// Mount the API documentation at the root path
app.use(express.static('public'))


//Routes
app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/users', require('./routes/usersRoute'))
app.use('/api/posts', require('./routes/postsRoute'))
app.use('/api/comments', require('./routes/commentsRoute'))
app.use('/api/categories', require('./routes/categoriesRoute'))
app.use('/api/password', require('./routes/passwordRoute'))

// Error Handler
app.use(notFoundHandler)
app.use(errorHandler)

// Connecting to DB then Running the server
const port = process.env.PORT || 5000
connectToDB()
.then(() => {
    app.listen(port, () => {
        console.log(
            `Server is running in ${process.env.NODE_ENV} mode on port ${port}`
        )
    })
})

