// This Context stores the logged-in user across the application.

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getStudentProfile, getCompanyProfile } from "../services/authService";
import { getAdminProfile } from "../services/adminService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        setLoading(false);
        return;
      }

      let response;
      if (role === "company") {
        response = await getCompanyProfile();
      } else if (role === "admin") {
        response = await getAdminProfile();
      } else {
        response = await getStudentProfile();
      }

      setUser({ ...response.data, role: role });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}