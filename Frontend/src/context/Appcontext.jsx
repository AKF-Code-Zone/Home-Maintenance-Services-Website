import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading, null = no user
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/",
    withCredentials: true,
  });

  // Check auth on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const { data } = await axiosInstance.get("/user/is-auth", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/user/register", {
        name,
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token); // store token
        setUser(data.user);
        toast.success("Account created successfully");
        navigate("/dashboard");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        toast.success("Logged in successfully");
        navigate("/dashboard");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

 const logout = async () => {
  try {
    setLoading(true);
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/"); // Redirect to Home page
  } catch (error) {
    toast.error("Logout failed");
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
