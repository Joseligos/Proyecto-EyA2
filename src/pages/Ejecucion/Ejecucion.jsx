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
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
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

  const handleCompleteSet = () => {
    const currentExercise = routine.exercises[currentExerciseIndex];
    const updated = [...results];
    const reps = parseInt(repsDone) || 0;

    if (!updated[currentExerciseIndex]) {
      updated[currentExerciseIndex] = {
        name: currentExercise.name,
        targetReps: currentExercise.reps,
        sets: currentExercise.sets,
        repsPerSet: [],
        duration: 0
      };
    }

    updated[currentExerciseIndex].repsPerSet.push(reps);
    updated[currentExerciseIndex].duration += exerciseTimer;

    const setsCompleted = updated[currentExerciseIndex].repsPerSet.length;

    setResults(updated);
    setExerciseTimer(0);
    setTimerRunning(false);
    setRepsDone("");

    if (setsCompleted < currentExercise.sets) {
      setInRest(true);
      setRestTimer(60); // 1 minuto de descanso
      setCurrentSet(currentSet + 1);
    } else {
      // ejercicio terminado
      updated[currentExerciseIndex].totalReps = updated[currentExerciseIndex].repsPerSet.reduce((a, b) => a + b, 0);

      if (currentExerciseIndex < routine.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
      } else {
        handleFinishRoutine(updated); // rutina finalizada
      }
    }
  };

  const handleFinishRoutine = async (finalResults) => {
    try {
      const ref = collection(db, "users", user.uid, "progress");
      await addDoc(ref, {
        routineId,
        routineName: routine.name,
        timestamp: Timestamp.now(),
        results: finalResults
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!user) return <p style={{ color: "white", textAlign: "center" }}>Cargando usuario...</p>;
  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Cargando rutina...</p>;
  if (errorMsg) return <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>;
  if (!routine) return null;

  const exercise = routine.exercises[currentExerciseIndex];

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Ejecutando: {routine.name}</h1>

        <div className={styles.exerciseCard}>
          <h2>{exercise.name}</h2>
          <p><strong>Set:</strong> {currentSet} de {exercise.sets}</p>
          <p><strong>Reps objetivo:</strong> {exercise.reps}</p>
          <p><strong>Peso:</strong> {exercise.weight} kg</p>

          <div className={styles.inputGroup}>
            <label htmlFor="repsDone">Reps completadas en este set:</label>
            <input
              id="repsDone"
              type="number"
              value={repsDone}
              onChange={(e) => setRepsDone(e.target.value)}
              placeholder="Ej: 10"
            />
          </div>

          <button onClick={handleStartTimer} disabled={timerRunning}>
  {timerRunning ? `Timer: ${formatTime(exerciseTimer)}` : "Iniciar timer del set"}
</button>

{results[currentExerciseIndex]?.repsPerSet?.length > 0 && (
  <div className={styles.setsCompleted}>
    <h4>Sets completados:</h4>
    <ul>
      {results[currentExerciseIndex].repsPerSet.map((rep, idx) => (
        <li key={idx}>✅ Set {idx + 1}: {rep} reps</li>
      ))}
    </ul>
  </div>
)}


          {inRest && (
            <div className={styles.restSection}>
              <p>Descanso: {formatTime(restTimer)}</p>
              <button onClick={() => setRestTimer(0)}>Saltar descanso</button>
            </div>
          )}

          <div className={styles.navigation}>
            <button onClick={handleCompleteSet}>
              {currentSet < exercise.sets ? "Finalizar set" : "Finalizar ejercicio"}
            </button>
          </div>
        </div>

        <div className={styles.progress}>
          <p>Ejercicio {currentExerciseIndex + 1} de {routine.exercises.length}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Ejecucion;
