import envConfig from 'src/config/env.config'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

const prisma = new PrismaService()
const hash = new HashingService()
const main = async () => {
  const hashPassword = await hash.hash(envConfig.ADMIN_PASSWORD)
  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      password: hashPassword,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONE
    }
  })

  return {
    adminUser
  }
}

main()
  .then(({ adminUser }) => {
    console.log(`Admin user created with email: ${adminUser.email}`)
  })
  .catch((error) => {
    console.error(error)
  })
