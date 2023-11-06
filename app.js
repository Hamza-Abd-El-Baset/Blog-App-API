const express = require("express")
const connectToDB = require('./config/connectToDB')
require("dotenv").config()

//Init App
const app = express()

//Middlewares
app.use(express.json())

//Routes
app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/users', require('./routes/usersRoute'))
app.use('/api/posts', require('./routes/postsRoute'))
app.use('/api/comments', require('./routes/commentsRoute'))
app.use('/api/categories', require('./routes/categoriesRoute'))

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

/*
//error handler
app.use((err, req, res, next) =>{
    console.error(err)
    err.statusCode = err.statusCode || 500
    const handledError = err.statusCode < 500
    res.status(err.statusCode)
    .send({
        message : handledError ? err.message : 'Something went wrong',
        errors: handledError ? err.errors : ""
    })
})
*/







