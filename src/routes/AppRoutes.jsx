import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Registro from "../pages/Registro/Registro";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home/Home";
import EditorRutina from "../pages/EditorRutina/EditorRutina";
import Ejecucion from "../pages/Ejecucion/Ejecucion";
import Progreso from "../pages/Progreso/Progreso";
import Tienda from "../pages/Tienda/Tienda";
import Carrito from "../pages/Carrito/Carrito";
import { CartProvider } from "../context/CartContext";



const AppRoutes = () => {
  return (
    <BrowserRouter>
      <CartProvider>
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
          <Route
            path="/store"
            element={
              <PrivateRoute>
                <Tienda />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Carrito />
              </PrivateRoute>
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
