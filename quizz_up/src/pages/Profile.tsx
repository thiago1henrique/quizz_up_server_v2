import { useState, useEffect } from 'react';
import Header from "../Components/Header.tsx";
import { Link, useNavigate } from "react-router-dom";

interface QuizHistoryItem {
    id: number;
    title: string;
    score: number;
    total: number;
    logo: string;
    createdAt: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    quizHistory: QuizHistoryItem[];
}

const Profile = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login'); // Redireciona para login após logout
    };

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const userString = localStorage.getItem('user'); // Pega o user do localStorage

                if (!token || !userString) { // Se não tiver token OU userString
                    navigate('/login');      // Redireciona para login
                    return;
                }

                let loggedInUser;
                try {
                    loggedInUser = JSON.parse(userString); // Faz o parse do userString
                } catch (e) {
                    console.error("Erro ao parsear dados do usuário do localStorage", e);
                    handleLogout(); // Se não conseguir parsear, desloga
                    return;
                }

                if (!loggedInUser || !loggedInUser.id) { // Verifica se o user e user.id existem
                    console.error("ID do usuário não encontrado no localStorage");
                    handleLogout(); // Se não tiver ID, desloga
                    return;
                }

                const userId = loggedInUser.id; // Pega o ID do usuário

                // Faz a requisição para /users/:id
                const response = await fetch(`http://localhost:3000/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envia o token
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) { // Se não autorizado (token inválido)
                    handleLogout();
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Erro ao carregar perfil' }));
                    throw new Error(errorData.message || 'Erro ao carregar perfil');
                }

                const data: UserData = await response.json();

                // --- ADAPTADO AQUI ---
                // Verifica se quizHistory existe. Se não, define como array vazio.
                if (!data.quizHistory) {
                    console.warn('Dados de histórico (quizHistory) não encontrados na resposta. Usando array vazio.', data);
                    setUserData({ ...data, quizHistory: [] }); // Garante que userData é setado e quizHistory é um array
                } else {
                    setUserData(data); // Se existe, usa os dados como vieram
                }
                // --- FIM DA ADAPTAÇÃO ---

            } catch (err: any) {
                if (err.message === 'Failed to fetch') {
                    setError('Erro de conexão com o servidor.');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]); // navigate é a única dependência externa que pode mudar e afetar a lógica


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-32 text-center">
                    {/* Skeleton Loader */}
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="flex justify-center gap-6 mt-6">
                            <div className="h-20 bg-gray-200 rounded-xl w-32"></div>
                            <div className="h-20 bg-gray-200 rounded-xl w-32"></div>
                        </div>
                        <div className="mt-12 space-y-4">
                            <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
                            <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-32 text-center">
                    <p className="text-red-500 text-xl mb-4">{error || 'Não foi possível carregar os dados do perfil.'}</p>
                    <button
                        onClick={handleLogout}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Fazer login novamente
                    </button>
                </div>
            </div>
        );
    }

    // Agora userData.quizHistory é garantido ser um array (pode ser vazio, mas não undefined/null)
    const { name: studentName, quizHistory } = userData;
    const totalScore = quizHistory.reduce((acc, quiz) => acc + quiz.score, 0);
    const totalQuestions = quizHistory.reduce((acc, quiz) => acc + quiz.total, 0);
    const successRate = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-32">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Olá, {studentName}!</h1>
                    <p className="text-lg text-gray-600">Acompanhe seu progresso e histórico de quizzes</p>

                    <div className="flex justify-center gap-6 mt-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm w-32 text-center border">
                            <div className="text-3xl font-bold text-yellow-500">{quizHistory.length}</div>
                            <div className="text-gray-500">Quizzes</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm w-32 text-center border">
                            <div className="text-3xl font-bold text-green-500">
                                {successRate}%
                            </div>
                            <div className="text-gray-500">Taxa de acerto</div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Seu histórico
                    </h2>

                    <div className="space-y-4">
                        {quizHistory.length === 0 ? (
                            <p className="text-center text-gray-500 bg-white p-6 rounded-xl shadow-sm border">
                                Você ainda não completou nenhum quiz.
                            </p>
                        ) : (
                            quizHistory.map((quiz) => {
                                const percentage = quiz.total > 0 ? Math.round((quiz.score / quiz.total) * 100) : 0;
                                const quizDate = new Date(quiz.createdAt).toLocaleDateString('pt-BR');
                                const logoUrl = quiz.logo ? `http://localhost:3000/uploads/logos/${quiz.logo}` : "https://cdn-icons-png.flaticon.com/512/3409/3409310.png";

                                return (
                                    <div key={quiz.id} className="flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border">
                                        <div className="flex-shrink-0 mr-4">
                                            <img src={logoUrl} alt={`Logo ${quiz.title}`} className="w-16 h-16 object-contain rounded-lg bg-gray-100 p-1" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">Realizado em: {quizDate}</p>
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-yellow-500 h-2.5 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-500 mt-1">
                                                    <span>{quiz.score} de {quiz.total} corretas</span>
                                                    <span>{percentage}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            {quiz.score === quiz.total ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    Perfeito!
                                                </span>
                                            ) : quiz.score >= quiz.total * 0.7 ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    Bom trabalho
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                                    Continue praticando
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="text-center mt-8 space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:gap-4">
                    <Link to={"/home"}>
                        <button className="cursor-pointer inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium rounded-lg shadow-md hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 w-full sm:w-auto">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Fazer novo quiz
                        </button>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="cursor-pointer inline-flex items-center px-6 py-3 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition-all transform hover:scale-105 w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair da conta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;