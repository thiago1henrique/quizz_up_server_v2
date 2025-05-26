import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

const Header = () => {
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const userName = user?.name || 'Usuário';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="flex justify-between items-center w-full h-20 bg-[#16161d] px-4 sm:px-20 fixed z-40">
            <div className="flex items-center gap-6"> {/* Container esquerdo */}
                <Link to="/home">
                    <img src="/logo.svg" alt="logo" className="h-10 pointer-events-none" />
                </Link>

                {/* Botão de Criação de Quiz */}
                <Link
                    to="/newQuestion"
                    className="hidden sm:flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Criar Quiz
                </Link>
            </div>

            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <Link to="/profile" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 bg-purple-500 rounded-full flex justify-center items-center text-white font-bold text-lg group-hover:bg-purple-600 transition-colors">
                                {userInitial}
                            </div>
                            <h2 className="text-white font-medium group-hover:text-purple-300 transition-colors">
                                {userName}
                            </h2>
                        </Link>

                        <button
                            onClick={() => {
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }}
                            className="text-white font-bold hover:text-red-500 transition-colors"
                        >
                            LogOut
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="text-white font-bold hover:text-green-500 transition-colors">
                        Login
                    </Link>
                )}
            </div>
        </header>
    )
}

export default Header;