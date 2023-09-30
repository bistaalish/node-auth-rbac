const Role = require('../models/Role');
const { StatusCodes } = require('http-status-codes');
const {NotFoundError, UnauthenticatedError, BadRequestError} = require('../errors/index');

// Function to get all roles
const getAllRoles = async (req,res) => {
    const roles = await Role.find({})
    return res.status(StatusCodes.OK).json({message: "All Roles",data:roles})
}

// Function to get Role by using specific Role ID
const getRole = async (req,res) => {
    const roleID = req.params.id
    const roles = await Role.findOne({_id:roleID})
    if(!roles){
        throw new NotFoundError("Invalid Role ID")
    }
    return res.status(StatusCodes.OK).json({message:`Get Role Successful`,data:roles})
}
// Create A New Role
const createRole = async (req,res) => {
    const role = await Role.create(req.body)
    return res.status(StatusCodes.CREATED).json({message:"Added New Role", data:role})
}

// Update Existing Roles
const updateRole = async (req,res) => {
   const roleID = req.params.id
   const role = await Role.findOne({_id:roleID},req.body,{
    new:true, 
    runValidators: true
   })
   return res.status(200).json({message: `update role: ${roleID}`,data:role}) 
}
// Delete Roles
const deleteRole = async (req,res) => {
    const roleId = req.params.id
    await Role.deleteOne({_id:roleId})
    return res.status(StatusCodes.OK).json({message: `deleted role: ${roleId}`})
}

module.exports = {
    getRole,
    getAllRoles,
    createRole,
    updateRole,
    deleteRole
}