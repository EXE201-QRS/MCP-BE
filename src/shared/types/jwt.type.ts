export interface SessionTokenPayloadCreate {
  userId: number
  deviceId: number
  name: string
}

export interface SessionTokenPayload extends SessionTokenPayloadCreate {
  exp: number
  iat: number
}
