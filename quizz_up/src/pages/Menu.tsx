import { useState, useEffect } from 'react';
import Header from "../Components/Header.tsx";
import CardHome from "../Components/CardHome.tsx"; 

interface Quiz {
    id: number;
    title: string;
    description: string;
    logo?: string; 
}


interface User {
    id: number;
    name: string;
    email: string;
    role: string; 
}

const Home = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [user, setUser] = useState<User | null>(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Erro ao carregar usuário do localStorage:", e);
            }
        }

        const fetchQuizzes = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('http://localhost:3000/quizzes');
                if (!response.ok) {
                    throw new Error('Erro ao carregar quizzes');
                }
                const data = await response.json();
                setQuizzes(data);
            } catch (err: any) {
                setError(err.message || 'Um erro desconhecido ocorreu.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    
    const isAdmin = user?.role === 'admin';

    
    const handleDeleteQuiz = async (quizId: number | string) => {
        if (!token) {
            alert("Autenticação necessária para excluir.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/quizzes/${quizId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro ao excluir.' }));
                throw new Error(errorData.message || 'Falha ao excluir o quiz.');
            }

            // Remove o quiz da lista local para atualizar a UI
            setQuizzes(prevQuizzes => prevQuizzes.filter(q => q.id !== quizId));
            alert('Quiz excluído com sucesso!');

        } catch (err: any) {
            setError(err.message);
            alert(`Erro ao excluir: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="w-full min-h-dvh flex items-center justify-center pt-24">
                    <p>Carregando quizzes...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="w-full min-h-dvh flex items-center justify-center pt-24">
                    <p className="text-red-500">{error || "Ocorreu um erro."}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="w-full min-h-dvh flex flex-wrap items-stretch justify-center gap-6 p-4 pt-28 max-w-screen-xl mx-auto"> {/* items-stretch para cards de mesma altura */}
                {quizzes.length > 0 ? (
                    quizzes.map(quiz => (
                        <div key={quiz.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 flex">
                            <CardHome
                                title={quiz.title}
                                description={quiz.description}
                                imageUrl={quiz.logo ? `http://localhost:3000/uploads/logos/${quiz.logo}` : undefined}
                                quizId={quiz.id}
                                isAdmin={isAdmin} 
                                onDelete={handleDeleteQuiz} 
                            />
                        </div>
                    ))
                ) : (
                    !loading && <p className="col-span-full text-center">Nenhum quiz disponível no momento.</p>
                )}
            </div>
        </>
    );
};

export default Home;