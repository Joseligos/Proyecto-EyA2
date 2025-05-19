import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import styles from "./Registro.module.scss";
import Header from "../../components/Shared/Header";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Footer from "../../components/Shared/Footer";

const Registro = () => {
  useDocumentTitle("Registro | proyecto EyA");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg("Registration failed: " + error.message);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.box}>
          <h1>Join Our Fitness Community</h1>
          <p>
            Create your account to start tracking your fitness journey and
            achieving your goals.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
          </form>
          {errorMsg && <p style={{ color: "red", marginTop: "15px" }}>{errorMsg}</p>}

          <p className={styles.redirect}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Log in</span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Registro;
