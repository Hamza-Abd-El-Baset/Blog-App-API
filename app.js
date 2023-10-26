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






