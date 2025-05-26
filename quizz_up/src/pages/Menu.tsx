import { useState, useEffect } from 'react';
import Header from "../Components/Header.tsx";
import CardHome from "../Components/CardHome.tsx";

interface Quiz {
    id: number;
    title: string;
    description: string;
    logo?: string;
}

const Home = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('http://localhost:3000/quizzes');

                if (!response.ok) {
                    throw new Error('Erro ao carregar quizzes');
                }

                const data = await response.json();
                setQuizzes(data);
            } catch (err) {
                // @ts-ignore
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) {
        return (
            <>
                <Header />
                <div className="w-full min-h-dvh flex items-center justify-center">
                    <p>Carregando quizzes...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="w-full min-h-dvh flex items-center justify-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="w-full min-h-dvh flex flex-wrap items-center justify-center gap-4 md:gap-8 p-4 pt-28 max-w-[1200px] mx-auto">
                {quizzes.length > 0 ? (
                    quizzes.map(quiz => (
                        <CardHome
                            key={quiz.id}
                            title={quiz.title}
                            description={quiz.description}
                            imageUrl={quiz.logo ? `http://localhost:3000/uploads/logos/${quiz.logo}` : undefined}
                            quizId={quiz.id}
                        />
                    ))
                ) : (
                    <p>Nenhum quiz disponível no momento.</p>
                )}
            </div>
        </>
    );
};

export default Home;