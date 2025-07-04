import { Role } from '@/common/constants/auth.constant'
import envConfig from '@/config/env.config'
import { GoogleUserInfoError } from '@/routes/auth/auth.error'
import { AuthRepository } from '@/routes/auth/auth.repository'
import { Injectable } from '@nestjs/common'
import { google } from 'googleapis'
import { AuthService } from 'src/routes/auth/auth.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class GoogleService {
  private oauth2Client
  constructor(
    private readonly hashingService: HashingService,
    private readonly authService: AuthService,
    private readonly authRepository: AuthRepository
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      envConfig.GOOGLE_REDIRECT_URI
    )
  }
  getAuthorizationUrl() {
    const scope = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      include_granted_scopes: true
    })
    return { url }
  }

  async googleCallback(code: string) {
    try {
      // 2. Dùng code để lấy token
      const { tokens } = await this.oauth2Client.getToken(code)
      this.oauth2Client.setCredentials(tokens)

      // 3. Lấy thông tin google user
      const oauth2 = google.oauth2({
        auth: this.oauth2Client,
        version: 'v2'
      })
      const { data } = await oauth2.userinfo.get()
      if (!data.email) {
        throw GoogleUserInfoError
      }

      let user = await this.authRepository.findUniqueUser({
        email: data.email
      })
      // Nếu không có user tức là người mới, vậy nên sẽ tiến hành đăng ký
      if (!user) {
        const randomPassword = uuidv4()
        const hashedPassword = await this.hashingService.hash(randomPassword)
        const createdUser = await this.authRepository.createUser({
          email: data.email,
          name: data.name ?? '',
          password: hashedPassword,
          phoneNumber: null, // Set to null instead of empty string
          roleName: Role.CUSTOMER,
          avatar: data.picture || null
        })
        user = {
          ...createdUser,
          password: hashedPassword
        }
      }
      const authTokens = await this.authService.generateTokens({
        userId: user.id,
        email: user.email,
        roleName: user.roleName
      })
      return authTokens
    } catch (error) {
      console.error('Error in googleCallback', error)
      throw error
    }
  }
}
