import './App.css';
import './index.css'

import { Routes, Route, Navigate } from 'react-router-dom';
import Cadastro from "./pages/Cadastro.tsx";
import Splash from "./pages/Splash.tsx";
import Login from "./pages/Login.tsx";
import NewQuestion from "./pages/NewQuestion.tsx";
import Menu from "./pages/Menu.tsx"; // Assumindo que Menu é sua página Home
import Quiz from "./pages/Quiz.tsx";
import Profile from "./pages/Profile.tsx";


function App() {
    return (
        <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/newQuestion" element={<NewQuestion />} />
            <Route path="/home" element={<Menu />} />

            {/* ROTA CORRIGIDA ABAIXO */}
            <Route path="/quiz/:id" element={<Quiz />} />

            <Route path="/profile" element={<Profile />} />

            {/* Rota '*' redireciona qualquer URL não encontrada para a raiz */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;