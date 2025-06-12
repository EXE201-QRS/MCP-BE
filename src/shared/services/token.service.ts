import envConfig from '@/config/env.config'
import { SessionTokenPayload, SessionTokenPayloadCreate } from '@/shared/types/jwt.type'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signSessionToken(payload: SessionTokenPayloadCreate) {
    return this.jwtService.sign(
      { ...payload, uuid: uuidv4() },
      {
        secret: envConfig.SESSION_TOKEN_SECRET,
        expiresIn: envConfig.SESSION_TOKEN_EXPIRES_IN,
        algorithm: 'HS256'
      }
    )
  }

  verifySessionToken(token: string): Promise<SessionTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.SESSION_TOKEN_SECRET
    })
  }
}
