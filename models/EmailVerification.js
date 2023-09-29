const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var EmailVerificationSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
      },
      expireAt: {
        type: Date,
        default: Date.now() + 24 * 60 * 1000
      }  
});
// Compile model from schema
module.exports = mongoose.model('MailVerify', EmailVerificationSchema );