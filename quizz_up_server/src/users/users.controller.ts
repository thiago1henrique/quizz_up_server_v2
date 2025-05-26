import {
    Body,
    Controller,
    Post,
    Get,
    Param,
    NotFoundException,
    UseGuards, // <-- Adicionado (Presumindo que você quer proteger a rota)
    Req,       // <-- Adicionado (Se precisar do usuário do token, mas não usado aqui)
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport'; // <-- Adicionado (Ou seu guard JWT)

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() user: Partial<User>): Promise<User> {
        // Lembre-se de implementar a lógica de hash de senha no seu UsersService!
        return this.usersService.create(user);
    }

    // --- Endpoint GET /users/:id ADAPTADO ---
    @Get(':id')
    @UseGuards(AuthGuard()) // <-- Protegendo a rota (RECOMENDADO!)
    async findOneById(@Param('id') id: string) {
        console.log(`Buscando usuário com ID: ${id}`);
        const userIdNumber = +id; // Usando +id para converter para número (mais conciso)

        if (isNaN(userIdNumber)) {
            throw new NotFoundException(`ID de usuário inválido: ${id}`);
        }

        // 1. Chamar o serviço para buscar usuário COM tentativas
        //    Você precisará criar/ajustar o método 'findOneWithAttempts' no seu UsersService
        //    para carregar a relação 'attempts' e, dentro dela, a relação 'quiz'.
        const user = await this.usersService.findOneWithAttempts(userIdNumber);

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }

        // 2. Extrair senha e tentativas (se existir)
        //    'attempts' será a array de tentativas vinda do serviço
        const { password, attempts = [], ...userDataToReturn } = user;

        // 3. Mapear as tentativas para o formato QuizHistoryItem
        const quizHistory = attempts.map(attempt => ({
            id: attempt.id,             // ID da tentativa (ou do quiz, ajuste conforme sua entidade)
            title: attempt.quiz.title,  // Título do Quiz (requer 'quiz' na 'attempt')
            score: attempt.score,         // Pontuação da tentativa
            total: attempt.totalQuestions,// Total de questões na tentativa
            logo: attempt.quiz.logo,    // Logo do Quiz (requer 'quiz' na 'attempt')
            createdAt: attempt.createdAt  // Data da tentativa
        }));

        // 4. Retornar os dados do usuário SEM a senha e COM o histórico
        return {
            ...userDataToReturn,
            quizHistory: quizHistory, // Retorna o histórico mapeado
        };
    }
}