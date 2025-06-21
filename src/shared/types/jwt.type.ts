export interface SessionTokenPayloadCreate {
  userId: number
  deviceId: number
  name: string
  roleName: string
}

export interface SessionTokenPayload extends SessionTokenPayloadCreate {
  exp: number
  iat: number
}
