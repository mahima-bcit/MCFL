import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import UsersTable from "../../components/admin/users/UsersTable";
import { getAdminUsers } from "../../services/adminUsersApi";
import type { AdminUserListItem } from "../../types/adminUsers";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const result = await getAdminUsers();
        setUsers(result);
      } catch {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <AdminLayout>
      {loading && <p className="text-slate-600">Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && <UsersTable users={users} />}
    </AdminLayout>
  );
}