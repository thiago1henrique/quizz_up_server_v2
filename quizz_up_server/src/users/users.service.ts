import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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