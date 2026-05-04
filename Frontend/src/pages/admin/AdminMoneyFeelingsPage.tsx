import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import MoneyFeelingsList from "../../components/admin/feelings/MoneyFeelingsList";
import {
  getAdminMoneyFeelings,
  type AdminMoneyFeelingsFilters,
} from "../../services/adminMoneyFeelingsApi";
import type { AdminMoneyFeelingItem } from "../../types/adminMoneyFeelings";

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateRangeError(filters: AdminMoneyFeelingsFilters) {
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

export default function AdminMoneyFeelingsPage() {
  const [feelings, setFeelings] = useState<AdminMoneyFeelingItem[]>([]);
  const [filters, setFilters] = useState<AdminMoneyFeelingsFilters>({});
  const [filterError, setFilterError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFeelings(
    activeFilters: AdminMoneyFeelingsFilters = filters,
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

      const result = await getAdminMoneyFeelings(activeFilters);
      setFeelings(result);
    } catch {
      setError("Failed to load money feelings submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeelings({});
  }, []);

  function handleFiltersChange(updatedFilters: AdminMoneyFeelingsFilters) {
    setFilters(updatedFilters);
    setFilterError(getDateRangeError(updatedFilters));
  }

  function handleApplyFilters() {
    loadFeelings(filters);
  }

  function handleClearFilters() {
    const clearedFilters: AdminMoneyFeelingsFilters = {};
    setFilters(clearedFilters);
    setFilterError("");
    loadFeelings(clearedFilters);
  }

  return (
    <AdminLayout>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <MoneyFeelingsList
        feelings={feelings}
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
