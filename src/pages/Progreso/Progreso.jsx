import React, { useEffect, useState } from "react";
import styles from "./Progreso.module.scss";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import ProgressChart from "../../components/ProgressChart";

const Progreso = () => {
  useDocumentTitle("Mi Progreso | proyecto EyA");

  const { user } = useAuth();
  const [progressData, setProgressData] = useState({});
  const [selectedRoutine, setSelectedRoutine] = useState("");
  const [expandedRoutines, setExpandedRoutines] = useState({});
  const [expandedExercises, setExpandedExercises] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const ref = collection(db, "users", user.uid, "progress");
        const snapshot = await getDocs(ref);
        const rawData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        const grouped = {};
        rawData.forEach((entry) => {
          if (!grouped[entry.routineName]) {
            grouped[entry.routineName] = [];
          }
          grouped[entry.routineName].push(entry);
        });

        setProgressData(grouped);

        const availableRoutines = Object.keys(grouped);
        if (!selectedRoutine && availableRoutines.length > 0) {
          setSelectedRoutine(availableRoutines[0]);
        }

      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
      setLoading(false);
    };

    fetchProgress();
  }, [user]);

  const toggleRoutine = (id) => {
    setExpandedRoutines((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExercise = (routineId, index) => {
    const key = `${routineId}-${index}`;
    setExpandedExercises((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDelete = async (routineName, id) => {
    const confirm = window.confirm("¿Eliminar esta rutina?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "progress", id));
      setProgressData((prev) => ({
        ...prev,
        [routineName]: prev[routineName].filter((entry) => entry.id !== id)
      }));
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
      alert("Hubo un error al intentar eliminar la rutina.");
    }
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const availableRoutines = Object.keys(progressData).filter(
    (routine) => progressData[routine]?.length > 0
  );

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>My Progress</h1>

        {loading ? (
          <p style={{ color: "white" }}>Loading progress...</p>
        ) : availableRoutines.length === 0 ? (
          <p style={{ color: "white" }}>No progress records yet.</p>
        ) : (
          <>
            <div className={styles.routineSelector}>
              <label htmlFor="routineSelect">Ver rutina:</label>
              <select
                id="routineSelect"
                value={selectedRoutine}
                onChange={(e) => setSelectedRoutine(e.target.value)}
              >
                {availableRoutines.map((routine) => (
                  <option key={routine} value={routine}>
                    {routine}
                  </option>
                ))}
              </select>
            </div>

            {selectedRoutine && progressData[selectedRoutine] && (
              <div className={styles.routineSection}>
                <h2>{selectedRoutine}</h2>

                {progressData[selectedRoutine].map((session) => (
                  <div key={session.id} className={styles.card}>
                    <div
                      className={`${styles.routineHeader} ${expandedRoutines[session.id] ? styles.expanded : ""}`}
                      onClick={() => toggleRoutine(session.id)}
                    >
                      <h3>Sesión</h3>
                      <p className={styles.date}>{formatDate(session.timestamp)}</p>
                      <span>{expandedRoutines[session.id] ? "▲" : "▼"}</span>
                    </div>

                    {expandedRoutines[session.id] && (
                      <div className={styles.exerciseList}>
                        {session.results?.map((exercise, i) => {
                          const key = `${session.id}-${i}`;
                          return (
                            <div key={i} className={styles.exerciseItem}>
                              <div
                                className={`${styles.exerciseHeader} ${expandedExercises[key] ? styles.expanded : ""}`}
                                onClick={() => toggleExercise(session.id, i)}
                              >
                                <h4>{exercise.name}</h4>
                                <span>{expandedExercises[key] ? "▲" : "▼"}</span>
                              </div>

                              {expandedExercises[key] && (
                                <div className={styles.exerciseDetails}>
                                  <p><strong>Sets:</strong> {exercise.sets}</p>
                                  <p><strong>Reps objetivo:</strong> {exercise.targetReps}</p>
                                  <p><strong>Total reps realizadas:</strong> {exercise.totalReps}</p>
                                  <p><strong>Duración total:</strong> {exercise.duration} seg</p>
                                  {exercise.repsPerSet && (
                                    <ul className={styles.setList}>
                                      {exercise.repsPerSet.map((reps, idx) => (
                                        <li key={idx}>Set {idx + 1}: {reps} reps</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <button
                          onClick={() => handleDelete(selectedRoutine, session.id)}
                          className={styles.deleteButton}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <ProgressChart routineName={selectedRoutine} />
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Progreso;
