import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Header from "../Components/Header.tsx";

interface QuestionUI {
  question: string;
  options: { key: string; label: string }[];
  correct: string;
}

interface QuizDataBackend {
  id: number;
  title: string;
  description: string;
  logo?: string; 
  questions: {
    title: string;
    alternatives: { text: string; isCorrect: boolean }[];
  }[];
}

const Quiz = () => {
  const { id: quizIdParam } = useParams<{ id: string }>(); 
  const navigate = useNavigate(); 

  const [quizData, setQuizData] = useState<QuizDataBackend | null>(null); 
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionUI[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState(''); 
  const hasFiredConfetti = useRef(false); 

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizIdParam) {
        setError("ID do Quiz não fornecido.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      setSaveError('');
      try {
        const response = await fetch(`http://localhost:3000/quizzes/${quizIdParam}`);
        if (!response.ok) {
          throw new Error('Quiz não encontrado ou erro no servidor.');
        }
        const data: QuizDataBackend = await response.json();
        setQuizData(data); 
        setQuizTitle(data.title);
        const formattedQuestions: QuestionUI[] = data.questions.map(q => {
          const correctIndex = q.alternatives.findIndex(alt => alt.isCorrect);
          return {
            question: q.title,
            options: q.alternatives.map((alt, index) => ({
              key: String.fromCharCode(65 + index),
              label: alt.text
            })),
            correct: String.fromCharCode(65 + correctIndex)
          };
        });
        setQuestions(formattedQuestions);
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro ao carregar o quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizIdParam]);

  const question = questions.length > 0 ? questions[current] : null;

  const handleNextLogic = () => { 
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setTimeLeft(60);
    } else {
      setShowResult(true);
    }
  };

  const handleNext = handleNextLogic; 

  useEffect(() => {
    if (loading || showResult || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextLogic();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current, loading, showResult, questions.length]);

  const handleSelect = (key: string) => {
    if (!question || selected) return;
    setSelected(key);
    if (key === question.correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(null);
      setTimeLeft(60);
    }
  };

  const saveQuizResult = async () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!token || !userString) {
      setSaveError("Você precisa estar logado para salvar seu resultado.");
      navigate('/login'); 
      return;
    }
    if (!quizData || !quizIdParam) {
      setSaveError("Dados do quiz não encontrados para salvar o resultado.");
      return;
    }

    let loggedInUser;
    try {
      loggedInUser = JSON.parse(userString);
    } catch (e) {
      console.error("Erro ao parsear usuário do localStorage", e);
      setSaveError("Erro ao processar dados do usuário.");
      return;
    }

    if (!loggedInUser || !loggedInUser.id) {
      setSaveError("ID do usuário não encontrado para salvar resultado.");
      return;
    }

    const attemptData = {
      userId: loggedInUser.id,
      quizId: parseInt(quizIdParam, 10),
      score: score,
      total: questions.length, 
      quizTitle: quizData.title,
      quizLogo: quizData.logo || null, 
    };

    try {
      setSaveError('');
      const response = await fetch('http://localhost:3000/quizzes/save-result', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attemptData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao salvar o resultado do quiz.');
      }
      console.log("Resultado do quiz salvo com sucesso!");
      
    } catch (err: any) {
      console.error("Erro ao salvar resultado do quiz:", err);
      setSaveError("Não foi possível salvar seu resultado: " + err.message);
    }
  };

  useEffect(() => {
    if (showResult && !hasFiredConfetti.current) {
      hasFiredConfetti.current = true;
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      saveQuizResult(); 
    }
  }, [showResult]);


  if (loading) {
    return (
        <>
          <Header />
          <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-2xl text-gray-600">Carregando quiz...</p>
          </div>
        </>
    );
  }

  if (error) {
    return (
        <>
          <Header />
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <p className="text-2xl text-red-600 mb-4">{error}</p>
            <Link to="/home" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Voltar para Home
            </Link>
          </div>
        </>
    );
  }

  if (!question && !loading) {
    return (
        <>
          <Header />
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <p className="text-2xl text-gray-600 mb-4">Não foi possível carregar as questões deste quiz ou quiz inválido.</p>
            <Link to="/home" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Voltar para Home
            </Link>
          </div>
        </>
    );
  }
  if (!question) return null; 

  return (
      <>
        <Header />
        {showResult ? (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-white text-center p-8">
              <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-6">🎉 Quiz Finalizado!</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">{quizTitle}</h2>
                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-yellow-100 opacity-30"></div>
                  </div>
                  <div className="relative text-6xl md:text-8xl font-extrabold text-gray-800">
                    {score}<span className="text-3xl md:text-5xl text-gray-500">/{questions.length}</span>
                  </div>
                </div>
                {saveError && <p className="text-red-500 mb-4">{saveError}</p>}
                <p className="text-xl text-gray-600 mb-8">
                  {score > questions.length / 2 ? 'Ótimo trabalho!' : 'Continue praticando!'}
                </p>
                <Link
                    to="/home"
                    className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Voltar para Home
                </Link>
              </div>
            </div>
        ) : (
            <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col items-center p-6 pt-44">
              <div className="w-full max-w-4xl mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">{quizTitle}</h1>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Questão {current + 1} de {questions.length}</h2>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div
                      className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between w-full">
                  {questions.map((_, index) => (
                      <div
                          key={index}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                              index === current
                                  ? 'bg-yellow-400 text-white border-yellow-500 scale-110'
                                  : index < current
                                      ? 'bg-green-100 text-green-600 border-green-300'
                                      : 'bg-gray-100 text-gray-600 border-gray-300'
                          }`}
                      >
                        {index + 1}
                      </div>
                  ))}
                </div>
              </div>

              <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8 mb-8 transition-all hover:shadow-lg">
                <div className="text-2xl font-medium text-gray-800 mb-2">Pergunta:</div>
                <div className="text-xl font-semibold text-gray-700">{question.question}</div>
              </div>

              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {question.options.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => handleSelect(key)}
                        disabled={!!selected}
                        className={`p-6 rounded-xl text-lg font-medium text-left transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed ${
                            selected === key
                                ? (key === question.correct ? 'bg-green-400' : 'bg-red-400') + ' text-white shadow-md border-2'
                                : selected && key === question.correct
                                    ? 'bg-green-400 text-white shadow-md border-2'
                                    : 'bg-white text-gray-800 shadow-sm hover:shadow-md border-2 border-gray-100'
                        }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                            selected === key ? (key === question.correct ? 'bg-green-500' : 'bg-red-500') : (selected && key === question.correct ? 'bg-green-500' : 'bg-gray-100')
                        }`}>
                          <span className={`font-bold ${selected ? 'text-white' : 'text-gray-600'}`}>{key}.</span>
                        </div>
                        <div>{label}</div>
                      </div>
                    </button>
                ))}
              </div>

              <div className="w-full max-w-4xl flex justify-between items-center bg-white rounded-xl shadow-sm p-4">
                <button
                    className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                        current === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={handlePrev}
                    disabled={current === 0 || !!selected}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold shadow-md">
                    {timeLeft}
                  </div>
                </div>

                <button
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg shadow-md hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105"
                    onClick={handleNext}
                >
                  {current === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
        )}
      </>
  );
};
export default Quiz;