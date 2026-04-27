import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import ParentFeedbackList from "../../components/admin/feedbacks/ParentFeedbackList";
import {
  getAdminParentFeedbacks,
  type AdminParentFeedbackFilters,
} from "../../services/adminParentFeedbackApi";
import type { AdminParentFeedback } from "../../types/adminParentFeedback";

export default function AdminParentFeedbackPage() {
  const [feedback, setFeedback] = useState<AdminParentFeedback[]>([]);
  const [filters, setFilters] = useState<AdminParentFeedbackFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFeedback(
    activeFilters: AdminParentFeedbackFilters = filters,
  ) {
    try {
      setLoading(true);
      setError("");

      const result = await getAdminParentFeedbacks(activeFilters);
      setFeedback(result);
    } catch {
      setError("Failed to load parent feedback.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    getAdminParentFeedbacks()
      .then((result) => {
        if (!isCancelled) {
          setFeedback(result);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError("Failed to load parent feedback.");
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

  function handleFiltersChange(updatedFilters: AdminParentFeedbackFilters) {
    setFilters(updatedFilters);
  }

  function handleApplyFilters() {
    loadFeedback(filters);
  }

  function handleClearFilters() {
    const clearedFilters: AdminParentFeedbackFilters = {};

    setFilters(clearedFilters);
    loadFeedback(clearedFilters);
  }

  return (
    <AdminLayout>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <ParentFeedbackList
        feedback={feedback}
        filters={filters}
        loading={loading}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </AdminLayout>
  );
}