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
    handleTokenRefresh,
    handleGetProfile,
    handleUpdateProfile


}  = require('../controllers/auth')

// Unauthorized Routes
authRoutes.post("/login",handleLogin)
authRoutes.post('/register',handleRegister)
authRoutes.get("/verify/:token",handleEmailVerification)
authRoutes.post('/reset-password/:token',handlePasswordReset)
authRoutes.get('/reset-password-request',handlePasswordResetRequest)
authRoutes.patch("/resend-email-verification",handleResendEmailVerification)
authRoutes.post("/reset-password-request",handlePasswordResetRequest)
authRoutes.post("/reset-password-request/:token",handlePasswordReset)

// Authorized Routes
authRoutes.get("/profile",authMiddleware,handleGetProfile)
authRoutes.patch("/profile",authMiddleware,handleUpdateProfile)
authRoutes.post("/change-password",authMiddleware,handleChangePassword)
authRoutes.get("/refresh-token",authMiddleware,handleTokenRefresh)

module.exports = authRoutes