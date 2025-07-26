import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "./AppContext";

function AppContextProvider({ children }) {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); // Initialize as null instead of {}
  const [authLoading, setAuthLoading] = useState(true);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/user-data`);
      if (data.success) {
        setUserData(data.message.userData); // Set user data]
        return true; // Indicate success
      } else {
        toast.error(data.message);
        setUserData(null); // Clear userData on failure
        setIsLoggedin(false); // Ensure logged-out state
        return false;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch user data");
      setUserData(null); // Clear userData on error
      setIsLoggedin(false); // Ensure logged-out state
      return false;
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        await getUserData(); // Fetch user data only if authenticated
      } else {
        setIsLoggedin(false);
        setUserData(null); // Clear userData if not authenticated
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to check auth state");
      setIsLoggedin(false);
      setUserData(null); // Clear userData on error
    } finally {
      setAuthLoading(false); 
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    authLoading, // Expose authLoading for Navbar
  };

  return (
    <AppContext.Provider value={value}>
      {authLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
}

export default AppContextProvider;