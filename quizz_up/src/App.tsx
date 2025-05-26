// App.tsx
import './App.css';
import './index.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import Cadastro from "./pages/Cadastro.tsx";
import Splash from "./pages/Splash.tsx";
import Login from "./pages/Login.tsx";
import NewQuestion from "./pages/NewQuestion.tsx";
import Menu from "./pages/Menu.tsx";
import QuizPage from "./pages/Quiz.tsx";
import Profile from "./pages/Profile.tsx";
import ProtectedRoute from '../src/Components/ProtectedRoute.tsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            
            <Route 
                path="/newQuestion" 
                element={<ProtectedRoute element={<NewQuestion />} />} 
            />
            <Route 
                path="/edit-quiz/:quizId" 
                element={<ProtectedRoute element={<NewQuestion />} />} 
            />
            <Route 
                path="/home" 
                element={<ProtectedRoute element={<Menu />} />} 
            />
            <Route 
                path="/quiz/:quizId" 
                element={<ProtectedRoute element={<QuizPage />} />} 
            />
            <Route 
                path="/profile" 
                element={<ProtectedRoute element={<Profile />} />} 
            />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;