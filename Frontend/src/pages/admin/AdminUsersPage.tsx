import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import UsersTable from "../../components/admin/users/UsersTable";
import {
  getAdminUsers,
  type AdminUsersFilters,
} from "../../services/adminUsersApi";
import type { AdminUserListItem } from "../../types/adminUsers";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [filters, setFilters] = useState<AdminUsersFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers(activeFilters: AdminUsersFilters = filters) {
    try {
      setLoading(true);
      setError("");

      const result = await getAdminUsers(activeFilters);
      setUsers(result);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    getAdminUsers()
      .then((result) => {
        if (!isCancelled) {
          setUsers(result);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError("Failed to load users.");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  function handleFiltersChange(updatedFilters: AdminUsersFilters) {
    setFilters(updatedFilters);
  }

  function handleApplyFilters(activeFilters: AdminUsersFilters = filters) {
    loadUsers(activeFilters);
  }

  function handleClearFilters() {
    const clearedFilters: AdminUsersFilters = {};

    setFilters(clearedFilters);
    loadUsers(clearedFilters);
  }

  return (
    <AdminLayout>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <UsersTable
        users={users}
        filters={filters}
        loading={loading}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </AdminLayout>
  );
}