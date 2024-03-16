import User from '#models/User'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      email: 'test@gmail.com',
      password: 'abc123-1',
      isAdmin: true,
      isActive: true,
      firstName: 'test',
      lastName: 'user',
    })
  }
}
