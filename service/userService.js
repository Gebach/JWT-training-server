import userModel from '../modules/user-model.js'
import { hash } from 'bcrypt'
import { v4 } from 'uuid'
import mailService from './mailService.js'
import tokenService from './tokenService.js'
import UserDto from '../dtos/userDto.js'

class UserService {
  async registration(email, pass) {
    const candidate = await userModel.findOne({ email })
    if (candidate) {
      throw new Error(`Пользователь с таким почтовым ящиком ${email} уже существует!`)
    }
    const hashPassword = await hash(pass, 3)
    const activationLink = v4()
    const user = await userModel.create({ email, password: hashPassword, activationLink })
    await mailService.sendActivationMail(email, activationLink)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }
}

export default new UserService()
