import React, { createContext, useState, useEffect, useContext } from "react";
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout, googleLogin as apiGoogleLogin } from "../services/api";

const AuthContext = createContext();

// Helper — wipe all browser storage & cookies
const clearAllStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api`;
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // If there is NO token at all we already know the user is a guest — skip
  // the async /me call and start with isLoading=false immediately so that
  // ProtectedRoute can redirect to /login without any spinner delay.
  const [isLoading, setIsLoading] = useState(
    () => Boolean(localStorage.getItem("token"))
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // No token → definitively a guest, nothing to validate
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getMe();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("[AuthContext] Token validation failed:", error);
        // Token is invalid/expired — clear everything so the guard
        // fast-fails on the VERY next render
        clearAllStorage();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    // Backend returns { _id, name, email, role, token }
    const { token, ...userData } = data;
    setUser(userData);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (userData) => {
    const data = await apiRegister(userData);
    // No token on register — user must verify email then log in.
    return data;
  };

  const logout = () => {
    clearAllStorage();
    setUser(null);
    setIsAuthenticated(false);
    // Full page reload to /login so every cached React state is reset
    window.location.replace("/login");
  };

  const loginWithGoogle = async (credential) => {
    const data = await apiGoogleLogin(credential);
    const { token, ...userData } = data;
    setUser(userData);
    setIsAuthenticated(true);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        loginWithGoogle,
        setUser,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
