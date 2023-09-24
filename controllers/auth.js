const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const {User} = require('../models/User');

// Handle sign in request.
const handleLogin = (req,res) => {
  res.status(StatusCodes.OK).json({
    "msg" : "Login successful",
    "token" : "test jwt token"
  });
}

// Handle Sign up request.
const handleRegister = async (req,res) => {
    const {name,email,password} = req.body
    const verificationToken =  crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const user = await User.create({name,email,password,verificationToken:hashedToken})
    console.log(verificationToken)
    await sendVerificationEmail(email,verificationToken)
    const token = user.createJWT()
    const response = { user: {name: user.getName()}, token }
    res.status(StatusCodes.CREATED).json(response)

}

// Handle Resend Email Verification.
const handleResendEmailVerification = (req,res) => {
    res.status(StatusCodes.OK).json({
        "message": "Email Verification Sent"
    })
}

// Handle Email Verification
const handleEmailVerification = (req,res) => {
    res.status(StatusCodes.OK).json({
        "message" : "Token is valid"
    })
}

// Handle token Refresh
const handleTokenRefresh = (req,res) => {
   res.status(StatusCodes.OK).json({
    "message": "Token refreshed successfully.",
    "token": "your_new_jwt_token"
   }) 
}

// Send Token to the Email
const handlePasswordResetRequest = (req,res) => {
    res.status(StatusCodes.OK).json({
        "message": "Password reset link sent to your email."
    })    
}

// Handle Password Reset
const handlePasswordReset = (req,res) => {
   res.status(StatusCodes.OK).json({
    "message": "Password reset successful."
   })
}

// Get Profile
const handleGetProfile = (req,res) => {
    res.status(StatusCodes.OK).json({
        "email": "test@example.com"
    })   
}

// handle update profile
const handleUpdateProfile = (req,res) => {
    res.status(StatusCodes.OK).json({
        "message": "Profile updated successfully."
    })
}



module.exports = {
    handleRegister,
    handleLogin,
    handleEmailVerification,
    handleTokenRefresh,
    handlePasswordResetRequest,
    handlePasswordReset,
    handleGetProfile,
    handleResendEmailVerification
}