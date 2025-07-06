import { useEffect, useState } from "react";
import adminService from "@/services/adminService";
import { Book, FileText, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalUsers: number;
  totalVocabularies: number;
  totalCategories: number;
  recentActivity: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVocabularies: 0,
    totalCategories: 0,
    recentActivity: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const statsData = await adminService.getDashboardStats();
      setStats(statsData);
    } catch (err: any) {
      console.error("Failed to fetch dashboard stats:", err);
      setError(err.message);
      // Fallback to mock data on error
      setStats({
        totalUsers: 0,
        totalVocabularies: 0,
        totalCategories: 0,
        recentActivity: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Vocabularies",
      value: stats.totalVocabularies,
      icon: Book,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Recent Activity",
      value: stats.recentActivity,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your vocabulary app</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchDashboardStats}>
            Refresh Data
          </Button>
          <Button>Generate Report</Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">⚠️ Failed to load real data: {error}. Showing fallback data.</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</div>
                <p className="mt-1 text-xs text-gray-500">{error ? "Cached data" : "+12% from last month"}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">Manage user accounts, permissions, and activity</p>
            <Button className="w-full" onClick={() => (window.location.href = "/admin/users")}>
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Vocabulary Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">Review, edit, and manage all vocabulary entries</p>
            <Button className="w-full" onClick={() => (window.location.href = "/admin/vocabularies")}>
              Manage Vocabularies
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Category Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">Organize and manage vocabulary categories</p>
            <Button className="w-full" onClick={() => (window.location.href = "/admin/categories")}>
              Manage Categories
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 py-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">New user registered: duong@example.com</span>
              </div>
              <span className="text-xs text-gray-500">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 py-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm">Vocabulary "accommodate" was updated</span>
              </div>
              <span className="text-xs text-gray-500">5 minutes ago</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 py-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="text-sm">New category "Business English" created</span>
              </div>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <span className="text-sm">User exported vocabulary collection</span>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
          </div>

          {/* Show note about activity data */}
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-600">
              📝 Recent activity data is currently simulated. Real activity tracking will be implemented when backend
              provides activity logs API.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
