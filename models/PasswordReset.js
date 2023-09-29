const mongoose = require('mongoose');


var Schema = mongoose.Schema;
var passwordResetSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        expires: {
            type: Date, 
            required:true
        },
        count: {
            type: Number,
            default: 0
        }
});

passwordResetSchema.pre('save', async function () {
    this.count = await this.count + 1
})
// Compile model from schema
module.exports = mongoose.model('PasswordReset', passwordResetSchema );