import React, { useEffect, useState } from "react";
import styles from "./Progreso.module.scss";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Progreso = () => {
  useDocumentTitle("Mi Progreso | proyecto EyA");

  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const ref = collection(db, "users", user.uid, "progress");
        const snapshot = await getDocs(ref);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProgressData(docs);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
      setLoading(false);
    };

    fetchProgress();
  }, [user]);

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>My Progress</h1>

        {loading ? (
          <p style={{ color: "white" }}>Loading progress...</p>
        ) : progressData.length === 0 ? (
          <p style={{ color: "white" }}>No progress records yet.</p>
        ) : (
          progressData.map((session) => (
            <div key={session.id} className={styles.card}>
              <h2>{session.routineName}</h2>
              <p className={styles.date}>{formatDate(session.timestamp)}</p>
              <ul className={styles.exerciseList}>
                {session.results?.map((ex, i) => (
                  <li key={i}>
                    <strong>{ex.name}</strong> — Reps: {ex.actualReps}/{ex.targetReps} — Time: {ex.duration}s
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default Progreso;
