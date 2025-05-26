import { useState } from 'react';

interface InputsProps {
    label: string;
    type: string;
    placeholder: string;
    id?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    classname?: string;
    showCheckbox?: boolean;
    isCorrect?: boolean;
    onCheckboxChange?: (checked: boolean) => void;
}

const Inputs = ({
                    label,
                    type,
                    placeholder,
                    id,
                    value,
                    onChange,
                    classname,
                    showCheckbox = false,
                    isCorrect = false,
                    onCheckboxChange
                }: InputsProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative mt-6">
            <input
                id={id}
                className={`peer w-full min-w-[360px] sm:min-w-[500px] max-w-[600px] py-4 pl-4 pr-10 border-2 bg-[#f5f5f5]
                 border-[#16161d] rounded-2xl placeholder-transparent focus:outline-none ${classname}`}
                type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <label
                htmlFor={id}
                className={`absolute left-4 -top-2 px-1 bg-[#f5f5f5] text-sm font-bold
                          transition-all duration-200
                          peer-placeholder-shown:text-base 
                          peer-placeholder-shown:top-4 
                          peer-placeholder-shown:text-gray-500
                          peer-focus:-top-2 
                          peer-focus:text-sm
                          peer-focus:text-[#16161d]
                          ${classname}`}
            >
                {label}
            </label>

            {type === 'password' && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                    {/* Ícones de visibilidade da senha */}
                </button>
            )}

            {showCheckbox && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                    <input
                        type="checkbox"
                        checked={isCorrect}
                        onChange={(e) => onCheckboxChange && onCheckboxChange(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                </div>
            )}
        </div>
    );
};

export default Inputs;