const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const Roles = require('../models/Role');


const authMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication Invalid')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = await jwt.verify(token,process.env.SECRET_KEY)
        const roles = await Roles.findOne({_id:payload.roles})
        // attach the users to the jov routes
        req.user = {userId: payload.userId,roles ,name: payload.name,isVerified:payload.isVerified}
        if(!payload.isVerified){
            throw new Error("Email is not verified.")
        }
        next()
    } catch (error) {
        throw new UnauthenticatedError(error.toString().split(":")[1])
    }
}

module.exports = authMiddleware;