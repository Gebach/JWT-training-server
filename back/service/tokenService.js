import { sign } from 'jsonwebtoken'
require('dotenv').config()
import { findOne, create } from '../modules/token-model.js'

class TokenService {
  generateTokens(payload) {
    const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
    const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
    return {
      accessToken,
      refreshToken,
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    const token = await create({ user: userId, refreshToken })
    return token
  }
}

export default new TokenService()
