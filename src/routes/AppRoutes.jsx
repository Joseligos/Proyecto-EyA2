import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Registro from "../pages/Registro/Registro";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home/Home";
import EditorRutina from "../pages/EditorRutina/EditorRutina";
import Ejecucion from "../pages/Ejecucion/Ejecucion";
import Progreso from "../pages/Progreso/Progreso";



const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/" element={<Home />} />
        <Route path="/execute" element={<Ejecucion />} />
        <Route path="/progress" element={<Progreso />} />
        
        <Route
  path="/workouts"
  element={
    <PrivateRoute>
      <EditorRutina />
    </PrivateRoute>
  }
/>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
