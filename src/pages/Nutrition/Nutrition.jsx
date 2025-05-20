import React from "react";
import styles from "./Nutrition.module.scss";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";
import { UtensilsCrossed, GlassWater, Soup } from "lucide-react";

const Nutrition = () => {
return (
    <>
    <Header />
    <div className={styles.nutrition}>
        <h1>Nutrition That Fuels Your Goals</h1>
        <p className={styles.subtitle}>
        A healthy diet is the foundation of your fitness journey. Explore key strategies to eat smart and train better.
        </p>

        <div className={styles.cards}>
        <div className={styles.card}>
            <UtensilsCrossed size={40} className={styles.icon} />
            <h3>Balanced Meals</h3>
            <p>Discover how to build plates that nourish and energize for every type of training day.</p>
        </div>
        <div className={styles.card}>
            <GlassWater size={40} className={styles.icon} />
            <h3>Hydration Essentials</h3>
            <p>Water is performance fuel. Learn how and when to hydrate effectively.</p>
        </div>
        <div className={styles.card}>
            <Soup size={40} className={styles.icon} />
            <h3>Recovery Nutrition</h3>
            <p>Fuel your body post-workout with strategic nutrients to speed up muscle recovery.</p>
        </div>
        </div>
    </div>
    <Footer />
    </>
);
};

export default Nutrition;


