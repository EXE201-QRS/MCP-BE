import { REQUEST_USER_KEY } from '@/common/constants/auth.constant'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { SessionTokenPayload } from 'src/shared/types/jwt.type'

export const ActiveUser = createParamDecorator(
  (field: keyof SessionTokenPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const user: SessionTokenPayload | undefined = request[REQUEST_USER_KEY]
    return field ? user?.[field] : user
  }
)
