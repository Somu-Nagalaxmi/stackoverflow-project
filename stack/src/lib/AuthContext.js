  import { useState } from "react";
import { createContext } from "react";
import axiosInstance from "./axiosinstance";
import { toast } from "react-toastify";
import { useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }

    return null;
  });

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);

  // OTP login details
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  // =========================
  // SIGNUP
  // =========================
  const Signup = async ({ name, email, password }) => {
    setloading(true);
    seterror(null);

    try {
      const res = await axiosInstance.post("/user/signup", {
        name,
        email,
        password,
      });

      const { data, token } = res.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data,
          token,
        })
      );

      setUser(data);

      toast.success("Signup Successful");
    } catch (error) {
      const msg =
        error.response?.data.message ||
        "Signup failed";

      seterror(msg);
      toast.error(msg);
    } finally {
      setloading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const Login = async ({ email, password }) => {
    setloading(true);
    seterror(null);

    try {
      const res = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      // New / untrusted device
      if (res.data.requiresOTP) {
        setRequiresOTP(true);
        setPendingEmail(res.data.email);

        toast.info("OTP required for this device");

        return {
          requiresOTP: true,
        };
      }

      // Normal trusted device login
      const { data, token } = res.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data,
          token,
        })
      );

      setUser(data);

      setRequiresOTP(false);
      setPendingEmail("");

      toast.success("Login Successful");

      return {
        requiresOTP: false,
      };
    } catch (error) {
      const msg =
        error.response?.data.message ||
        "Login failed";

      seterror(msg);
      toast.error(msg);

      return {
        requiresOTP: false,
        error: msg,
      };
    } finally {
      setloading(false);
    }
  };

  // =========================
  // VERIFY LOGIN OTP
  // =========================
  const verifyLoginOTP = async (otp,trustDevice) => {
    setloading(true);
    seterror(null);

    try {
      const res = await axiosInstance.post(
        "/user/verify-otp",
        {
          email: pendingEmail,
          otp,
            trustDevice,
        }
      );

      const { data, token } = res.data;

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data,
          token,
        })
      );

      setUser(data);

      setRequiresOTP(false);
      setPendingEmail("");

      toast.success("OTP verified. Login Successful");

      return true;
    } catch (error) {
      const msg =
        error.response?.data.message ||
        "OTP verification failed";

      seterror(msg);
      toast.error(msg);

      return false;
    } finally {
      setloading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const Logout = () => {
    setUser(null);

    localStorage.removeItem("user");

    setRequiresOTP(false);
    setPendingEmail("");

    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        Signup,
        Login,
        Logout,
        loading,
        error,

        // OTP
        requiresOTP,
        pendingEmail,
        verifyLoginOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);