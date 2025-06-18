import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  registerRequest, 
  loginRequest, 
  verifyTokenRequest, 
  logoutRequest 
} from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configuración global de Axios
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = "https://restaurante-jbe5.onrender.com";
  }, []);

  const signUp = async (userData) => {
    try {
      const res = await registerRequest(userData);
      await verifyAuth();
      return { success: true, data: res.data };
    } catch (error) {
      handleAuthError(error);
      return { success: false, error };
    }
  };

  const signIn = async (credentials) => {
    try {
      const res = await loginRequest(credentials);
      await verifyAuth();
      return { success: true, data: res.data };
    } catch (error) {
      handleAuthError(error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      await logoutRequest();
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const verifyAuth = async () => {
    try {
      const res = await verifyTokenRequest();
      if (res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      handleAuthError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error) => {
    const errorMsg = error?.response?.data?.error || "Error de autenticación";
    setErrors([{ msg: errorMsg }]);
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        errors,
        signUp,
        signIn,
        signOut,
        verifyAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
