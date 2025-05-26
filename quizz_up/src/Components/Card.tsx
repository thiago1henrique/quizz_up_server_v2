interface CardProps {
    title: string;
    description: string;
    isAdmin?: boolean;
}

const Card = ({ title, description, isAdmin = false }: CardProps) => {
    return (
        <button className="cursor-pointer group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 w-full max-w-xs">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

            <div className="flex flex-col items-center justify-center gap-4 p-6 relative z-10">
                <h2 className="font-bold text-2xl text-gray-800 dark:text-white">{title}</h2>
                <span className="text-gray-600 dark:text-gray-300 text-center">{description}</span>

                <div className="flex items-center gap-3 mt-4">
                    <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-medium transform group-hover:scale-105 transition-transform duration-300">
                        Iniciar quizz
                    </div>

                    {isAdmin && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                className="cursor-pointer p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                                aria-label="Editar quizz"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                className="cursor-pointer p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
                                aria-label="Deletar quizz"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </button>
    );
};

export default Card;