import { Injectable, OnModuleInit } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity'; 

@Injectable()
export class UsersService implements OnModuleInit { 
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.createAdminUserIfNotExists();
  }

  private async createAdminUserIfNotExists() {
    const adminEmail = 'admin@quizzup.com'; 
    const adminExists = await this.findByEmail(adminEmail); 

    if (!adminExists) {
      console.log('Criando usuário Admin padrão (SENHA EM TEXTO PLANO!)...');
      const adminPassword = 'admin_password_123';

      const adminUser = this.usersRepository.create({
        name: 'Administrador',
        email: adminEmail,
        password: adminPassword, 
        role: UserRole.ADMIN,    
      });

      await this.usersRepository.save(adminUser);
      console.log('Usuário Admin criado com sucesso!');
    }
  }

  async create(user: Partial<User>): Promise<User> {
    return this.usersRepository.save(user);
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneWithAttempts(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['attempts', 'attempts.quiz']
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email }
    });
  }
}