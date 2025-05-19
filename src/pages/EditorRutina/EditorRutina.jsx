import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./EditorRutina.module.scss";
import Header from "../../components/Shared/Header";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  doc,
  getDoc,
  Timestamp
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Footer from "../../components/Shared/Footer";

const predefinedExercises = [
  "Push Ups",
  "Squats",
  "Deadlifts",
  "Bench Press",
  "Bicep Curls",
  "Plank"
];

const EditorRutina = () => {
  useDocumentTitle("Editor de Rutinas | proyecto EyA");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editIdFromURL = queryParams.get("id");

  const [showEditor, setShowEditor] = useState(false);
  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [customExercise, setCustomExercise] = useState({
    name: "",
    reps: "",
    sets: "",
    weight: ""
  });
  const [selectedPreset, setSelectedPreset] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [existingRoutines, setExistingRoutines] = useState([]);
  const [editRoutineId, setEditRoutineId] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserRoutines();
    }
  }, [user]);

  useEffect(() => {
    const loadRoutineById = async () => {
      if (editIdFromURL && user) {
        try {
          const ref = doc(db, "users", user.uid, "routines", editIdFromURL);
          const docSnap = await getDoc(ref);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRoutineName(data.name || "");
            setExercises(data.exercises || []);
            setEditRoutineId(editIdFromURL);
            setShowEditor(true);
          }
        } catch (error) {
          console.error("Error loading routine from URL:", error);
        }
      }
    };
    loadRoutineById();
  }, [editIdFromURL, user]);

  const fetchUserRoutines = async () => {
    try {
      const ref = collection(db, "users", user.uid, "routines");
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setExistingRoutines(data);
    } catch (error) {
      console.error("Error loading user routines:", error);
    }
  };

  const handleChange = (e) => {
    setCustomExercise({
      ...customExercise,
      [e.target.name]: e.target.value
    });
  };

  const addExercise = () => {
    const exerciseToAdd = selectedPreset
      ? {
          name: selectedPreset,
          reps: customExercise.reps,
          sets: customExercise.sets,
          weight: customExercise.weight
        }
      : customExercise;

    if (
      exerciseToAdd.name &&
      exerciseToAdd.reps &&
      exerciseToAdd.sets &&
      exerciseToAdd.weight
    ) {
      setExercises([...exercises, exerciseToAdd]);
      setCustomExercise({ name: "", reps: "", sets: "", weight: "" });
      setSelectedPreset("");
    }
  };

  const removeExercise = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setRoutineName("");
    setCustomExercise({ name: "", reps: "", sets: "", weight: "" });
    setSelectedPreset("");
    setExercises([]);
    setSuccessMsg("");
    setErrorMsg("");
    setEditRoutineId(null);
  };

  const handleEdit = (routine) => {
    setShowEditor(true);
    setRoutineName(routine.name || "");
    setExercises(routine.exercises || []);
    setEditRoutineId(routine.id);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSave = async () => {
    if (!user || exercises.length === 0 || !routineName.trim()) {
      setErrorMsg("Please add a name and at least one exercise.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const ref = collection(db, "users", user.uid, "routines");

      if (editRoutineId) {
        const docRef = doc(db, "users", user.uid, "routines", editRoutineId);
        await updateDoc(docRef, {
          name: routineName,
          exercises,
          updatedAt: Timestamp.now()
        });
        setSuccessMsg("Routine updated successfully!");
      } else {
        await addDoc(ref, {
          name: routineName,
          exercises,
          createdAt: Timestamp.now()
        });
        setSuccessMsg("Routine saved successfully!");
      }

      setRoutineName("");
      setExercises([]);
      setEditRoutineId(null);
      fetchUserRoutines();
    } catch (error) {
      console.error("Error saving routine:", error);
      setErrorMsg("Failed to save routine.");
    }

    setLoading(false);
  };

  if (!user) {
    return <p style={{ textAlign: "center", color: "white" }}>Loading user...</p>;
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        {!showEditor ? (
          <div className={styles.startBtnContainer}>
            <button onClick={() => setShowEditor(true)}>Create New Routine</button>
          </div>
        ) : (
          <>
            <section className={styles.cardSection}>
              <div className={styles.cardText}>
                <h2>{editRoutineId ? "Edit Routine" : "Create New Routine"}</h2>

                <input
                  type="text"
                  placeholder="Routine Name"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  className={styles.routineNameInput}
                />

                <div className={styles.formGrid}>
                  <select
                    value={selectedPreset}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                  >
                    <option value="">Select a predefined exercise</option>
                    {predefinedExercises.map((exercise, index) => (
                      <option key={index} value={exercise}>
                        {exercise}
                      </option>
                    ))}
                  </select>

                  {!selectedPreset && (
                    <input
                      type="text"
                      name="name"
                      placeholder="Custom Exercise Name"
                      value={customExercise.name}
                      onChange={handleChange}
                    />
                  )}

                  <input
                    type="number"
                    name="reps"
                    placeholder="Reps"
                    value={customExercise.reps}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="sets"
                    placeholder="Sets"
                    value={customExercise.sets}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="weight"
                    placeholder="Weight (kg)"
                    value={customExercise.weight}
                    onChange={handleChange}
                  />
                  <button onClick={addExercise}>Add Exercise</button>
                </div>

                <button className={styles.cancelBtn} onClick={handleCancel}>
                  Cancel
                </button>
              </div>
              <div className={styles.cardImage}></div>
            </section>

            {exercises.length > 0 && (
              <section className={styles.cardSection}>
                <div className={styles.cardText}>
                  <h2>{routineName ? `Current Routine: ${routineName}` : "Current Routine"}</h2>
                  <ul className={styles.exerciseList}>
                    {exercises.map((ex, index) => (
                      <li key={index} className={styles.exerciseItem}>
                        <p>
                          <strong>{ex.name}</strong> — {ex.sets} sets × {ex.reps} reps @ {ex.weight} kg
                        </p>
                        <button onClick={() => removeExercise(index)}>Remove</button>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : editRoutineId ? "Update Routine" : "Save Routine"}
                  </button>

                  {successMsg && <p className={styles.success}>{successMsg}</p>}
                  {errorMsg && <p className={styles.error}>{errorMsg}</p>}
                </div>
                <div className={styles.cardImage}></div>
              </section>
            )}
          </>
        )}

        {existingRoutines.length > 0 && !editRoutineId && (
          <section className={styles.cardSection}>
            <div className={styles.cardText}>
              <h2>My Routines</h2>
              <ul className={styles.exerciseList}>
                {existingRoutines.map((routine) => (
                  <li key={routine.id} className={styles.exerciseItem}>
                    <p><strong>{routine.name}</strong></p>
                    <button onClick={() => handleEdit(routine)}>Edit</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.cardImage}></div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
};

export default EditorRutina;
