const Role = require('../models/Role');
const { StatusCodes } = require('http-status-codes');
const {NotFoundError, UnauthenticatedError, BadRequestError} = require('../errors/index');

// Function to get all roles
const getAllRoles = async (req,res) => {
    const roles = await Role.find({})
    return res.status(StatusCodes.OK).json({message: "All Roles",data:roles})
    // return res.status(StatusCodes.OK).json({message:"Get all Roles"})
}

// Function to get Role by using specific Role ID
const getRole = async (req,res) => {
    const roleID = req.params.id
    const roles = await Role.findOne({_id:roleID})
    return res.status(StatusCodes.OK).json({message:`Get Role Successful`,data:roles})
}
// Create A New Role
const createRole = async (req,res) => {
    const {name,description} = req.body;
    const role = await Role.create({name,description})
    return res.status(200).json({message:"Added New Role", data:role})
}

// Update Existing Roles
const updateRole = (req,res) => {
   const roleID = req.params.id
   return res.status(200).json({message: `update role: ${roleID}`}) 
}
// Delete Roles
const deleteRole = (req,res) => {
    const roleId = req.params.id
    return res.status(200).json({message: `delete role: ${roleId}`})
}

module.exports = {
    getRole,
    getAllRoles,
    createRole,
    updateRole,
    deleteRole
}