import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
  const [isAuth, setAuth] = useState(null);

  useEffect(() => {
    if (getAccessToken() && getRefreshToken()) {
      setAuth(true);
    }
  }, []);

  const login = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuth(false);
  };

  const getAccessToken = () => localStorage.getItem('accessToken');
  const getRefreshToken = () => localStorage.getItem('refreshToken');
  const value = { isAuth, login, logout, getAccessToken, getRefreshToken };

  return <AuthContext.Provider value={value}>{ children }</AuthContext.Provider>;
}

const useAuth = () => {
  return useContext(AuthContext);
}

export { useAuth, AuthProvider };