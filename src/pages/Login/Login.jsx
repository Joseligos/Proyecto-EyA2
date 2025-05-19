import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import Header from "../../components/Shared/Header";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Footer from "../../components/Shared/Footer";

const Login = () => {
  useDocumentTitle("Login | proyecto EyA");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg("Login failed: " + error.message);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.box}>
          <h1>Welcome Back! Please Log In</h1>
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
            <button type="submit">Log In</button>
          </form>
          {errorMsg && <p style={{ color: "red", marginTop: "15px" }}>{errorMsg}</p>}

          <p className={styles.redirect}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
