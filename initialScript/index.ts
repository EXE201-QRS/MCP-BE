import { Role } from '@/common/constants/auth.constant'
import envConfig from 'src/config/env.config'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

const prisma = new PrismaService()
const hash = new HashingService()

const main = async () => {
  const hashedPassword = await hash.hash(envConfig.ADMIN_PASSWORD)
  const AdminRole = Role.ADMIN_SYSTEM
  const accounts = await prisma.user.createMany({
    data: [
      {
        email: 'huylqse172573@fpt.edu.vn',
        password: hashedPassword,
        name: 'huylq',
        roleName: AdminRole
      },
      {
        email: 'phongnqse172516@fpt.edu.vn',
        password: hashedPassword,
        name: 'phongnq',
        roleName: AdminRole
      },
      {
        email: 'nhinths186614@fpt.edu.vn',
        password: hashedPassword,
        name: 'nhinth',
        roleName: AdminRole
      },
      {
        email: 'hantngss180966@fpt.edu.vn',
        password: hashedPassword,
        name: 'hantng',
        roleName: AdminRole
      },
      {
        email: 'duyenlkss170142@fpt.edu.vn',
        password: hashedPassword,
        name: 'duyenlk',
        roleName: AdminRole
      }
    ]
  })

  return {
    createdAccountCount: accounts.count
  }
}

main()
  .then(({ createdAccountCount }) => {
    console.log(`Created ${createdAccountCount} accounts`)
    console.log('🚀 Initial setup completed successfully.')
  })
  .catch(console.error)
