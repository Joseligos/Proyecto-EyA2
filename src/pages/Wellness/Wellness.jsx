import React from "react";
import styles from "./Wellness.module.scss";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";

const Wellness = () => {
const sections = [
    {
    title: "Embrace Mindfulness",
    text: "Practice daily mindfulness to reduce anxiety, increase focus, and reconnect with your inner self.",
    img: "https://img.freepik.com/vector-gratis/composicion-conceptual-mundo-interior-humano-cielo-estrellado-terreno-plano-planeta-nina-universo-dentro-ilustracion-vectorial_1284-81587.jpg?ga=GA1.1.707307909.1747721392&semt=ais_hybrid&w=740"
    },
    {
    title: "Gentle Yoga Flow",
    text: "Move your body with grace and intention. Our yoga flows restore flexibility, balance, and calm.",
    img: "https://img.freepik.com/vector-premium/joven-mujer-sentada-postura-yoga-meditacion-chica-realizando-ejercicios-aerobicos-meditacion-matutina-casa-ilustracion-estilo-dibujos-animados-plana_198278-655.jpg?ga=GA1.1.707307909.1747721392&semt=ais_hybrid&w=740"
    },
    {
    title: "Reset Through Rest",
    text: "Restorative sleep and purposeful rest help you recover and energize for new challenges.",
    img: "https://img.freepik.com/vector-gratis/ilustracion-concepto-hamaca-campamento_114360-24364.jpg?ga=GA1.1.707307909.1747721392&semt=ais_hybrid&w=740"
    }
];

return (
    <>
    <Header />
    <div className={styles.wellness}>
        <div className={styles.intro}>
        <h1>Wellness is a Lifestyle</h1>
        <p>
            Wellness means more than the absence of illness. It’s a daily practice of caring for your mind,
            body, and soul — consciously and kindly.
        </p>
        </div>

        {sections.map((section, index) => (
        <div
            className={`${styles.card} ${index % 2 !== 0 ? styles.reverse : ""}`}
            key={index}
        >
            <div className={styles.image}>
            <img src={section.img} alt={section.title} />
            </div>
            <div className={styles.text}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
            </div>
        </div>
        ))}
    </div>
    <Footer />
    </>
);
};

export default Wellness;

