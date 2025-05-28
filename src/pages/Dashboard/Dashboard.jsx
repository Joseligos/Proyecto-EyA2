import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import useDocumentTitle from "../../hooks/useDocumentTitle";

// Imágenes ilustrativas para las secciones del dashboard
import dashboardHomeImg from "../../assets/images/dashboard_home.jpg";
import dashboardProgressImg from "../../assets/images/dashboard_progress.jpg";
import dashboardRoutinesImg from "../../assets/images/dashboard_routines.jpg";

const Dashboard = () => {
  useDocumentTitle("Dashboard | JF - proyecto EyA");

  const { user } = useAuth();
  const navigate = useNavigate();

  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [editMode, setEditMode] = useState({});
  const [editedNames, setEditedNames] = useState({});
  const [expanded, setExpanded] = useState({});

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const fetchRoutines = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const ref = collection(db, "users", user.uid, "routines");
      const snapshot = await getDocs(ref);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRoutines(docs);
    } catch (error) {
      console.error("Error fetching routines:", error);
      setErrorMsg("Failed to load your routines.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRoutines();
  }, [user]);

  const handleDelete = async (routineId) => {
    if (!user || !routineId) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "routines", routineId));
      fetchRoutines();
    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  };

  const handleEditToggle = (routineId, currentName) => {
    setEditMode((prev) => ({ ...prev, [routineId]: !prev[routineId] }));
    setEditedNames((prev) => ({ ...prev, [routineId]: currentName }));
  };

  const handleNameChange = (routineId, value) => {
    setEditedNames((prev) => ({ ...prev, [routineId]: value }));
  };

  const handleNameSave = async (routineId) => {
    if (!user || !routineId) return;
    try {
      await updateDoc(doc(db, "users", user.uid, "routines", routineId), {
        name: editedNames[routineId]
      });
      setEditMode((prev) => ({ ...prev, [routineId]: false }));
      fetchRoutines();
    } catch (error) {
      console.error("Error updating routine name:", error);
    }
  };

  const toggleExpand = (routineId) => {
    setExpanded((prev) => ({ ...prev, [routineId]: !prev[routineId] }));
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <section className={styles.cardSection}>
          <div className={styles.cardText}>
            <h2>Welcome to Your Dashboard</h2>
            <p>Track your progress and manage your workouts all in one convenient place.</p>
          </div>
          <div className={styles.cardImage}>
            <img src={dashboardHomeImg} alt="Dashboard Hero" />
          </div>
        </section>

        <section className={styles.cardSection}>
          <div className={styles.cardText}>
            <h2>My Progress</h2>
            <p>View the history of your routines and exercises.</p>
            <button onClick={() => navigate("/progress")}>Go to Progress</button>
          </div>
          <div className={styles.cardImage}>
            <img src={dashboardProgressImg} alt="Progress Preview" />
          </div>
        </section>

        {loading ? (
          <p>Loading routines...</p>
        ) : errorMsg ? (
          <p style={{ color: "red" }}>{errorMsg}</p>
        ) : routines.length === 0 ? (
          <div className={styles.cardSection}>
            <div className={styles.cardText}>
              <h2>No Routines Yet</h2>
              <p>You haven't saved any routines. Let's create your first one!</p>
              <button onClick={() => navigate("/workouts")}>Create New Routine</button>
            </div>
            <div className={styles.cardImage}>
              <img src={dashboardRoutinesImg} alt="No routines" />
            </div>
          </div>
        ) : (
          <section className={styles.cardSection}>
            <div className={styles.cardText}>
              <h2>My Routines</h2>
              <ul className={styles.exerciseList}>
                {routines.map((routine, index) => (
                  <li key={routine.id || index} className={styles.exerciseItem}>
                    <div className={styles.routineHeader}>
                      {editMode[routine.id] ? (
                        <>
                          <input
                            type="text"
                            value={editedNames[routine.id] || ""}
                            onChange={(e) => handleNameChange(routine.id, e.target.value)}
                            className={styles.routineNameInput}
                          />
                          <button onClick={() => handleNameSave(routine.id)} className={styles.smallBtn}>
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <strong>{routine.name || `Routine ${index + 1}`}</strong>
                          <div className={styles.actionButtons}>
                            <button
                              onClick={() => handleEditToggle(routine.id, routine.name)}
                              className={styles.smallBtn}
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => handleDelete(routine.id)}
                              className={styles.smallBtn}
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => navigate(`/workouts?id=${routine.id}`)}
                              className={styles.smallBtn}
                            >
                              Edit in Editor
                            </button>
                            <button
                              onClick={() => navigate(`/execute?id=${routine.id}`)}
                              className={styles.smallBtn}
                            >
                              Start Routine
                            </button>
                            <button
                              onClick={() => toggleExpand(routine.id)}
                              className={styles.smallBtn}
                            >
                              {expanded[routine.id] ? "Hide" : "View"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {expanded[routine.id] && (
                      <ul className={styles.exerciseSublist}>
                        {routine.exercises?.map((ex, i) => (
                          <li key={i}>
                            <p>
                              <strong>{ex.name}</strong> — {ex.sets} sets × {ex.reps} reps @ {ex.weight} kg
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.cardImage}>
              <img src={dashboardRoutinesImg} alt="My Routines" />
            </div>
          </section>
        )}

        <section className={styles.logout}>
          <button onClick={handleLogout}>Logout</button>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
