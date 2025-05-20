import React from "react";
import styles from "./Support.module.scss";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";

const Support = () => {
return (
    <>
    <Header />
    <div className={styles.support}>
        <h1>Need Help? We're Here for You</h1>
        <p className={styles.subtitle}>
        Our dedicated support team is ready to guide you on your fitness journey.
        </p>

        <div className={styles.grid}>
        <div className={styles.card}>
            <img src="https://cdn-icons-png.freepik.com/256/7541/7541504.png?ga=GA1.1.707307909.1747721392&semt=ais_hybrid" alt="Support" />
            <div>
            <h3>Technical Issues</h3>
            <p>Having trouble with your workouts or tracking? Reach out for technical assistance.</p>
            </div>
        </div>
        <div className={styles.card}>
            <img src="https://cdn-icons-png.freepik.com/256/6193/6193278.png?ga=GA1.1.707307909.1747721392&semt=ais_hybrid" alt="Trainers" />
            <div>
            <h3>Trainer Guidance</h3>
            <p>Our certified trainers can answer your questions and provide expert advice.</p>
            </div>
        </div>
        <div className={styles.card}>
            <img src="https://cdn-icons-png.freepik.com/256/5726/5726828.png?ga=GA1.1.707307909.1747721392&semt=ais_hybrid" alt="Customer" />
            <div>
            <h3>General Inquiries</h3>
            <p>For account or billing questions, contact us anytime at support@eyafitness.com.</p>
            </div>
        </div>
        </div>
    </div>
    <Footer />
    </>
);
};

export default Support;

