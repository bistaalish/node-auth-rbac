/* 
    This is the unauthenticated Routes.
*/
const express = require('express');
const authMiddleware = require('../middlewares/auth');
const authRoutes = express.Router()
const {
    handleRegister,
    handleLogin,
    handlePasswordReset,
    handlePasswordResetRequest,
    handleEmailVerification,
    handleResendEmailVerification,
    handleChangePassword,
    handleTokenRefresh


}  = require('../controllers/auth')

// Unauthorized Routes
authRoutes.post("/login",handleLogin)
authRoutes.post('/register',handleRegister)
authRoutes.get("/verify/:token",handleEmailVerification)
authRoutes.post('/reset-password/:token',handlePasswordReset)
authRoutes.get('/reset-password-request',handlePasswordResetRequest)
authRoutes.patch("/resend-email-verification",handleResendEmailVerification)

// Authorized Routes
authRoutes.post("/change-password",authMiddleware,handleChangePassword)
authRoutes.get("/refresh-token",authMiddleware,handleTokenRefresh)

module.exports = authRoutes