const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const User = require('../models/User');
const Role = require('../models/Role');
const PasswordReset = require('../models/PasswordReset');
const {NotFoundError, UnauthenticatedError, BadRequestError} = require('../errors/index');
const MailVerify = require('../models/EmailVerification');
const {sendVerificationEmail,sendResetPasswordEmail} = require('../utils/email');
const email = require('../utils/email');
const validatePassword = require('../middlewares/pass-valid');


// Handle sign in request.
const handleLogin = async (req,res) => {
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }
    if (user && user.isLocked){
        throw new UnauthenticatedError("Account is locked. Please contact support.")
    }
    if (user && user.isDeleted){
        throw new UnauthenticatedError("Invalid Credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        const maxLoginAttempts = 5;
        if (user.loginAttempts >= maxLoginAttempts) {
        await User.updateOne(
            {email},
            {
                $set: {
                    isLocked: true,
                    lockUntil: new Date() + 24 * 60 * 60 * 1000,
                }
            }
        )
        }
        await User.updateOne({email},{
            $set: {
                loginAttempts: user.loginAttempts + 1
            }
        })
        throw new UnauthenticatedError("Invalid Credentials")
    }
    
    const token = user.createJWT()
    await User.updateOne({
        email
    },{
        $set: {
            loginAttempts: 0
        }
    })
  res.status(StatusCodes.OK).json({
    "message" : "Login successful",
    token
  });
}

// Handle Sign up request.
const handleRegister = async (req,res) => {
    const {name,email,password} = req.body
    const passwordError = validatePassword(password)
    const userRole = await Role.findOne({ name: 'user' });
    const verificationToken =  crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const user = await User.create({name,email,password,verificationToken:hashedToken,roles:userRole._id})
    const EmailVerificationCount = await MailVerify.create({email})
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
    await User.findOneAndUpdate({email},{
        verificationToken: hashedToken
    },{
        new: true
    })
    const mailCount = await MailVerify.findOne({email})
    const maxMailCount = 3
    if(mailCount.count >= maxMailCount) {
        throw new BadRequestError("Maximum Email Verification Sent")
    }
    mailCount.count = mailCount.count + 1
    await mailCount.save()
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
    await MailVerify.deleteOne({email: user.email})
    res.status(StatusCodes.OK).json({message: "Email Verification True"})
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
    const passwordError = validatePassword(newPassword)
    const user = await User.findOne({_id:id})
    const isPasswordCorrect = await user.comparePassword(currentPassword)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Current Password")
    }
    user.password = newPassword;
    await user.save()
    res.status(StatusCodes.CREATED).json({message: "Password Changed Successfully"})
}


// Handle token Refresh
const handleTokenRefresh = async (req,res) => {
    const id = req.user.userId
    const user = await User.findOne({_id:id})
    if(!user){
        throw new NotFoundError("Invalid User")
    }
    const token = user.createJWT()
   res.status(StatusCodes.OK).json({
    "message": "Token refreshed successfully.",
    token
   }) 
}

// Send Token to the Email
const handlePasswordResetRequest = async (req,res) => {
    // res.status(StatusCodes.OK).json({
    //     "message": "Password reset link sent to your email."
    // })
    const { email } = req.body;
    // Generate token
    const user = await User.findOne({email})
    if(!user){
        throw new NotFoundError("Email Not found")
    }
    const passwordReset = await PasswordReset.findOne({email})
    const resetToken = await crypto.randomBytes(32).toString('hex')
    const hashedToken = await crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 3600000)
    if(!passwordReset){
        await PasswordReset.create({
            email, token: hashedToken, expires
        })
        await sendResetPasswordEmail(email,resetToken)
        return res.status(StatusCodes.OK).json({ message: 'Password reset Email sent.'}) 
    }
    if(passwordReset.count >= 3){
        throw new BadRequestError("Requested too many times")
    }
    passwordReset.token = hashedToken
    passwordReset.expires = expires
    await passwordReset.save()
    await sendResetPasswordEmail(email,resetToken)
    return res.status(StatusCodes.OK).json({message: 'Password Reset Email'})
        
}

// Handle Password Reset
const handlePasswordReset = async (req,res) => {
    const {token} = req.params;
    const hashedToken = await crypto.createHash('sha256').update(token).digest('hex');
    const { newPassword,verifyPassword } = req.body
    const passwordError = validatePassword(newPassword)
    const resetToken = await PasswordReset.findOne({token:hashedToken})
    if(!resetToken || resetToken.expires < Date.now()){
        throw new NotFoundError("Invalid or expired token")
    }
    if(!newPassword || !verifyPassword ) {
        throw new NotFoundError("newPassword or verifyPassword are missing")
    }
    if(newPassword !== verifyPassword){
        throw new NotFoundError("newPassword and verifyPassword do not match")
    }
    const user = await User.findOne({email:resetToken.email})
    user.password = newPassword
    await user.save()
    await PasswordReset.deleteOne({token:hashedToken})
    res.status(StatusCodes.OK).json({message: "Password Reset successful"})
}

// Get Profile
const handleGetProfile = async  (req,res) => {
    const id = req.user.userId
    const user = await User.findOne({_id:id})
    if(!user) {
        throw new NotFoundError("Invalid User")
    }
    res.status(StatusCodes.OK).json({
        message: "Get User Profile Successful"
        ,data: {id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        roles: user.roles
     }
    })   
}

// handle update profile
const handleUpdateProfile = async (req,res) => {
    const id = req.user.userId
    const user = await User.findOneAndUpdate({_id:id},req.body,{
        new: true,
        runValidators: true
    })
    res.status(StatusCodes.OK).json({
        "message": "Profile updated successfully.",
        data: {
            id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
        }
    })
}

const handleUploadProfilePic = async (req,res) => {
    if(!req.file){
        throw new NotFoundError("No file uploaded")
    }
    const id = req.user.userId
       // Save the profile picture file path or URL
       const profilePicPath = process.env.APP_URL +`/public/profile-pics/${req.file.filename}`;
       // Create a new profile picture document with the file path
       const user = await User.findOneAndUpdate({_id:id},{ avatar: profilePicPath },{
        new: true,
        runValidators: true
       });
   
   
       // Respond with a success message or the saved profile picture ID
       res.json({ message: 'Profile picture updated', avatar: user.avatar });

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
    handleChangePassword,
    handleUpdateProfile,
    handleUploadProfilePic,
    
}