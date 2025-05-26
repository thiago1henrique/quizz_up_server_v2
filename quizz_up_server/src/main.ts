// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Use NestExpressApplication
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilita CORS (IMPORTANTE se frontend e backend estão em domínios/portas diferentes)
  app.enableCors(); 

  // Configura o NestJS para servir arquivos estáticos
  // Ele vai pegar a pasta 'uploads' (que está na raiz do projeto, um nível acima de 'dist' ou 'src')
  // e torná-la acessível na URL '/uploads'
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Adiciona um prefixo - Garanta a barra no final!
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Static files served from: ${join(__dirname, '..', 'uploads')} at /uploads/`);
}
bootstrap();