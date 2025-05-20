import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";
import Header from "../../components/Shared/Header";
import { useAuth } from "../../context/AuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Footer from "../../components/Shared/Footer";

const Home = () => {
  useDocumentTitle("Inicio | JF - proyecto EyA");
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1>Transform Your Fitness Journey Today</h1>
          <p>
            Join our innovative platform to customize your workout routines and track your
            progress seamlessly. Achieve your fitness goals with personalized plans tailored just for you.
          </p>

          <div className={styles.buttons}>
            {!user ? (
              <>
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/register")}>Sign Up</button>
              </>
            ) : (
              <button onClick={() => navigate("/dashboard")}>Go to your Hub</button>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Explore More</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card} onClick={() => navigate("/store")}>
              <h3>Shop Now</h3>
              <p>Find the best fitness gear and supplements.</p>
            </div>
            <div className={styles.card} onClick={() => navigate("/blog")}>
              <h3>Blog</h3>
              <p>Read our latest fitness articles and tips.</p>
            </div>
            <div className={styles.card} onClick={() => navigate("/support")}>
              <h3>Support</h3>
              <p>Get assistance with your fitness journey.</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>From Our Blog</h2>
          <div className={styles.blogGrid}>
            <div className={styles.blogCard} onClick={() => navigate("/blog/wellness")}>
              <h3>Wellness</h3>
              <p><strong>Maximize Your Workout Efficiency</strong></p>
              <p>Learn how to optimize your training sessions for better results.</p>
              <span>Jane Doe • 11 Jan 2022 • 5 min read</span>
            </div>
            <div className={styles.blogCard} onClick={() => navigate("/blog/nutrition")}>
              <h3>Nutrition</h3>
              <p><strong>The Power of Hydration</strong></p>
              <p>Discover the importance of staying hydrated during workouts.</p>
              <span>John Smith • 15 Jan 2022 • 4 min read</span>
            </div>
            <div className={styles.blogCard} onClick={() => navigate("/blog/fitness")}>
              <h3>Fitness</h3>
              <p><strong>Strength Training Basics</strong></p>
              <p>Essential tips for beginners in strength training.</p>
              <span>Emily Clark • 20 Jan 2022 • 6 min read</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;

