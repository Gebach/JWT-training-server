import userModel from '../modules/user-model.js'
import { hash } from 'bcrypt'
import { v4 } from 'uuid'
import mailService from './mailService.js'
import tokenService from './tokenService.js'
import UserDto from '../dtos/userDto.js'
import ApiError from '../exceptions/api-error.js'

class UserService {
  async registration(email, pass) {
    const candidate = await userModel.findOne({ email })
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с таким почтовым ящиком ${email} уже существует!`)
    }
    const hashPassword = await hash(pass, 3)
    const activationLink = v4()
    const user = await userModel.create({ email, password: hashPassword, activationLink })
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink })
    if (!user) {
      throw ApiError.BadRequest('Неверная ссылка активации')
    }

    user.isActivated = true
    await user.save()
  }
}

export default new UserService()
