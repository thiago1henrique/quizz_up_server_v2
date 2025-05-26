// src/pages/Quiz.tsx (ou onde ele estiver)
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
  // --- CORREÇÃO AQUI ---
  const { quizId: quizIdParam } = useParams<{ quizId: string }>(); // Pega 'quizId' da URL
  // Se preferir, poderia ser:
  // const params = useParams<{ quizId: string }>();
  // const quizIdParam = params.quizId;
  // --- FIM DA CORREÇÃO ---

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
      if (!quizIdParam) { // Esta verificação agora deve funcionar corretamente
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
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Quiz não encontrado ou erro no servidor.');
        }
        const data: QuizDataBackend = await response.json();
        setQuizData(data);
        setQuizTitle(data.title);
        const formattedQuestions: QuestionUI[] = data.questions.map(q => {
          const correctAlternative = q.alternatives.find(alt => alt.isCorrect === true);
          const correctIndex = correctAlternative ? q.alternatives.indexOf(correctAlternative) : -1;

          return {
            question: q.title,
            options: q.alternatives.map((alt, index) => ({
              key: String.fromCharCode(65 + index),
              label: alt.text
            })),
            correct: correctIndex !== -1 ? String.fromCharCode(65 + correctIndex) : '', // Lida com caso de não achar correta
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
  }, [quizIdParam]); // A dependência continua sendo quizIdParam

  const question = questions.length > 0 && current < questions.length ? questions[current] : null;

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
    if (loading || showResult || questions.length === 0 || current >= questions.length) return; // Adicionada verificação para 'current'
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextLogic(); // Chama a lógica de avançar
          return 60; // Reseta o tempo para a próxima questão
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current, loading, showResult, questions.length]); // Removido 'handleNextLogic' da dependência para evitar re-criação excessiva

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
      // navigate('/login'); // Comentado para evitar redirecionamento abrupto se o usuário só quiser ver o resultado
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
      // userId: loggedInUser.id, // O backend deve pegar o userId do token
      quizId: parseInt(quizIdParam, 10),
      score: score,
      total: questions.length,
      // Para simplificar e alinhar com a correção do backend, não enviaremos quizTitle e quizLogo
      // quizTitle: quizData.title,
      // quizLogo: quizData.logo || undefined, // Enviar undefined se não houver logo
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
        const errorData = await response.json().catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(errorData.message || 'Falha ao salvar o resultado do quiz.');
      }
      console.log("Resultado do quiz salvo com sucesso!");

    } catch (err: any) {
      console.error("Erro ao salvar resultado do quiz:", err);
      setSaveError("Não foi possível salvar seu resultado: " + err.message);
    }
  };

  useEffect(() => {
    if (showResult && !hasFiredConfetti.current && questions.length > 0) { // Adicionada checagem de questions.length
      hasFiredConfetti.current = true;
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      saveQuizResult();
    }
  }, [showResult, questions.length]); // Adicionado questions.length como dependência

  // --- Renderização (estados de loading, error, e quiz) ---

  if (loading) {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-white pt-20">
                <p className="text-2xl text-gray-600">Carregando quiz...</p>
                {/* Adicionar um spinner ou animação de loading aqui seria bom */}
            </div>
        </>
    );
  }

  if (error) {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-white text-center p-4 pt-20">
                <p className="text-2xl text-red-600 mb-4">{error}</p>
                <Link to="/home" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Voltar para Home
                </Link>
            </div>
        </>
    );
  }
  // Se não houver questões após o loading e sem erro, ou se question for null
  if (!question && !loading) {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-white text-center p-4 pt-20">
                <p className="text-2xl text-gray-600 mb-4">Não foi possível carregar as questões deste quiz ou o quiz é inválido.</p>
                <Link to="/home" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Voltar para Home
                </Link>
            </div>
        </>
    );
  }
  // Esta verificação adicional é para o TypeScript e para evitar renderizar com 'question' nulo
  if (!question) return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-white pt-20">
          <p className="text-2xl text-gray-600">Preparando quiz...</p>
      </div>
    </>
  );


  return (
      <>
          <Header />
          {showResult ? (
              <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-white text-center p-8 pt-20">
                  <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                      <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-6">🎉 Quiz Finalizado!</h1>
                      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{quizTitle}</h2>
                      <div className="relative mb-8">
                          <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-yellow-100 opacity-30"></div>
                          </div>
                          <div className="relative text-6xl md:text-8xl font-extrabold text-gray-800">
                              {score}<span className="text-3xl md:text-5xl text-gray-500">/{questions.length}</span>
                          </div>
                      </div>
                      {saveError && <p className="text-red-500 mb-4 text-sm">{saveError}</p>}
                      <p className="text-xl text-gray-600 mb-8">
                          {score > questions.length / 2 ? 'Ótimo trabalho!' : 'Continue praticando!'}
                      </p>
                      <Link
                          to="/home"
                          className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                          Voltar para Home
                      </Link>
                  </div>
              </div>
          ) : (
              <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col items-center p-4 sm:p-6 pt-24 sm:pt-28"> {/* Ajuste de padding top */}
                  <div className="w-full max-w-4xl mb-6 sm:mb-8">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4 text-center">{quizTitle}</h1>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 text-center">Questão {current + 1} de {questions.length}</h2> {/* Título da questão um pouco menor */}
                      {/* Barra de Progresso e Marcadores de Questão omitidos para simplicidade visual, mas podem ser re-adicionados */}
                  </div>

                  <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 sm:p-8 mb-6 transition-all hover:shadow-lg"> {/* Card da pergunta */}
                      <div className="text-xl sm:text-2xl font-medium text-gray-800 mb-1 text-center">Pergunta:</div>
                      <div className="text-lg sm:text-xl font-semibold text-gray-700 text-center min-h-[3em] flex items-center justify-center">{question.question}</div> {/* Altura mínima e centralização */}
                  </div>

                  <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6"> {/* Grid de alternativas */}
                      {question.options.map(({ key, label }) => (
                          <button
                              key={key}
                              onClick={() => handleSelect(key)}
                              disabled={!!selected}
                              className={`p-4 sm:p-5 rounded-xl text-md sm:text-lg font-medium text-left transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                  selected === key
                                      ? (key === question.correct ? 'bg-green-500 ring-green-600' : 'bg-red-500 ring-red-600') + ' text-white shadow-lg border-transparent'
                                      : selected && key === question.correct
                                          ? 'bg-green-500 text-white shadow-lg border-transparent ring-green-600' // Destaca a correta após seleção errada
                                          : 'bg-white text-gray-800 shadow-sm hover:shadow-md border border-gray-200 hover:border-yellow-400'
                              }`}
                          >
                              <div className="flex items-center">
                                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3 text-sm sm:text-md ${
                                      selected === key ? (key === question.correct ? 'bg-green-600' : 'bg-red-600') : (selected && key === question.correct ? 'bg-green-600' : 'bg-gray-200')
                                  } ${selected ? 'text-white' : 'text-gray-700'}`}>
                                      <span className="font-bold">{key}</span>
                                  </div>
                                  <div>{label}</div>
                              </div>
                          </button>
                      ))}
                  </div>

                
                  <div className="w-full max-w-2xl flex justify-between items-center bg-white rounded-xl shadow-sm p-3 sm:p-4 mt-auto sticky bottom-4">
                      <button
                          className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
                              current === 0 || !!selected 
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                          onClick={handlePrev}
                          disabled={current === 0 || !!selected}
                      >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Anterior
                      </button>

                      <div className="flex items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold shadow-md text-lg">
                              {timeLeft}
                          </div>
                      </div>

                      <button
                          className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg shadow-md hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 text-sm sm:text-base"
                          onClick={handleNext}
                          disabled={!selected && current < questions.length -1} // Desabilita "Próxima" se nenhuma opção foi selecionada (exceto na última questão para "Finalizar")
                      >
                          {current === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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