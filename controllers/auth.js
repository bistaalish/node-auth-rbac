const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const User = require('../models/User');
const {NotFoundError, UnauthenticatedError, BadRequestError} = require('../errors/index');
const {sendVerificationEmail,sendResetPasswordEmail} = require('../utils/email');
const email = require('../utils/email');

// Handle sign in request.
const handleLogin = async (req,res) => {
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials")
    }
    const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    "msg" : "Login successful",
    token
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
const handleResendEmailVerification = async (req,res) => {
    const email = req.body.email
    const token =  crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({email})
    if (!user){
        throw new NotFoundError("Invalid Email Address")
    }
    if(user.isVerified){
        throw new BadRequestError("Email Already Verified")
    }
    user = await User.findOneAndUpdate({email},{
        verificationToken: hashedToken
    },{
        new: true
    })
    await sendVerificationEmail(email,token)

    res.status(StatusCodes.OK).json({
        "message": "Email Verification Sent"
    })
}

// Handle Email Verification
const handleEmailVerification = async (req,res) => {
    const token = req.params.token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOneAndUpdate({verificationToken: hashedToken},{
        isVerified: true,
        verificationToken: null
    })
    if(!user) {
        throw new NotFoundError("Invalid or expired token")
    }
    res.status(StatusCodes.OK).json({msg: "Email Verification True"})
}

// handle Change password
const handleChangePassword = async (req,res) =>{
    const id = req.user.userId
    const {currentPassword,newPassword,verificationPassword} = req.body
    if (!currentPassword || !newPassword || !verificationPassword ){
        throw new NotFoundError("Missing currentPassword or newPassword or verificationPassword")
    }
    if (newPassword !== verificationPassword) {
        throw new NotFoundError("newPassword and verificationPassword do not match")
    }
    const user = await User.findOne({_id:id})
    console.log(user)
    const isPasswordCorrect = await user.comparePassword(currentPassword)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Current Password")
    }
    user.password = newPassword;
    await user.save()
    res.status(StatusCodes.CREATED).json({msg: "Password Changed Successfully"})
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
    handleResendEmailVerification,
    handleChangePassword
}