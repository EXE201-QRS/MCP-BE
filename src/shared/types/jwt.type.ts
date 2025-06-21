export interface SessionTokenPayloadCreate {
  userId: number
  email: string
  roleName: string
}

export interface SessionTokenPayload extends SessionTokenPayloadCreate {
  exp: number
  iat: number
}
