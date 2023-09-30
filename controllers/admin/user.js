
const User = require('../../models/User');
const { StatusCodes } = require('http-status-codes');
const {NotFoundError} = require('../../errors');

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
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v
        };
      });
    return res.status(StatusCodes.OK).json({
        message: "Get All Users",
        users
    })
}

const getUser = async (req , res) => {
    const userId = req.params.id;
    const user = User.findOne({_id: userId}, { password: 0 })
    
    res.status(StatusCodes.OK).json({
        message: `Get User: ${userId}`,
        data: user
    })

}

const createUser = async (req , res) => {
    
}

const deleteUser = async (req , res) => {
    
}

const updateUser = async (req , res) => {
    
}

const changePassword = async (req , res) => {
    
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    changePassword
}