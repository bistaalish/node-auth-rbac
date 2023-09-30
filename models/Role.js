const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: [true,"Already Present"],
    trim: true,
    minlength: 3,
    maxlength: 32
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  permissions: [
    {
      type: String,
     
    },
  ],
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
