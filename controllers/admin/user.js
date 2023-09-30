
const User = require('../../models/User');
const { StatusCodes } = require('http-status-codes');
const {NotFoundError,UnauthenticatedError} = require('../../errors');
const Role = require('../../models/Role');
const validatePassword = require('../../middlewares/pass-valid');

const getAllUsers = async (req , res) => {
    const usersInfo = await User.find({}).populate('roles', 'name');
      // Extract user data and transform it to exclude the 'password' field and include role names
      const users = usersInfo.map((user) => {
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          loginAttempts: user.loginAttempts,
          isLocked: user.isLocked,
          roles: user.roles.map(role => role.name), // Extract role names
          isDeleted: user.isDeleted,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v
        };
      });
    return res.status(StatusCodes.OK).json({
        status: "success",
        data: users
    })
}

const getUser = async (req , res) => {
    const userId = req.params.id;
    const userInfo = await User.findOne({_id: userId},{password: 0}).populate('roles','name');
    if(!userInfo){
        throw new NotFoundError(`Invalid User ID: ${userId}`)
    }
    // Extract role names from the populated roles
    const user = {
        _id: userInfo._id,
        name: userInfo.name,
        email: userInfo.email,
        isVerified: userInfo.isVerified,
        loginAttempts: userInfo.loginAttempts,
        isLocked: userInfo.isLocked,
        roles: userInfo.roles.map(role => role.name),
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
        isDeleted: userInfo.isDeleted,
        __v: userInfo.__v
    }
 
   // If user is found, send their information as a response
   res.status(StatusCodes.OK).json({
     status: "success",
     data: user,
   });

}

const createUser = async (req , res) => {
    const {email,name,password,roles} = req.body
    const roleObjects = await Role.find({ name: { $in: roles } }, '_id');
    if(roleObjects.length === 0){
        throw new NotFoundError("Invalid Role Name")
    }
    const roleIds = roleObjects.map(role => role._id.toString()); // Convert ObjectIds to strings
    const user = await  User.create({email,name,password,roles:roleIds})
    
    res.status(StatusCodes.CREATED).json({
        message: "success",
        data: user
    })
}

const deleteUser = async (req , res) => {
    const userId = req.params.id
    const user = await User.findOneAndUpdate({_id:userId},{isDeleted: true},{
        new: true
    })
    if(!user){
        throw new NotFoundError(`Invalid Username ID: ${userId}`)
    }

    res.status(StatusCodes.OK).json({
        message: "success",
        
    })
}

const updateUser = async (req , res) => {
    const userId = req.params.id
    const user = await User.findOneAndUpdate({_id:userId},req.body,{
        new: true,
        runValidators: true
    })
    res.status(StatusCodes.OK).json({
        message: "success",
        data: user
    })
}

const changePassword = async (req , res) => {
    const userId = req.params.id
    const {currentPassword,newPassword,verificationPassword} = req.body
    if (!currentPassword || !newPassword || !verificationPassword ){
        throw new NotFoundError("Missing currentPassword or newPassword or verificationPassword")
    }
    if (newPassword !== verificationPassword) {
        throw new NotFoundError("newPassword and verificationPassword do not match")
    }
    const passwordError = validatePassword(newPassword)
    const user = await User.findOne({_id:userId})
    const isPasswordCorrect = await user.comparePassword(currentPassword)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Current Password")
    }
    user.password = newPassword;
    await user.save()
    res.status(StatusCodes.CREATED).json({message: "Password Changed Successfully"})
    
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    changePassword
}