import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../features/auth/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data?.user || data || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    let userData = res?.user || null;
    if (!userData?.role) {
      const me = await getCurrentUser();
      userData = me?.user || me || null;
    }
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (_) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
