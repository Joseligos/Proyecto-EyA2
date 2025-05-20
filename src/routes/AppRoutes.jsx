import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexto
import { CartProvider } from "../context/CartContext";

// Rutas públicas
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Registro from "../pages/Registro/Registro";
import Blog from "../pages/Blog/Blog";
import Support from "../pages/Support/Support";
import Wellness from "../pages/Wellness/Wellness";
import Nutrition from "../pages/Nutrition/Nutrition";
import Fitness from "../pages/Fitness/Fitness";

// Rutas privadas
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import EditorRutina from "../pages/EditorRutina/EditorRutina";
import Ejecucion from "../pages/Ejecucion/Ejecucion";
import Progreso from "../pages/Progreso/Progreso";
import Chat from "../pages/Comunidad/Chat";
import Tienda from "../pages/Tienda/Tienda";
import Carrito from "../pages/Carrito/Carrito";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/support" element={<Support />} />
          <Route path="/blog/wellness" element={<Wellness />} />
          <Route path="/blog/nutrition" element={<Nutrition />} />
          <Route path="/blog/fitness" element={<Fitness />} />

          {/* Rutas privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <PrivateRoute>
                <EditorRutina />
              </PrivateRoute>
            }
          />
          <Route
            path="/execute"
            element={
              <PrivateRoute>
                <Ejecucion />
              </PrivateRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <PrivateRoute>
                <Progreso />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
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


