/* 
    This is the unauthenticated Routes.
*/
const express = require('express');
const authRoutes = express.Router()
const {
    handleSignIn,
    handleSignUp,
    handlePasswordReset,
    handlePasswordResetRequest,
    handleEmailVerification,
    handleResendEmailVerification


}  = require('../controllers/auth')

authRoutes.post("/signup",handleSignUp)
authRoutes.post('/signup',handleSignIn)
authRoutes.get("/verify-email/:token",handleEmailVerification)
authRoutes.post("/resend-verification-email",handleResendEmailVerification)
authRoutes.post('/reset-password/:token',handlePasswordReset)
authRoutes.get('/reset-password-request',handlePasswordResetRequest)

module.exports = authRoutes