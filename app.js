const express = require("express")
const connectToDB = require('./config/connectToDB')
const cors = require('cors')
require("dotenv").config()
const {errorHandler, notFoundHandler} = require('./middlewares/error')
require('./tokenCleanup');

//Init App
const app = express()

//Middlewares
app.use(express.json())

//Cors Policy
app.use(cors({
    origin: "http://localhost:3000"
}))

// Mount the API documentation at the root path
app.use(express.static('public'))


//Routes
app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/users', require('./routes/usersRoute'))
app.use('/api/posts', require('./routes/postsRoute'))
app.use('/api/comments', require('./routes/commentsRoute'))
app.use('/api/categories', require('./routes/categoriesRoute'))

//Error Handler
app.use(notFoundHandler)
app.use(errorHandler)

//Connecting to DB then Running the server
const port = process.env.PORT || 3000
connectToDB()
.then(() => {
    app.listen(port, () => {
        console.log(
            `Server is running in ${process.env.NODE_ENV} mode on port ${port}`
        )
    })
})








