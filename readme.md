# QuizzUp - Aplicação de Quiz

QuizzUp é uma aplicação moderna de quiz construída com React (frontend) e NestJS (backend). Permite que usuários criem, respondam e compartilhem quizzes com uma interface divertida e interativa.
Funcionalidades

    Quizzes Interativos: Experiência envolvente com animações e celebrações com efeitos de confete

    Autenticação de Usuários: Sistema seguro de login e cadastro

    Design Responsivo: Funciona em dispositivos desktop e mobile

    Feedback em Tempo Real: Resultados e explicações imediatas

    Painel Administrativo: Criar e gerenciar quizzes (funcionalidade futura)

Tecnologias
Frontend

    - React 19

    - TypeScript

    - Tailwind CSS

    - Framer Motion (animações)

    - React Router

    - Canvas Confetti (celebrações)

    - Vite (ferramenta de build)

Backend

    - NestJS

    - TypeORM

    - SQLite (banco de dados)

    - Autenticação JWT

    - Passport.js

    - Class Validator

## Começando
* Pré-requisitos

    - Node.js (v18 ou superior)

    - npm (v9 ou superior) ou yarn

    - Git

## Instalação

    git clone git@github.com:thiago1henrique/quizz_up_app.git
    


* Instale as dependências do frontend


> cd quizz_up
> npm install

> Instale as dependências do backend


    cd ../quizz_up_server
    npm install

    Configuração de Ambiente

        Crie arquivos .env nos diretórios frontend e backend baseados nos arquivos .env.example fornecidos

## Executando a Aplicação

    Inicie o servidor backend
    bash

> cd quizz_up_server
> npm run start:dev

> Inicie o servidor de desenvolvimento frontend


    cd ../quizz_up
    npm run dev

    Acesse a aplicação

        Frontend estará disponível em http://localhost:5173

        API Backend estará disponível em http://localhost:3000

Scripts
Frontend

    npm run dev: Inicia servidor de desenvolvimento

    npm run build: Constrói para produção

    npm run lint: Executa ESLint

    npm run preview: Pré-visualiza build de produção

Backend

    npm run start: Inicia servidor de produção

    npm run start:dev: Inicia servidor de desenvolvimento com modo watch

    npm run build: Constrói a aplicação

    npm run test: Executa testes unitários

    npm run test:e2e: Executa testes end-to-end

    npm run lint: Executa ESLint

Estrutura do Projeto

quizz-up/
├── quizz_up/                # Diretório frontend
│   ├── src/                 # Arquivos fonte React
│   ├── public/              # Assets estáticos
│   └── vite.config.ts       # Configuração do Vite
│
└── quizz_up_server/         # Diretório backend
├── src/                 # Arquivos fonte NestJS
│   ├── auth/            # Módulo de autenticação
│   ├── quizzes/         # Módulo de quizzes
│   ├── users/           # Módulo de usuários
│   └── main.ts          # Ponto de entrada da aplicação
└── test/                # Arquivos de teste

Como Contribuir

Contribuições são bem-vindas! Siga estes passos:

    Faça um fork do repositório

    Crie uma nova branch (git checkout -b feature-branch)

    Faça commit das suas alterações (git commit -m 'Adiciona nova funcionalidade')

    Envie para a branch (git push origin feature-branch)

    Abra um Pull Request

Licença MIT
## Divirta-se com o Quizz_up! 🎉