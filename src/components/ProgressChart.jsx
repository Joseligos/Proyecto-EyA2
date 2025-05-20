import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useAuth } from "../context/AuthContext";
import styles from "./ProgressChart.module.scss";

export default function ProgressChart({ routineName }) {
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!user || !routineName) return;

    const ref = collection(db, "users", user.uid, "progress");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = [];

      snapshot.docs.forEach((doc) => {
        const session = doc.data();
        if (session.routineName !== routineName) return;

        const dateObj = session.timestamp?.toDate();
        const date = dateObj?.toLocaleDateString("es-ES", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric"
        });

        session.results?.forEach((exercise) => {
          const sets = exercise.sets ?? exercise.repsPerSet?.length ?? 1;
          const total = exercise.totalReps ?? (
            Array.isArray(exercise.repsPerSet)
              ? exercise.repsPerSet.reduce((a, b) => a + b, 0)
              : 0
          );

          const average = sets > 0 ? total / sets : 0;

          data.push({
            date,
            exerciseName: exercise.name,
            averageReps: Number(average.toFixed(2))
          });
        });
      });

      setFilteredData(data);
    });

    return () => unsubscribe();
  }, [user, routineName]);

  // Agrupar por ejercicio
  const exercises = [...new Set(filteredData.map((d) => d.exerciseName))];

  if (filteredData.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "#22004d", padding: "10px", borderRadius: "8px", color: "white" }}>
          <p><strong>{label}</strong></p>
          <p>Promedio reps/set: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>📊 {routineName} — Progreso por ejercicio</h3>

      {exercises.map((exerciseName) => {
        const data = filteredData
          .filter((d) => d.exerciseName === exerciseName)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        return (
          <div key={exerciseName} className={styles.chartBlock}>
            <h4 className={styles.exerciseTitle}>{exerciseName}</h4>
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
    <XAxis
      dataKey="date"
      stroke="#ffffff"
      interval={0}
      angle={-25}
      dy={10}
      tick={{ fill: "#fff", fontSize: 12 }}
    />
    <YAxis stroke="#ffffff" />
    <Tooltip content={<CustomTooltip />} />
    <Legend verticalAlign="top" height={30} />
    <Line
      type="monotone"
      dataKey="averageReps"
      name="Prom. reps/set"
      stroke="#a770ff"
      strokeWidth={2}
      activeDot={{ r: 6 }}
    />
  </LineChart>
</ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
