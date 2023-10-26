const jwt = require('jsonwebtoken')

const verifyUser = (req, res, next) => {

    if(req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1]
        try{
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decodedPayload
            next()
        }
        catch(err) {
            return res.status(401).json({message: "Invalid token, access denied"})
        }
    }
    else {
        return res.status(401).json({message: "No token provided, access denied"})
    }
}

const verifyAdmin = (req, res, next) => {
    verifyUser(req, res, () => {
        const {isAdmin} = req.user
        if(isAdmin) {
            next()
        } else {
            return res.status(403).json({message: "Not allowed, only admin"})
        }
    })
}

module.exports = {
    verifyUser,
    verifyAdmin
}