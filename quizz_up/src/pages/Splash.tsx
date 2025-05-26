import Button from "../Components/Button.tsx";
import {Link} from 'react-router-dom';
import { motion } from 'framer-motion';

const quizz = ['Q', 'u', 'i', 'z', 'z', ' ', 'U', 'p'];

const colors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#F333FF',
    '#33FFF5',
    '#FF33F5',
    '#F5FF33',
    '#8A33FF'
];

const staggeredBounce = (index: number) => ({
    y: [0, -20, 0],
    transition: {
        delay: index * 0.1,
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeOut"
    }
});

const Splash = () => {
    return (
        <section className='flex w-full h-dvh px-4 py-4 sm:py-0 sm:px-0'>
            <div className='flex items-center justify-center flex-col sm:w-1/2 h-full'>

                <div className={"h-full sm:h-auto flex items-center justify-center flex-col w-full"}>
                    <h2 className='text-7xl text-center sm:text-left sm:text-7xl font-bold'
                        style={{fontFamily: '"Jersey 10"'}}>
                        Bem vindo ao {' '}
                        {quizz.map((letter, index) => (
                            <motion.span
                                key={index}
                                style={{color: colors[index % colors.length], display: 'inline-block'}}
                                animate={staggeredBounce(index)}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </h2>
                    <p className='text-2xl text-center py-6 sm:text-2xl sm:text-left sm:py-4'>
                        Aprender ficou mais fácil do que você imagina!
                    </p>
                </div>

                <div className='flex flex-col gap-4 h-1/4 sm:h-auto py-4'>
                    <Link to={"/Login"}><Button title="Login"/></Link>
                    <Link to={"/Cadastro"}><Button title="Cadastre-se"/></Link>
                    <Link to="/Login" className={"text-center hover:underline"}>Sou professor!</Link>
                </div>
            </div>
            <div className='w-1/2 h-full hidden md:block'>
                <img src="https://blog.pango.education/hubfs/Coding%20Blog%20Image.jpg"
                     className='w-full h-full object-cover pointer-events-none'
                     alt="coding"/>
            </div>
        </section>
    )
}

export default Splash