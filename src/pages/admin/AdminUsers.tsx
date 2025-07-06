import { useEffect, useState } from "react";
import adminService from "@/services/adminService";
import { UserRole } from "@/types/auth";
import { AlertCircle, MoreHorizontal, Search, Shield, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminUser {
  id: string;
  userId?: string; // Backend uses userId
  username: string;
  email: string;
  role: UserRole;
  status?: string; // Backend includes status field
  lastLoginAt?: string;
  vocabularyCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const usersData = await adminService.getAllUsers();

      console.log("Received users data:", usersData);

      // Ensure role is always set and ID is properly mapped
      const formattedUsers = usersData.map((user: any) => {
        console.log("Processing user:", user);
        return {
          ...user,
          id: user.userId || user.id || user._id, // Use userId from backend
          role: user.role || UserRole.USER
        };
      });

      console.log("Formatted users:", formattedUsers);
      setUsers(formattedUsers);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(err.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setActionLoading(userId);
      await adminService.updateUserRole(userId, newRole);

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));

      alert(`User role updated to ${newRole} successfully`);
    } catch (err: any) {
      console.error("Failed to update user role:", err);
      alert(`Failed to update user role: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(userId);
      await adminService.deleteUser(userId);

      // Update local state
      setUsers(users.filter((user) => user.id !== userId));

      alert("User deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      alert(`Failed to delete user: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter((u) => u.role === UserRole.ADMIN).length;
    const regularUsers = users.filter((u) => u.role === UserRole.USER).length;
    const activeUsers = users.filter(
      (u) => u.lastLoginAt && new Date(u.lastLoginAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    return { totalUsers, adminUsers, regularUsers, activeUsers };
  };

  const stats = getUserStats();

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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers}>
            Refresh
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-600">Failed to load users: {error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.adminUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Regular Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.regularUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value={UserRole.USER}>Regular Users</option>
          <option value={UserRole.ADMIN}>Admins</option>
        </select>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="py-8 text-center text-gray-500">{error ? "Failed to load users" : "No users found"}</div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{user.username}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            user.role === UserRole.ADMIN ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role === UserRole.ADMIN ? "Admin" : "User"}
                        </span>
                        {user.vocabularyCount !== undefined && (
                          <span className="text-xs text-gray-400">{user.vocabularyCount} vocabularies</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm text-gray-500">
                      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                      {user.lastLoginAt && <p>Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</p>}
                    </div>

                    <div className="flex gap-1">
                      {user.role === UserRole.USER ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRoleChange(user.id, UserRole.ADMIN)}
                          disabled={actionLoading === user.id}
                          title="Make Admin"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRoleChange(user.id, UserRole.USER)}
                          disabled={actionLoading === user.id}
                          title="Remove Admin"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={actionLoading === user.id}
                        className="text-red-600 hover:text-red-700"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
