const { StatusCodes } = require('http-status-codes');

// Handle sign in request.
const handleSignIn = (req,res) => {
  res.status(StatusCodes.OK).json({
    "msg" : "Login successful",
    "token" : "test jwt token"
  });
}

// Handle Sign up request.
const handleSignUp = (req,res) => {
    res.status(StatusCodes.CREATED).json({
        "message": "User Registered Successfully"
    })
}

// Handle Token Verification
const handleTokenVerification = (req,res) => {
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
    handleSignIn,
    handleSignUp,
    handleTokenVerification,
    handleTokenRefresh,
    handlePasswordResetRequest,
    handlePasswordReset,
    handleGetProfile
}