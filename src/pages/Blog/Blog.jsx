import React from "react";
import styles from "./Blog.module.scss";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Blog = () => {
useDocumentTitle("Blog | JF - proyecto EyA");

return (
    <>
    <Header />
    <div className={styles.blog}>
        <h1>Blog de Bienestar, Nutrición y Fitness</h1>

        <div className={styles.card}>
        <img src="https://img.freepik.com/vector-premium/coleccion-relojes-dibujados-mano_341841-610.jpg?ga=GA1.1.707307909.1747721392&semt=ais_hybrid&w=740" alt="Rutina saludable" />
        <div>
            <h2>Cómo construir una rutina saludable desde cero</h2>
            <p>
            Empezar una vida saludable no requiere cambios radicales. Lo más importante es construir hábitos pequeños y sostenibles. 
            Puedes comenzar por establecer una hora fija para dormir, tomar más agua o simplemente moverte 15 minutos al día.
            </p>
            <p>
            Recuerda que la constancia es más poderosa que la intensidad. En este espacio compartimos ideas prácticas para ayudarte a establecer bases firmes en tu camino de transformación.
            </p>
        </div>
        </div>

        <div className={styles.card}>
        <img src="https://img.freepik.com/vector-premium/coleccion-ilustraciones-vectoriales-minimalistas-alimentos-bebidas-dibujadas-mano_10707-4104.jpg?ga=GA1.1.707307909.1747721392&semt=ais_hybrid&w=740" alt="Ideas de comidas" />
        <div>
            <h2>Ideas de comidas balanceadas para cada día</h2>
            <p>
            Comer bien no tiene que ser aburrido ni complicado. En nuestros artículos exploramos combinaciones fáciles, sabrosas y accesibles que puedes incorporar en tu semana:
            desayunos energéticos, almuerzos saciantes y snacks funcionales para antes o después del entrenamiento.
            </p>
        </div>
        </div>

        <div className={styles.card}>
        <img src="https://i.imgur.com/xoMVWPP.png" />
        <div>
            <h2>Motivación y mentalidad: la clave del progreso</h2>
            <p>
            El verdadero cambio comienza en tu mente. En esta sección del blog, te compartimos estrategias para mantener la motivación, superar el autosabotaje 
            y construir una mentalidad resiliente que te permita mantener el enfoque incluso cuando no hay resultados inmediatos.
            </p>
        </div>
        </div>
    </div>
    <Footer />
    </>
);
};

export default Blog;





