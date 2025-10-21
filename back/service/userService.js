const userModel = require('../modules/user-model.js')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mailService.js')
const tokenService = require('./tokenService.js').default
const UserDto = require('../dtos/userDto.js')

class UserService {
  async registration(email, pass) {
    const candidate = await userModel.findOne({ email })
    if (candidate) {
      throw new Error(`Пользователь с почтовым ящиком ${email} уже существует!`)
    }
    const hashPassword = await bcrypt.hash(pass, 3)
    const activationLink = uuid.v4()
    const user = await userModel.create({ email, password: hashPassword, activationLink })
    await mailService.sendActivationMail(email, activationLink)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshTokens)

    return {
      ...tokens,
      user: userDto,
    }
  }
}

module.exports = new UserService()
