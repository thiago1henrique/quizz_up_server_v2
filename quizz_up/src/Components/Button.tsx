interface btnProps {
    title: string;
    onClick?: () => void;
    disabled?: boolean;
}

const Button = ({ title, onClick, disabled = false }: btnProps) => {
    return (
        <button
            className={`
        w-[300px] h-14 rounded-3xl cursor-pointer border-2 font-bold text-white
        ${disabled
                ? 'bg-gray-300 cursor-not-allowed border-transparent'
                : 'bg-green-300 hover:border-purple-400 border-transparent'
            }
      `}
            onClick={onClick}
            disabled={disabled}
        >
            {title}
        </button>
    );
};

export default Button;