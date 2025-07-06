import { UserRole } from "@/types/auth";
import { Book, LogOut, Moon, Plus, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAddWord = () => {
    // Trigger add word action - could dispatch event or navigate
    const event = new CustomEvent("openAddVocabulary");
    window.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="flex h-[63px] items-center justify-between gap-3 px-[36px]">
        <a href="/">
          <div className="flex cursor-pointer items-center justify-center gap-2">
            <Book size={27} className="text-blue-600" />
            <p className="font-bold">MyVocab</p>
          </div>
        </a>

        {isAuthenticated ? (
          <nav className="flex items-center justify-center gap-3">
            <a href="/">
              <Button variant="ghost" className="flex cursor-pointer items-center justify-center gap-3">
                <Search />
                <p>Browse</p>
              </Button>
            </a>
            <Button
              variant="ghost"
              onClick={handleAddWord}
              className="flex cursor-pointer items-center justify-center gap-3"
            >
              <Plus />
              <p>Add</p>
            </Button>
            <a href="/categories">
              <Button variant="ghost" className="flex cursor-pointer items-center justify-center gap-3">
                <p>Categories</p>
              </Button>
            </a>

            {/* Admin Link - Only show for admin users */}
            {user?.role === UserRole.ADMIN && (
              <a href="/admin">
                <Button variant="ghost" className="flex cursor-pointer items-center justify-center gap-3">
                  <Settings />
                  <p>Admin</p>
                </Button>
              </a>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
              <span className="text-sm text-gray-600">Welcome, {user?.username}!</span>
              <Button variant="ghost" onClick={handleLogout} size="sm" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>

            <Button variant="ghost" className="cursor-pointer">
              <Moon />
            </Button>
          </nav>
        ) : (
          <nav className="flex items-center gap-3">
            <a href="/login">
              <Button variant="outline">Login</Button>
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
