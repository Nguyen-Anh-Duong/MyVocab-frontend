import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

function AuthGuard({ children, redirectTo = "/" }: AuthGuardProps) {
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect them away from auth pages
    if (isAuthenticated && user) {
      console.log("User is authenticated, redirecting...", user);
      // Redirect immediately
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, user, redirectTo]);

  // If user is authenticated, show redirect message with navigation options
  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-semibold">Welcome back, {user.username}!</h1>
        <p className="mb-6 text-gray-600">You are already logged in. Redirecting...</p>

        <div className="space-y-3">
          <button
            onClick={() => (window.location.href = "/")}
            className="block w-full rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Go to Home
          </button>

          <button
            onClick={() => (window.location.href = "/vocabularies")}
            className="block w-full rounded bg-green-500 px-6 py-2 text-white hover:bg-green-600"
          >
            View My Vocabularies
          </button>

          <button
            onClick={async () => {
              await logout();
              window.location.reload();
            }}
            className="block w-full rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // User is not authenticated, show login/register forms
  return <>{children}</>;
}

export default AuthGuard;
