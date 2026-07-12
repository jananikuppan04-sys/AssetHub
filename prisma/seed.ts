import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@assethub.com' },
    update: {},
    create: {
      email: 'admin@assethub.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'Admin',
      status: 'Active'
    }
  })

  console.log('Seed successful:', { admin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
