const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide valid email"
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true,"Please provide password"],
        minlength: 6,
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      phone: {
        type: String,
        match: [/^\d{10}$/,"Please provide valid Phone Number"]
      },
      avatar: {
        type: String
      },
      loginAttempts: {
        type: Number,
        default: 0
      },
      isLocked: {
        type: Boolean,
        default: false
      },
      lockUntil: {
        type: Date
      },
      roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
      }]
});

// hash password using bcrypt
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    this.updatedAt= Date.now
  })


// Create JSON web token
UserSchema.methods.createJWT = function () {
    return jwt.sign(
        {userId: this._id, name: this.name,isVerified: this.isVerified,roles:this.roles},
        process.env.SECRET_KEY,{
            expiresIn: process.env.JWT_LIFETIME
        }
    )
}

// get Name
UserSchema.methods.getName = function () {
    return this.name
}

// Compare password
UserSchema.methods.comparePassword = async function (pass) {
    const isMatch = await bcrypt.compare(pass,this.password)
    return isMatch
}

// Generate verificationToken
UserSchema.methods.getVerificationToken = async function () {
    return this.verificationToken
}
// Compile model from schema
module.exports = mongoose.model('Users', UserSchema );