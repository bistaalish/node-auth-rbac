// Function to get all roles
const getAllRoles = (req,res) => {
    return res.status(200).json({message:"Get all Roles"})
}

// Function to get Role by using specific Role ID
const getRole = (req,res) => {
    const roleID = req.params.id
    return res.status(200).json({message:`Get all Roles${roleID}`})
}
// Create A New Role
const createRole = (req,res) => {
    return res.status(200).json({message:"Create Role ID"})
}

// Update Existing Roles
const updateRole = (req,res) => {
   const roleID = req.params.id
   return res.status(200).json({message: `update role: ${roleId}`}) 
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