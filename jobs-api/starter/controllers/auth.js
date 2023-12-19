const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')





const register = async (req,res) => {

    const user = await User.create({...req.body})
    const token = user.createJWT()
   
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token})

   
}


const login = async (req,res) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    
    const person = await User.findOne({email})
    
    const validation = await person.comparePassword(password)

    if (!person || !validation) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    

    const token = person.createJWT()
    return res.status(StatusCodes.OK).json({user: {name: person.name, token}})


}

module.exports = {
    register,
    login,
    
}