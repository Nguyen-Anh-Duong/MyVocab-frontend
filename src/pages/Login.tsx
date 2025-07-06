import { useEffect, useState } from "react";
import AuthLayout from "../layouts/AuthLayout";

function Login() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");

        // If user is already logged in, redirect to home
        if (accessToken && userData) {
          window.location.href = "/";
          return;
        }

        setIsChecking(false);
      } catch (error) {
        // If there's an error, just proceed to show login form
        setIsChecking(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Show loading while checking authentication status
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="font-inter max-w mt-[36px] min-h-screen bg-white">
      <AuthLayout />
    </div>
  );
}

export default Login;
