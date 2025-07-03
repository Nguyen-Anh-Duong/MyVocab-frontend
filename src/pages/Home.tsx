import { useEffect } from "react";
import { Book, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function Home() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated (and not loading), show redirecting message
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigateToVocabularies = () => {
    window.location.href = "/vocabularies";
  };

  // User is authenticated, show home content
  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome to My Vocabulary App, {user?.username}!</h1>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Authentication Success Card */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-green-800">🎉 Authentication Working!</h2>
          <p className="mb-4 text-green-700">You are successfully logged in.</p>
          <div className="space-y-1 text-sm text-green-600">
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Username:</strong> {user?.username}
            </p>
            <p>
              <strong>Verified:</strong> {user?.isEmailVerified ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-blue-800">Quick Actions</h2>
          <div className="space-y-3">
            <Button onClick={navigateToVocabularies} className="flex w-full items-center justify-center gap-2">
              <Book className="h-4 w-4" />
              View My Vocabularies
            </Button>

            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
              onClick={() => alert("Add vocabulary functionality will be available from the vocabularies page!")}
            >
              <Plus className="h-4 w-4" />
              Add New Word
            </Button>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-8 rounded-lg bg-gray-50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Features Available</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm">✅ User Authentication</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm">✅ View Vocabularies</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <span className="text-sm">🚧 Add Vocabularies (Coming Soon)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <span className="text-sm">🚧 Edit Vocabularies (Coming Soon)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm">✅ Delete Vocabularies</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm">✅ Search Vocabularies</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
