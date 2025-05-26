import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { RolesGuard } from '../auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Quiz } from '../entities/quiz.entity';
import { Express } from 'express'; 

interface QuizCreateData {
  questions: any[];
  title: string;
  description: string;
  userId: number;
  logo?: string;
}
interface SaveResultDto {
  quizId: number;
  score: number;
  total: number;
}

@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/logos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      },
    }),
  }))
  async create(
    @UploadedFile() logo: Express.Multer.File,
    @Body() body: any,
    @Req() req, 
  ) {
    let questionsData = [];
    try {
      if (body.questions) {
        questionsData = JSON.parse(body.questions);
      } else {
        throw new Error("O campo 'questions' é obrigatório.");
      }
    } catch (error) {
      throw new BadRequestException("Formato inválido para as questões.");
    }

    if (!body.title || !body.description) {
         throw new BadRequestException("Título e descrição são obrigatórios.");
    }
    
    const quizData: Partial<Quiz> = {
      questions: questionsData,
      title: body.title,
      description: body.description,
      userCreator: { id: req.user.userId } as any, 
    };

    if (logo) {
      quizData.logo = logo.filename;
    }
    return this.quizzesService.create(quizData);
  }

  @Get()
  async findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const quiz = await this.quizzesService.findOne(id);
    if (!quiz) {
      throw new NotFoundException(`Quiz com ID ${id} não encontrado.`);
    }
    return quiz;
  }

  @Put(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('logo',)) 
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Quiz>, 
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    if (logo) {
      updateData.logo = logo.filename;
    }

    if (updateData.questions && typeof updateData.questions === 'string') {
      try {
        updateData.questions = JSON.parse(updateData.questions as any);
      } catch (error) {
        throw new BadRequestException("Formato inválido para as questões na atualização.");
      }
    }
    return this.quizzesService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.quizzesService.remove(id);
  }

  @Post('save-result')
  @UseGuards(AuthGuard()) 
  async saveResult(
    @Req() req,
    @Body() body: SaveResultDto,
  ) {
    const userIdFromToken = req.user.userId;
    if (!userIdFromToken) {
      throw new BadRequestException("ID do usuário não encontrado no token.");
    }

    return this.quizzesService.createResult({
      score: body.score,
      totalQuestions: body.total,
      userId: userIdFromToken,
      quizId: body.quizId,
    });
  }
}