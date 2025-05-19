import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Ejecucion.module.scss";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, collection, addDoc, Timestamp } from "firebase/firestore";

const Ejecucion = () => {
  useDocumentTitle("Ejecutando Rutina | proyecto EyA");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const routineId = queryParams.get("id");

  const { user } = useAuth();
  const navigate = useNavigate();

  const [routine, setRoutine] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [timerRunning, setTimerRunning] = useState(false);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [inRest, setInRest] = useState(false);
  const [repsDone, setRepsDone] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchRoutine = async () => {
      if (!user || !routineId) return;
      try {
        const ref = doc(db, "users", user.uid, "routines", routineId);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setRoutine(docSnap.data());
        } else {
          setErrorMsg("No se encontró una rutina con ese ID.");
        }
      } catch (error) {
        console.error("Error al cargar la rutina:", error);
        setErrorMsg("Error al cargar la rutina.");
      }
      setLoading(false);
    };
    fetchRoutine();
  }, [user, routineId]);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setExerciseTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    let interval;
    if (inRest && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setInRest(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inRest, restTimer]);

  const handleStartTimer = () => {
    setExerciseTimer(0);
    setTimerRunning(true);
  };

  const saveCurrentResult = () => {
    const currentExercise = routine.exercises[current];
    setResults((prev) => {
      const updated = [...prev];
      updated[current] = {
        name: currentExercise.name,
        targetReps: currentExercise.reps,
        actualReps: repsDone || "0",
        duration: exerciseTimer
      };
      return updated;
    });
  };

  const handleNext = () => {
    saveCurrentResult();

    if (current < routine.exercises.length - 1) {
      setCurrent(current + 1);
      setInRest(true);
      setRestTimer(300);
      setTimerRunning(false);
      setExerciseTimer(0);
      setRepsDone("");
    } else {
      handleFinishRoutine();
    }
  };

  const handleFinishRoutine = async () => {
    try {
      const ref = collection(db, "users", user.uid, "progress");
      await addDoc(ref, {
        routineId,
        routineName: routine.name,
        timestamp: Timestamp.now(),
        results
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setTimerRunning(false);
      setExerciseTimer(0);
      setInRest(false);
      setRepsDone(results[current - 1]?.actualReps || "");
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!user) return <p style={{ color: "white", textAlign: "center" }}>Cargando usuario...</p>;
  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Cargando rutina...</p>;
  if (errorMsg) return <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>;
  if (!routine) return null;

  const exercise = routine.exercises[current];
  const isLast = current === routine.exercises.length - 1;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Executing: {routine.name}</h1>

        <div className={styles.exerciseCard}>
          <h2>{exercise.name}</h2>
          <p><strong>Sets:</strong> {exercise.sets}</p>
          <p><strong>Reps:</strong> {exercise.reps}</p>
          <p><strong>Weight:</strong> {exercise.weight} kg</p>

          <div className={styles.inputGroup}>
            <label htmlFor="repsDone">Reps done:</label>
            <input
              id="repsDone"
              type="number"
              value={repsDone}
              onChange={(e) => setRepsDone(e.target.value)}
              placeholder="Enter reps completed"
            />
          </div>

          <button onClick={handleStartTimer} disabled={timerRunning}>
            {timerRunning ? `Exercise Timer: ${formatTime(exerciseTimer)}` : "Start Exercise Timer"}
          </button>

          {inRest && (
            <div className={styles.restSection}>
              <p>Rest Time: {formatTime(restTimer)}</p>
              <button onClick={() => setRestTimer(0)}>Skip Rest</button>
            </div>
          )}

          <div className={styles.navigation}>
            <button onClick={handlePrev} disabled={current === 0}>Previous</button>
            <button onClick={handleNext}>
              {isLast ? "Finalizar rutina" : "Next"}
            </button>
          </div>
        </div>

        <div className={styles.progress}>
          <p>Exercise {current + 1} of {routine.exercises.length}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Ejecucion;
