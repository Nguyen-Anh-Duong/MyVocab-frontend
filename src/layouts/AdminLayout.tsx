import { useEffect, useState } from "react";
import { UserRole } from "@/types/auth";
import { BarChart3, Book, FileText, LogOut, Menu, Users, X } from "lucide-react";
import { Outlet, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        navigate("/login");
      } else if (user?.role !== UserRole.ADMIN) {
        // Redirect to home if not admin
        navigate("/");
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  // Don't render admin layout if user is not admin
  if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
    return null;
  }

  const sidebarItems = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Vocabularies", href: "/admin/vocabularies", icon: Book },
    { name: "Categories", href: "/admin/categories", icon: FileText }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="mb-3 text-sm text-gray-600">
              <p className="font-medium">{user?.username}</p>
              <p className="text-xs">{user?.email}</p>
              <p className="text-xs text-blue-600">Administrator</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <div></div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
