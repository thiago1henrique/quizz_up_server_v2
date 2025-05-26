import { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Inputs from "../Components/Inputs.tsx"; // Verifique se o caminho está correto
import Button from "../Components/Button.tsx"; // Verifique se o caminho está correto
import Header from "../Components/Header.tsx"; // Verifique se o caminho está correto

// Interface para o estado interno do formulário
interface Question {
    question: string;
    options: string[];
    correctAnswer: number; // Armazena o índice da resposta correta (0 a 3)
}

// Interface para o payload enviado ao backend (alternativas com isCorrect)
interface QuestionPayload {
    title: string;
    alternatives: { text: string; isCorrect: boolean }[];
}

const NewQuestion = () => {
    // --- Estados do Componente ---
    const [quizName, setQuizName] = useState("");
    const [quizDescription, setQuizDescription] = useState("");
    const [quizLogo, setQuizLogo] = useState<File | null>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<Question[]>(
        // Inicializa 5 objetos de questão *distintos*
        Array(5).fill(0).map(() => ({
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0
        }))
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Hooks e Refs ---
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // --- Acesso à Questão Atual ---
    const currentQuestion = questions[currentQuestionIndex];

    // --- Handlers para Inputs e Ações ---

    const handleQuizNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuizName(e.target.value);
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setQuizLogo(file);
            if (previewLogo) {
                URL.revokeObjectURL(previewLogo); // Libera memória do preview anterior
            }
            setPreviewLogo(URL.createObjectURL(file)); // Cria URL para novo preview
        } else {
            setQuizLogo(null);
            setPreviewLogo(null);
        }
    };

    const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].question = e.target.value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (index: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].options[index] = value;
        setQuestions(updatedQuestions);
    };

    const handleCorrectAnswerChange = (index: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].correctAnswer = index;
        setQuestions(updatedQuestions);
    };

    // --- Validação do Formulário ---
    const validateForm = (): boolean => {
        setError(null); // Limpa erros antigos
        if (!quizName.trim() || !quizDescription.trim() || !quizLogo) {
            setError("Preencha o Título, Descrição e selecione um Logo.");
            return false;
        }
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question.trim() || q.options.some(opt => !opt.trim())) {
                setError(`Preencha todas as perguntas e alternativas (Questão ${i + 1}).`);
                return false;
            }
        }
        return true;
    };

    // --- Função de Envio para o Backend ---
    const handleSubmitQuiz = async () => {
        if (!validateForm()) return; // Aborta se a validação falhar

        setIsLoading(true);
        setError(null);

        const formData = new FormData();

        // Transforma as questões para o formato com 'isCorrect'
        const questionsPayload: QuestionPayload[] = questions.map(q => ({
            title: q.question,
            alternatives: q.options.map((opt, index) => ({
                text: opt,
                isCorrect: index === q.correctAnswer
            }))
        }));

        // Adiciona os dados ao FormData
        formData.append('title', quizName);
        formData.append('description', quizDescription);
        formData.append('userId', '1'); // !!! ATENÇÃO: Substitua pelo ID do usuário real! !!!
        formData.append('questions', JSON.stringify(questionsPayload));
        if (quizLogo) {
            formData.append('logo', quizLogo);
        }

        // --- Requisição Fetch ---
        try {
            const response = await fetch('http://localhost:3000/quizzes', { // Confirme a URL
                method: 'POST',
                body: formData,
                // Não defina 'Content-Type', o browser fará isso com 'FormData'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao processar a resposta.' }));
                throw new Error(errorData.message || 'Erro no servidor ao criar o quiz.');
            }

            await response.json(); // Processa a resposta (pode pegar o ID se precisar)
            alert('Quiz criado com sucesso!');
            navigate('/home'); // <<<--- REDIRECIONA PARA /home

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro de comunicação.');
            console.error("Erro ao submeter quiz:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Funções de Navegação entre Questões ---
    const handleNextQuestion = () => {
        // Valida a questão atual antes de ir para a próxima (opcional, mas bom)
        const q = currentQuestion;
        if (!q.question.trim() || q.options.some(opt => !opt.trim())) {
            setError(`Preencha a pergunta e todas as alternativas antes de prosseguir.`);
            return;
        }
        setError(null); // Limpa erro se passou

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmitQuiz(); // Se for a última, chama o envio
        }
    };

    const handlePreviousQuestion = () => {
        setError(null); // Limpa erros ao voltar
        setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
    };

    // --- Renderização do Componente ---
    return (
        <section className="bg-gray-50">
            <Header />
            <div className={"w-full min-h-dvh flex flex-col items-center justify-center px-4 sm:px-0 pt-[8rem] pb-10 sm:pt-24"}>
                <div className={"bg-white p-6 sm:p-10 rounded-lg shadow-xl w-full max-w-2xl"}>
                    <h1 className={"text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800"}>Criar Novo Quiz</h1>

                    {/* --- Input do Logo --- */}
                    <div className="mb-6 p-4 border rounded-md bg-gray-50">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Logo do Quiz</label>
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
                                <img
                                    src={previewLogo}
                                    alt="Pré-visualização do logo"
                                    className="h-16 w-16 object-cover rounded border"
                                />
                            )}
                        </div>
                        {!quizLogo && <p className="text-xs text-gray-500 mt-1">Selecione uma imagem (PNG, JPG, GIF).</p>}
                    </div>

                    {/* --- Nome e Descrição --- */}
                    <Inputs
                        label={'Nome do Quiz'}
                        type={'text'}
                        placeholder={"Ex: Conhecimentos Gerais"}
                        value={quizName}
                        onChange={handleQuizNameChange}
                    />
                    {/* Usando Textarea para Descrição */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Descrição do Quiz
                        </label>
                        <textarea
                            id="description"
                            placeholder="Descreva sobre o que é o seu quiz..."
                            value={quizDescription}
                            onChange={(e) => setQuizDescription(e.target.value)}
                            disabled={isLoading}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 disabled:bg-gray-100"
                        />
                    </div>


                    {/* --- Questões --- */}
                    <div className={"py-6 mt-6 border-t"}>
                        <h2 className="text-2xl font-semibold text-gray-800">Questão {currentQuestionIndex + 1}/{questions.length}</h2>
                        <Inputs
                            label={'Insira sua pergunta'}
                            type={'text'}
                            placeholder={`Pergunta ${currentQuestionIndex + 1}`}
                            value={currentQuestion.question}
                            onChange={handleQuestionChange}
                        />

                        <div className="mt-4">
                            <h3 className="font-medium mb-2 text-gray-700">Alternativas (Marque a correta):</h3>
                            {currentQuestion.options.map((option, index) => (
                                <Inputs
                                    key={`${currentQuestionIndex}-${index}`}
                                    label={`Alternativa ${index + 1}`}
                                    type={'text'}
                                    placeholder={`Alternativa ${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    showCheckbox={true}
                                    isCorrect={currentQuestion.correctAnswer === index}
                                    onCheckboxChange={() => handleCorrectAnswerChange(index)} // Passa só a função

                                />
                            ))}
                        </div>

                        {/* --- Mensagem de Erro --- */}
                        {error && <p className="text-red-600 text-center font-bold mt-4 p-3 bg-red-100 rounded">{error}</p>}

                        {/* --- Botões de Navegação/Envio --- */}
                        <div className={"flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"}>
                            <Button
                                title={"Voltar"}
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0 || isLoading}
                            />
                            <Button
                                title={
                                    isLoading ? "Enviando..." :
                                        currentQuestionIndex < questions.length - 1
                                            ? `Próxima Questão (${currentQuestionIndex + 2}/${questions.length})`
                                            : "Finalizar e Salvar Quiz"
                                }
                                onClick={handleNextQuestion}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NewQuestion;