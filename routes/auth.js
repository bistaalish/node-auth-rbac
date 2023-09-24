/* 
    This is the unauthenticated Routes.
*/
const express = require('express');
const authRoutes = express.Router()
const {
    handleRegister,
    handleLogin,
    handlePasswordReset,
    handlePasswordResetRequest,
    handleEmailVerification,
    handleResendEmailVerification


}  = require('../controllers/auth')

authRoutes.post("/login",handleLogin)
authRoutes.post('/register',handleRegister)
authRoutes.get("/verify-email/:token",handleEmailVerification)
authRoutes.post("/resend-verification-email",handleResendEmailVerification)
authRoutes.post('/reset-password/:token',handlePasswordReset)
authRoutes.get('/reset-password-request',handlePasswordResetRequest)

module.exports = authRoutes