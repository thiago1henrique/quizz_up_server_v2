export interface QuizResult {
    id: number;
    title: string;
    score: number;
    total: number;
    logo: string;
}

export interface UserProfile {
    id: string;
    name: string;
    quizHistory: QuizResult[];
}

export const sampleUser: UserProfile = {
    id: 'user001',
    name: "Thiago Henrique",
    quizHistory: [
        {
            id: 1,
            title: "JavaScript",
            score: 4,
            total: 5,
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1024px-Unofficial_JavaScript_logo_2.svg.png" // Logo atualizado
        },
        {
            id: 2,
            title: "Python",
            score: 3,
            total: 5,
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png"
        },
        {
            id: 3,
            title: "Banco de Dados",
            score: 5,
            total: 5,
            logo: "https://w7.pngwing.com/pngs/589/216/png-transparent-database-computer-icons-others-miscellaneous-company-text.png"
        },
        {
            id: 4,
            title: "HTML",
            score: 2,
            total: 5,
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/640px-HTML5_logo_and_wordmark.svg.png"
        },
    ],
};