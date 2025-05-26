# Quizz_Up 🚀

Bem-vindo ao Quizz_Up! Uma plataforma interativa de quizzes construída com tecnologias modernas, projetada para oferecer uma experiência de usuário fluida e um backend robusto.

## 📚 Visão Geral

O Quizz_Up é uma aplicação full-stack que permite aos usuários participar e criar quizzes. Possui um frontend dinâmico construído com **React** e **Vite**, estilizado com **TailwindCSS**, e um backend poderoso desenvolvido com **NestJS** e **TypeORM**, utilizando **SQLite** como banco de dados.

## ✨ Tecnologias Utilizadas

### Frontend (`quizz_up`)

* **Framework/Lib:** React 19
* **Build Tool:** Vite
* **Linguagem:** TypeScript
* **Estilização:** TailwindCSS 4
* **Animação:** Framer Motion
* **Roteamento:** React Router DOM
* **Linting:** ESLint

### Backend (`quizz_up_server`)

* **Framework:** NestJS 11
* **Linguagem:** TypeScript
* **Banco de Dados:** SQLite (via TypeORM)
* **Autenticação:** JWT (Passport)
* **ORM:** TypeORM
* **Testes:** Jest

## ⚙️ Como Executar

### Pré-requisitos

* Node.js (versão recomendada: >= 18.x)
* npm ou Yarn

## Clonando
```bash
    git clone [https://github.com/thiago1henrique/quizz_up_server_v2.git](https://github.com/thiago1henrique/quizz_up_server_v2.git)
```

### Backend (`quizz_up_server`)

1.  **Clone o repositório do backend:**
2.  **Instale as dependências:**
    ```bash
    cd quizz_up_server_v2
    npm install
    ```
3.  **Inicie o servidor em modo de desenvolvimento:**
    ```bash
    npm run start:dev
    ```
    O backend estará rodando em `http://localhost:3000`.

### Frontend (`quizz_up`)

*(Presumindo que você tenha o código-fonte do frontend em um diretório separado)*

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd ../quizz_up # ou o caminho correto
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:5173` (ou a porta indicada pelo Vite).

## 📜 Scripts Principais

### Frontend

* `npm run dev`: Inicia o servidor de desenvolvimento.
* `npm run build`: Compila o projeto para produção.
* `npm run lint`: Executa o linter.
* `npm run preview`: Visualiza a build de produção localmente.

### Backend

* `npm run start:dev`: Inicia o servidor em modo de desenvolvimento com watch.
* `npm run build`: Compila o projeto para produção.
* `npm start`: Inicia o servidor em produção.
* `npm run test`: Executa os testes.
* `npm run lint`: Executa o linter.

## 🔗 Repositório do Backend

* [https://github.com/thiago1henrique/quizz_up_server_v2](https://github.com/thiago1henrique/quizz_up_server_v2)

---

Divirta-se criando e respondendo quizzes! 🎉