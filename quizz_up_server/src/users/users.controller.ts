import {
    Body,
    Controller,
    Post,
    Get,
    Param,
    NotFoundException,
    UseGuards, 
    Req,       
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport'; 

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() user: Partial<User>): Promise<User> {
        return this.usersService.create(user);
    }

    @Get(':id')
    @UseGuards(AuthGuard()) 
    async findOneById(@Param('id') id: string) {
        console.log(`Buscando usuário com ID: ${id}`);
        const userIdNumber = +id; 

        if (isNaN(userIdNumber)) {
            throw new NotFoundException(`ID de usuário inválido: ${id}`);
        }

        const user = await this.usersService.findOneWithAttempts(userIdNumber);

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }

        const { password, attempts = [], ...userDataToReturn } = user;

        const quizHistory = attempts.map(attempt => ({
            id: attempt.id,             
            title: attempt.quiz.title,  
            score: attempt.score,         
            total: attempt.totalQuestions,
            logo: attempt.quiz.logo,    
            createdAt: attempt.createdAt 
        }));

        return {
            ...userDataToReturn,
            quizHistory: quizHistory,
        };
    }
}