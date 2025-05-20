import React from "react";
import styles from "./Fitness.module.scss";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";
import { Dumbbell, TimerReset, Flame } from "lucide-react";

const Fitness = () => {
return (
    <>
    <Header />
    <div className={styles.fitness}>
        <h1>Level Up Your Training</h1>
        <p className={styles.subtitle}>
        Explore key methods to train smarter, build strength, and improve overall fitness.
        </p>

        {/* Carrusel */}
        <div className={styles.carousel}>
        <div className={styles.track}>
            <img src="https://img.freepik.com/vector-gratis/persona-dibujada-mano-haciendo-ilustracion-deportiva_52683-125055.jpg?ga=GA1.1.707307909.1747721392&semt=ais_hybrid&w=740" alt="Gym" />
            <img src="https://img.freepik.com/vector-gratis/ilustracion-deportes-virtuales-dibujados-mano_52683-124984.jpg?ga=GA1.1.707307909.1747721392&semt=ais_hybrid&w=740" alt="Workout" />
            <img src="https://img.freepik.com/vector-gratis/personajes-dibujos-animados-aguacate-haciendo-ejercicio-ilustracion-gimnasio_74855-18244.jpg?ga=GA1.1.707307909.1747721392&semt=ais_hybrid&w=740" alt="Fitness" />
            <img src="https://img.freepik.com/fotos-premium/vista-angulo-alto-pesas-alfombra-ejercicio-purpura_1048944-4392510.jpg?ga=GA1.1.707307909.1747721392&semt=ais_hybrid&w=740" alt="Crossfit" />
            <img src="https://img.freepik.com/foto-gratis/no-siente-pongase-forma-render-3d-caligrafico_460848-7409.jpg?ga=GA1.1.707307909.1747721392&semt=ais_hybrid&w=740" alt="Bodybuilding" />
        </div>
        </div>

        {/* Tarjetas */}
        <div className={styles.grid}>
        <div className={styles.item}>
            <Dumbbell className={styles.icon} size={40} />
            <h3>Strength Training</h3>
            <p>Focus on technique, progressive overload, and total body control to build lean muscle.</p>
        </div>
        <div className={styles.item}>
            <Flame className={styles.icon} size={40} />
            <h3>Fat Burn & HIIT</h3>
            <p>Efficient routines that torch calories and boost your metabolism through intensity.</p>
        </div>
        <div className={styles.item}>
            <TimerReset className={styles.icon} size={40} />
            <h3>Mobility & Recovery</h3>
            <p>Keep your body functional and injury-free with guided warm-ups and cooldowns.</p>
        </div>
        </div>
    </div>
    <Footer />
    </>
);
};

export default Fitness;



