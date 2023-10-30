const jwt = require('jsonwebtoken')

const verifyLoggedIn = (req, res, next) => {

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

    const {isAdmin} = req.user
    
    if(isAdmin) {
        next()
    } else {
        return res.status(403).json({message: "Not allowed, only admin"})
    }

}

const verifyUserId = (req, res, next) => {
    
    if(req.user.id == req.params.id) {
        next()
    } else {
        return res.status(403).json({message: "Not allowed, only profile owner can modify"})
    }
}

const verifyUserIdOrAdmin = (req, res, next) => {
    
    const {isAdmin} = req.user

    if(req.user.id == req.params.id || isAdmin) {
        next()
    } else {
        return res.status(403).json({message: "Not allowed, only admin or profile owner can delete the profile"})
    }
}

module.exports = {
    verifyLoggedIn,
    verifyAdmin,
    verifyUserId,
    verifyUserIdOrAdmin
}