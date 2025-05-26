// src/pages/NewQuestion.tsx (ou seu caminho)
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Inputs from "../Components/Inputs.tsx";
import Button from "../Components/Button.tsx";
import Header from "../Components/Header.tsx";


interface Question {
    question: string;
    options: string[];
    correctAnswer: number; 
}

interface QuestionPayload {
    title: string;
    alternatives: { text: string; isCorrect: boolean }[];
}


interface QuizDataFromBackend {
    id: number;
    title: string;
    description: string;
    logo?: string;
    questions: QuestionPayload[];
}

const NewQuestion = () => {
    const { quizId } = useParams<{ quizId?: string }>();
    const isEditMode = Boolean(quizId); 

 
    const [quizName, setQuizName] = useState("");
    const [quizDescription, setQuizDescription] = useState("");
    const [quizLogoFile, setQuizLogoFile] = useState<File | null>(null); 
    const [previewLogo, setPreviewLogo] = useState<string | null>(null); 
    const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null); 
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<Question[]>(
        Array(5).fill(null).map(() => ({
            question: "", options: ["", "", "", ""], correctAnswer: 0
        }))
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFetchingData, setIsFetchingData] = useState(isEditMode); 

    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (isEditMode && quizId) {
            setIsFetchingData(true);
            setError(null);
            fetch(`http://localhost:3000/quizzes/${quizId}`)
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(errData => {
                            throw new Error(errData.message || 'Falha ao carregar dados do quiz para edição.');
                        });
                    }
                    return res.json();
                })
                .then((data: QuizDataFromBackend) => {
                    setQuizName(data.title);
                    setQuizDescription(data.description);
                    if (data.logo) {
                        setExistingLogoUrl(`http://localhost:3000/uploads/logos/${data.logo}`);
                    } else {
                        setExistingLogoUrl(null);
                    }

                    const loadedQuestions = data.questions.map(qPayload => ({
                        question: qPayload.title,
                        options: qPayload.alternatives.map(alt => alt.text),
                        correctAnswer: qPayload.alternatives.findIndex(alt => alt.isCorrect === true),
                    }));
                    setQuestions(loadedQuestions.length > 0 ? loadedQuestions : 
                        Array(5).fill(null).map(() => ({
                            question: "", options: ["", "", "", ""], correctAnswer: 0
                        }))
                    );
                    setCurrentQuestionIndex(0); 
                })
                .catch(err => {
                    console.error("Erro ao buscar quiz para edição:", err);
                    setError(err.message);
                })
                .finally(() => setIsFetchingData(false));
        } else {
            setIsFetchingData(false);
        }
    }, [quizId, isEditMode]);

    
    const handleQuizNameChange = (e: ChangeEvent<HTMLInputElement>) => setQuizName(e.target.value);
    const handleQuizDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => setQuizDescription(e.target.value);

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setQuizLogoFile(file); 
            if (previewLogo) URL.revokeObjectURL(previewLogo);
            setPreviewLogo(URL.createObjectURL(file)); 
        } else {
            setQuizLogoFile(null);
            setPreviewLogo(null);
        }
    };

    const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
        const updatedQuestions = questions.map((q, idx) =>
            idx === currentQuestionIndex ? { ...q, question: e.target.value } : q
        );
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (optionIndex: number, value: string) => {
        const updatedQuestions = questions.map((q, idx) =>
            idx === currentQuestionIndex ? {
                ...q,
                options: q.options.map((opt, i) => i === optionIndex ? value : opt)
            } : q
        );
        setQuestions(updatedQuestions);
    };

    const handleCorrectAnswerChange = (optionIndex: number) => {
        const updatedQuestions = questions.map((q, idx) =>
            idx === currentQuestionIndex ? { ...q, correctAnswer: optionIndex } : q
        );
        setQuestions(updatedQuestions);
    };

    const validateForm = (): boolean => {
        setError(null);
        if (!quizName.trim() || !quizDescription.trim()) {
            setError("Preencha o Título e a Descrição do Quiz.");
            return false;
        }
        if (!isEditMode && !quizLogoFile) {
            setError("Selecione um Logo para o novo quiz.");
            return false;
        }
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question.trim() || q.options.some(opt => !opt.trim())) {
                setError(`Preencha todas as perguntas e alternativas (Questão ${i + 1}).`);
                return false;
            }
            if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
                setError(`Selecione uma resposta correta para a Questão ${i + 1}.`);
                return false;
            }
        }
        return true;
    };

    const handleSubmitQuiz = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        const questionsPayload: QuestionPayload[] = questions.map(q => ({
            title: q.question,
            alternatives: q.options.map((opt, index) => ({
                text: opt,
                isCorrect: index === q.correctAnswer
            }))
        }));

        const url = isEditMode ? `http://localhost:3000/quizzes/${quizId}` : 'http://localhost:3000/quizzes';
        const method = isEditMode ? 'PUT' : 'POST';

        let bodyData: FormData | string;
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (quizLogoFile) { 
            const formData = new FormData();
            formData.append('title', quizName);
            formData.append('description', quizDescription);
            formData.append('questions', JSON.stringify(questionsPayload));
            formData.append('logo', quizLogoFile);
            if (!isEditMode) { 
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const loggedUser = JSON.parse(storedUser);
                    formData.append('userId', loggedUser.id);
                }
            }
            bodyData = formData;
        } else { 
            const jsonData: any = {
                title: quizName,
                description: quizDescription,
                questions: questionsPayload,
            };
            if (!isEditMode) { 
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const loggedUser = JSON.parse(storedUser);
                    jsonData.userId = loggedUser.id;
                }
            }
            bodyData = JSON.stringify(jsonData);
            headers['Content-Type'] = 'application/json';
        }


        try {
            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: bodyData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
                throw new Error(errorData.message || `Erro no servidor ao ${isEditMode ? 'atualizar' : 'criar'} o quiz.`);
            }

            await response.json();
            alert(`Quiz ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
            navigate('/home');

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro de comunicação.');
            console.error("Erro ao submeter quiz:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextQuestion = () => {
        const q = questions[currentQuestionIndex];
        if (!q.question.trim() || q.options.some(opt => !opt.trim())) {
            setError(`Preencha a pergunta e todas as alternativas (Questão ${currentQuestionIndex + 1}) antes de prosseguir.`);
            return;
        }
        setError(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmitQuiz(); 
        }
    };

    const handlePreviousQuestion = () => {
        setError(null);
        setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
    };

    if (isFetchingData) { 
        return (
             <section className="bg-gray-50 min-h-screen">
                <Header />
                <div className="w-full min-h-dvh flex items-center justify-center pt-24">
                    <p className="text-xl">Carregando dados do quiz para edição...</p>
                </div>
            </section>
        );
    }

    const currentQuestionData = questions[currentQuestionIndex] || { question: "", options: ["", "", "", ""], correctAnswer: 0 };


    return (
        <section className="bg-gray-50 min-h-screen">
            <Header />
            <div className={"w-full flex flex-col items-center justify-center px-4 sm:px-0 pt-[8rem] pb-10 sm:pt-24"}>
                <div className={"bg-white p-0 sm:p-10 rounded-lg shadow-xl w-full max-w-2xl"}>
                    <h1 className={"text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800"}>
                        {isEditMode ? "Editar Quiz" : "Criar Novo Quiz"}
                    </h1>

                    <div className="mb-6 p-4 border rounded-md bg-gray-50">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Logo do Quiz {isEditMode && "(Opcional ao editar. Selecione para alterar.)"}</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/gif"
                                onChange={handleLogoUpload}
                                ref={fileInputRef}
                                className="hidden"
                                disabled={isLoading}
                            />
                            <Button
                                title="Escolher Imagem"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                            />
                            
                            {previewLogo && (
                                <img src={previewLogo} alt="Pré-visualização novo logo" className="h-16 w-16 object-contain rounded border"/>
                            )}
                            
                            {isEditMode && !previewLogo && existingLogoUrl && (
                                <img src={existingLogoUrl} alt="Logo atual" className="h-16 w-16 object-contain rounded border"/>
                            )}
                        </div>
                        {!quizLogoFile && !existingLogoUrl && !isEditMode && <p className="text-xs text-gray-500 mt-1">Selecione uma imagem (PNG, JPG, GIF).</p>}
                    </div>

                    
                    <Inputs label={'Nome do Quiz'} type={'text'} placeholder={"Ex: Conhecimentos Gerais"} value={quizName} onChange={handleQuizNameChange} />
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Descrição do Quiz</label>
                        <textarea id="description" placeholder="Descreva sobre o que é o seu quiz..." value={quizDescription} onChange={handleQuizDescriptionChange} disabled={isLoading} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 disabled:bg-gray-100"/>
                    </div>

                    
                    <div className={"py-6 mt-6 border-t"}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Questão {currentQuestionIndex + 1}/{questions.length}</h2>
                        <Inputs
                            label={'Insira sua pergunta'}
                            type={'text'}
                            placeholder={`Pergunta ${currentQuestionIndex + 1}`}
                            value={currentQuestionData.question}
                            onChange={handleQuestionChange}
                        />
                        <div className="mt-4">
                            <h3 className="font-medium mb-2 text-gray-700">Alternativas (Marque a correta):</h3>
                            {currentQuestionData.options.map((option, index) => (
                                <Inputs
                                    key={`${currentQuestionIndex}-${index}`} 
                                    label={`Alternativa ${index + 1}`}
                                    type={'text'}
                                    placeholder={`Alternativa ${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    showCheckbox={true}
                                    isCorrect={currentQuestionData.correctAnswer === index}
                                    onCheckboxChange={() => handleCorrectAnswerChange(index)}
                                />
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-red-600 text-center font-bold mt-4 p-3 bg-red-100 rounded">{error}</p>}

                    
                    <div className={"flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"}>
                        <Button
                            title={"Questão Anterior"}
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0 || isLoading}
                        />
                        <Button
                            title={
                                isLoading ? (isEditMode ? "Salvando..." : "Enviando...") :
                                currentQuestionIndex < questions.length - 1
                                    ? `Próxima Questão (${currentQuestionIndex + 2}/${questions.length})`
                                    : (isEditMode ? "Salvar Alterações" : "Finalizar e Salvar Quiz")
                            }
                            onClick={currentQuestionIndex < questions.length - 1 ? handleNextQuestion : handleSubmitQuiz}
                            disabled={isLoading}
                        
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NewQuestion;