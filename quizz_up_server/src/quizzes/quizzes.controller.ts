import {
    Controller,
    Post,
    Get,
    Param,
    NotFoundException,
    UseInterceptors,
    UploadedFile,
    Body,
    BadRequestException,
    UseGuards,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { QuizzesService } from './quizzes.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { Express } from 'express'; // <-- Importe Express se não estiver global

// Interface para os dados de criação de Quiz
interface QuizCreateData {
    questions: any[];
    title: string;
    description: string;
    userId: number;
    logo?: string;
}

// Interface para o corpo da requisição - ATUALIZADA
interface SaveResultDto {
    quizId: number;
    score: number;
    total: number; // Total de questões no quiz
    // quizTitle e quizLogo removidos pois não são enviados ao serviço
}


@Controller('quizzes')
export class QuizzesController {
    constructor(
        private readonly quizzesService: QuizzesService,
        private readonly usersService: UsersService,
    ) {}

    // --- Endpoint para CRIAR um novo Quiz (POST /quizzes) ---
    @Post()
    @UseInterceptors(FileInterceptor('logo', {
        storage: diskStorage({
            destination: './uploads/logos',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}-${file.originalname}`);
            }
        })
    }))
    async create(
        @UploadedFile() logo: Express.Multer.File,
        @Body() body: any
    ) {
        let questionsData = [];
        try {
            if (body.questions) {
                questionsData = JSON.parse(body.questions);
            } else {
                throw new Error("O campo 'questions' é obrigatório.");
            }
        } catch (error) {
            console.error("Falha ao parsear 'questions':", body.questions, error);
            throw new BadRequestException("Formato inválido para as questões.");
        }

        if (!body.userId) {
            throw new BadRequestException("O campo 'userId' é obrigatório.");
        }

        const quizData: Partial<QuizCreateData> = { // Use Partial se QuizCreateData for usado
            questions: questionsData,
            title: body.title,
            description: body.description,
            userId: parseInt(body.userId, 10),
        };

        if (logo) {
            quizData.logo = logo.filename;
        }

        console.log("Enviando para o serviço (Criação de Quiz):", quizData);
        // Ajuste aqui se QuizCreateData não for compatível com Partial<Quiz>
        return this.quizzesService.create(quizData as any); // Use 'as any' ou ajuste a tipagem
    }

    // --- Endpoint para BUSCAR todos os Quizzes (GET /quizzes) ---
    @Get()
    async findAll() {
        console.log("Buscando todos os quizzes...");
        return this.quizzesService.findAll();
    }

    // --- Endpoint para BUSCAR um Quiz por ID (GET /quizzes/:id) ---
    @Get(':id')
    async findOne(@Param('id') id: string) {
        console.log(`Buscando quiz com ID: ${id}`);
        const quiz = await this.quizzesService.findOne(+id);
        if (!quiz) {
            throw new NotFoundException(`Quiz com ID ${id} não encontrado.`);
        }
        return quiz;
    }

    // --- NOVO ENDPOINT PARA SALVAR RESULTADO DO QUIZ ---
    @Post('save-result')
    @UseGuards(AuthGuard())
    async saveResult(
        @Req() req,
        @Body() body: SaveResultDto // Usa o DTO ATUALIZADO
    ) {
        const userIdFromToken = req.user.userId;
        if (!userIdFromToken) {
            throw new BadRequestException("ID do usuário não encontrado no token.");
        }

        const user = await this.usersService.findOne(userIdFromToken);
        if (!user) {
            throw new NotFoundException(`Usuário com ID ${userIdFromToken} não encontrado.`);
        }

        const quiz = await this.quizzesService.findOne(body.quizId);
        if (!quiz) {
            throw new NotFoundException(`Quiz com ID ${body.quizId} não encontrado.`);
        }

        console.log(`Salvando resultado para User ID: ${user.id}, Quiz ID: ${quiz.id}`);

        // --- CHAMADA CORRIGIDA ---
        return this.quizzesService.createResult({
            score: body.score,
            totalQuestions: body.total,
            userId: user.id,
            quizId: quiz.id,
            // quizTitle e quizLogo removidos!
        });
        // -------------------------
    }
}