import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import UserFeedbackList from "../../components/admin/feedbacks/UserFeedbackList";
import {
  getAdminUserFeedback,
  getAdminUserFeedbackTypes,
  type AdminUserFeedbackFilters,
} from "../../services/adminUserFeedbackApi";
import type { AdminUserFeedbackItem } from "../../types/adminUserFeedback";

function getTodayDateString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateRangeError(filters: AdminUserFeedbackFilters) {
  const today = getTodayDateString();

  if (filters.startDate && filters.startDate > today) {
    return "From date cannot be after today's date.";
  }

  if (filters.endDate && filters.endDate > today) {
    return "To date cannot be after today's date.";
  }

  if (
    filters.startDate &&
    filters.endDate &&
    filters.startDate > filters.endDate
  ) {
    return "From date cannot be after To date.";
  }

  return "";
}

export default function AdminUserFeedbackPage() {
  const [feedback, setFeedback] = useState<AdminUserFeedbackItem[]>([]);
  const [feedbackTypes, setFeedbackTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState<AdminUserFeedbackFilters>({});
  const [filterError, setFilterError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFeedback(
    activeFilters: AdminUserFeedbackFilters = filters,
  ) {
    const validationError = getDateRangeError(activeFilters);

    if (validationError) {
      setFilterError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFilterError("");

      const result = await getAdminUserFeedback(activeFilters);
      setFeedback(result);
    } catch {
      setError("Failed to load user feedback.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const [feedbackResult, typeResult] = await Promise.all([
          getAdminUserFeedback(),
          getAdminUserFeedbackTypes(),
        ]);

        setFeedback(feedbackResult);
        setFeedbackTypes(typeResult);
      } catch {
        setError("Failed to load user feedback.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  function handleFiltersChange(updatedFilters: AdminUserFeedbackFilters) {
    setFilters(updatedFilters);
    setFilterError(getDateRangeError(updatedFilters));
  }

  function handleApplyFilters() {
    loadFeedback(filters);
  }

  function handleClearFilters() {
    const clearedFilters: AdminUserFeedbackFilters = {};

    setFilters(clearedFilters);
    setFilterError("");
    loadFeedback(clearedFilters);
  }

  return (
    <AdminLayout>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <UserFeedbackList
        feedback={feedback}
        feedbackTypes={feedbackTypes}
        filters={filters}
        filterError={filterError}
        loading={loading}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </AdminLayout>
  );
}
