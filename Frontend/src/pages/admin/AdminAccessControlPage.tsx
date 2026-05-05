import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Mail, Plus, Search, ShieldCheck, Trash2, X } from "lucide-react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import AdminCard from "../../components/admin/ui/AdminCard";
import {
  addAllowedRegistrationEmail,
  deleteAllowedRegistrationEmail,
  getAllowedRegistrationEmails,
} from "../../services/adminAccessControlApi";
import type { AllowedRegistrationEmail } from "../../types/adminAccessControl";

export default function AdminAccessControlPage() {
  const [emails, setEmails] = useState<AllowedRegistrationEmail[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailToDelete, setEmailToDelete] =
    useState<AllowedRegistrationEmail | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    async function loadEmails() {
      try {
        const result = await getAllowedRegistrationEmails();
        setEmails(result);
      } catch {
        setError("Failed to load allowed registration emails.");
      } finally {
        setLoading(false);
      }
    }

    loadEmails();
  }, []);

  async function handleAddEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = emailInput.trim();

    if (!email) {
      setError("Please enter an email address.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const created = await addAllowedRegistrationEmail(email);

      setEmails((current) => [created, ...current]);
      setEmailInput("");
      setSuccessMessage(`${email} has been added to the allow list.`);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to add email."));
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!emailToDelete) return;

    setDeletingId(emailToDelete.id);
    setError("");
    setSuccessMessage("");

    try {
      const deletedEmail = emailToDelete.email;

      await deleteAllowedRegistrationEmail(emailToDelete.id);

      setEmails((current) =>
        current.filter((item) => item.id !== emailToDelete.id),
      );

      setEmailToDelete(null);
      setSuccessMessage(`${deletedEmail} has been removed from the allow list.`);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete email."));
    } finally {
      setDeletingId(null);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredEmails = normalizedSearchTerm
    ? emails.filter((item) =>
        item.email.toLowerCase().includes(normalizedSearchTerm),
      )
    : emails;

  return (
    <AdminLayout>
      <AdminCard className="p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <ShieldCheck size={20} className="shrink-0 text-[#2563eb]" />
            <h2 className="text-[20px] font-semibold text-[#0f172a]">
              Allowed Registration Emails
            </h2>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[13px] font-semibold text-emerald-700">
            {loading
              ? "Loading..."
              : `${emails.length} approved ${emails.length === 1 ? "email" : "emails"}`}
          </span>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block w-full lg:max-w-[330px]">
            <span className="sr-only">Search by email</span>

            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search..."
              className="h-12 w-full rounded-full border border-[#dbe6f5] bg-[#f8fbff] pl-11 pr-10 text-[15px] text-[#0f172a] outline-none transition placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </label>

          <form
            onSubmit={handleAddEmail}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <label className="relative block min-w-0 flex-1">
              <span className="sr-only">Email address</span>

              <Mail
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                placeholder="Add email address..."
                className="h-12 w-full rounded-full border border-[#dbe6f5] bg-[#f8fbff] pl-11 pr-4 text-[15px] text-[#0f172a] outline-none transition placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4f17e8] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#4313c7] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:gap-2 sm:px-5"
              aria-label={saving ? "Adding email" : "Add email"}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">
                {saving ? "Adding..." : "Add Email"}
              </span>
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] font-medium text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="mt-5 space-y-3">
          {loading && (
            <p className="text-[14px] text-slate-600">Loading emails...</p>
          )}

          {!loading && emails.length === 0 && (
            <div className="rounded-[20px] border border-dashed border-[#dbe6f5] bg-[#f8fbff] px-4 py-8 text-center text-[14px] font-medium text-slate-500">
              No registration emails added yet.
            </div>
          )}

          {!loading && emails.length > 0 && filteredEmails.length === 0 && (
            <div className="rounded-[20px] border border-dashed border-[#dbe6f5] bg-[#f8fbff] px-4 py-8 text-center text-[14px] font-medium text-slate-500">
              No emails found for “{searchTerm}”.
            </div>
          )}

          {!loading &&
            filteredEmails.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-[20px] border border-[#dbe6f5] bg-[#f8fbff] px-4 py-3 transition hover:bg-white hover:shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
              >
                <div className="flex min-w-0 items-center gap-2 text-[15px] font-semibold text-[#0f172a]">
                  <Mail size={15} className="shrink-0 text-slate-400" />
                  <span className="min-w-0 break-all">{item.email}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setEmailToDelete(item)}
                  disabled={deletingId === item.id}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={`Delete ${item.email}`}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
        </div>
      </AdminCard>

      <DeleteEmailModal
        email={emailToDelete}
        deleting={emailToDelete ? deletingId === emailToDelete.id : false}
        onClose={() => setEmailToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}

type DeleteEmailModalProps = {
  email: AllowedRegistrationEmail | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteEmailModal({
  email,
  deleting,
  onClose,
  onConfirm,
}: DeleteEmailModalProps) {
  if (!email) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-[#dbe6f5] bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-semibold text-[#0f172a]">
              Delete allowed email?
            </h3>

            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              This email will no longer be allowed to register for the app.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f8fc] text-slate-500 transition hover:bg-[#edf3fd] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close delete email modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mb-5 break-all rounded-2xl border border-[#dbe6f5] bg-[#f8fbff] px-4 py-3 text-[15px] font-semibold text-[#0f172a]">
          {email.email}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#dbe6f5] bg-white px-5 text-[14px] font-semibold text-slate-700 transition hover:bg-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-[14px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete Email"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(error.message) as { error?: string };
    return parsed.error || fallback;
  } catch {
    return error.message;
  }
}
