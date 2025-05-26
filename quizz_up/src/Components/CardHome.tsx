import { Link } from "react-router-dom";

// Interface atualizada para incluir as props necessárias
interface CardHomeProps {
    title: string;
    description: string;
    imageUrl?: string; // Usando imageUrl (opcional) em vez de 'cover'
    quizId: number | string; // ID do Quiz para construir a rota
    isAdmin?: boolean;
    onDelete?: (quizId: number | string) => void; // Passa o ID para a função de delete
}

const CardHome = ({ title, description, imageUrl, quizId, isAdmin = false, onDelete }: CardHomeProps) => {

    // Constrói a rota para jogar o quiz
    const quizRoute = `/quiz/${quizId}`;
    // Constrói a rota para editar o quiz (ajuste se sua rota for diferente)
    const editRoute = `/edit-quiz/${quizId}`;

    // Define uma imagem padrão caso 'imageUrl' não seja fornecida
    const displayImage = imageUrl || "https://cdn-icons-png.flaticon.com/512/3409/3409310.png"; // Use um placeholder

    // Handler para o botão de deletar, prevenindo navegação e chamando onDelete
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Impede a navegação do Link pai
        e.stopPropagation(); // Impede outros eventos de clique
        if (window.confirm(`Tem certeza que deseja excluir o quiz "${title}"?`)) {
            onDelete?.(quizId); // Chama a função passando o ID
        }
    };

    return (
        <div className="group relative h-full w-full sm:w-[300px]"> {/* Adicionado w-full e sm:w-[300px] */}
            {/* Link principal para jogar o quiz */}
            <Link to={quizRoute}>
                <div className="h-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border border-gray-100 flex flex-col"> {/* Adicionado flex flex-col */}
                    {/* Imagem do Card */}
                    <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden pt-4">
                        <img
                            className="w-[50px] h-[50px] object-cover"
                            src={displayImage}
                            alt={title}
                        />
                    </div>

                    <div className="p-6 flex flex-col items-center flex-grow">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{title}</h3>
                        <p className="text-gray-600 text-center text-sm flex-grow">{description}</p>
                        <span
                            className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                            Iniciar Quiz
                        </span>
                    </div>
                </div>
            </Link>

            {/* Botões de Admin (Editar/Excluir) */}
            {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Botão Editar */}
                    <Link to={editRoute}> {/* Link para a rota de edição */}
                        <button
                            onClick={(e) => e.stopPropagation()} // Impede o link pai de ser acionado
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors cursor-pointer shadow-md"
                            aria-label="Editar quiz"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                    </Link>

                    {/* Botão Excluir */}
                    <button
                        onClick={handleDeleteClick}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer shadow-md"
                        aria-label="Excluir quiz"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CardHome;