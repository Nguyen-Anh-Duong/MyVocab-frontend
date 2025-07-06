import { useEffect, useState } from "react";
import { API_CONFIG } from "@/config/api";

function OAuthSuccess() {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        // Extract accessToken from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");

        if (!accessToken) {
          setError("No access token found in URL parameters");
          setProcessing(false);
          return;
        }

        // Store accessToken in localStorage
        localStorage.setItem("accessToken", accessToken);

        // Try to get user info using Bearer token
        try {
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS.ME}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();

            if (data && data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
            } else if (data.data && data.data.user) {
              localStorage.setItem("user", JSON.stringify(data.data.user));
            }

            // Trigger custom storage change event so useAuth hook can detect the change
            window.dispatchEvent(new CustomEvent("localStorageChanged"));
          } else {
            const errorText = await response.text();
            setError(`API Error: ${response.status} - ${errorText}`);
            setProcessing(false);
            return;
          }
        } catch (apiError) {
          setError(`Network error: ${apiError}`);
          setProcessing(false);
          return;
        }

        // Clean up URL (remove accessToken from URL)
        window.history.replaceState({}, document.title, window.location.pathname);

        // Redirect after 1 second
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error) {
        setError(`Processing error: ${error}`);
        setProcessing(false);
      }
    };

    handleOAuthSuccess();
  }, []);

  const handleRetryLogin = () => {
    window.location.href = "/login";
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg border bg-white p-6 text-center shadow-lg">
          <div className="mb-4 text-red-500">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Authentication Error</h2>
          <p className="mb-4 text-sm text-gray-600">{error}</p>
          <div className="space-y-2">
            <button
              onClick={handleGoHome}
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try Go Home
            </button>
            <button
              onClick={handleRetryLogin}
              className="w-full rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    </div>
  );
}

export default OAuthSuccess;
