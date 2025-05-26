import { useState } from 'react';
import Inputs from "../Components/Inputs.tsx";
import Button from "../Components/Button.tsx";
import { Link, useNavigate } from "react-router-dom"; // 1. Importe useNavigate

const Cadastro = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        acceptedTerms: false
    });
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate(); // 2. Instancie o hook

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));

        if (id === 'password') {
            validatePassword(value);
        }
    };

    const validatePassword = (password: string) => {
        const specialChars = /[!@#$%^&*(),.?":{}|<>]/;

        if (password.length < 6) {
            setPasswordError('A senha deve ter pelo menos 6 caracteres');
        } else if (!specialChars.test(password)) {
            setPasswordError('A senha deve conter pelo menos um caractere especial');
        } else {
            setPasswordError('');
        }
    };

    // Mova a definição de isFormValid para que possa ser usada em handleSubmit
    const isFormValid =
        formData.name.trim() !== '' && // Adicionei a validação do nome também
        formData.email.trim() !== '' &&
        formData.password.trim() !== '' &&
        formData.acceptedTerms &&
        !passwordError;

    const handleSubmit = async () => {
        validatePassword(formData.password);

        // Re-verifique a validade *antes* de enviar,
        // especialmente se a validação puder mudar
        const currentIsFormValid =
            formData.name.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.password.trim() !== '' &&
            formData.acceptedTerms &&
            !passwordError;

        if (!currentIsFormValid) {
            alert('Por favor, preencha todos os campos corretamente e aceite os termos.');
            return;
        }


        try {
            const response = await fetch('http://localhost:3000/users', { // Confirme se a URL e a porta estão corretas
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (!response.ok) {
                // Tenta pegar uma mensagem de erro do backend, se houver
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Erro no cadastro. Verifique os dados ou tente novamente.');
            }

            // Se chegou aqui, o cadastro foi bem-sucedido
            alert('Cadastro realizado com sucesso!'); // Opcional: Dê um feedback
            navigate('/login'); // 3. Redirecione para /login

        } catch (error) {
            // @ts-ignore
            alert('Erro ao cadastrar: ' + error.message);
        }
    };


    return (
        <section className='flex w-full h-dvh px-4 sm:px-0'>
            <div className='flex justify-center items-center sm:items-start flex-col sm:pr-4 sm:w-1/2 h-full sm:pl-44'>
                <h2 className='text-7xl font-bold text-center sm:text-start' style={{ fontFamily: '"Jersey 10"' }}>Faça seu cadastro</h2>
                <p className='text-2xl leading-10'>Para proseguir para a plataforma!</p>
                <p>Já tem uma conta? <Link to={"/Login"} className={"font-bold"}>Logue aqui</Link></p>

                <div className='mt-10'>

                    <Inputs
                        label='Nome'
                        type='text'
                        placeholder='Insira seu nome'
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <Inputs
                        label='Email'
                        type='email'
                        placeholder='Insira seu email'
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <div className={'w-full h-20'}>
                        <Inputs
                            label='Senha'
                            type='password'
                            placeholder='Insira sua senha (mínimo 6 caracteres com um especial)'
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>

                    <div className='mt-4'>
                        <input
                            type="checkbox"
                            id="acceptedTerms"
                            checked={formData.acceptedTerms}
                            onChange={handleChange}
                            className="mr-2 cursor-pointer"
                        />
                        <span>Aceito termos da plataforma</span>
                    </div>

                    <div className='mt-10 flex justify-center sm:justify-start'>
                        <Button
                            title='Cadastrar'
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                        />
                    </div>
                </div>
            </div>
            <div className='w-1/2 h-full hidden sm:block'>
                <img
                    src="https://blog.pango.education/hubfs/Coding%20Blog%20Image.jpg"
                    className='w-full h-full object-cover pointer-events-none'
                    alt="coding"
                />
            </div>
        </section>
    );
};

export default Cadastro;