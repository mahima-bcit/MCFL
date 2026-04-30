import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Save,
  Settings,
  X,
} from "lucide-react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import AdminCard from "../../components/admin/ui/AdminCard";
import {
  changeAdminPassword,
  getAdminAccountSettings,
} from "../../services/adminSettingsApi";

type ApiErrorResponse = {
  error?: string;
  errors?: string[] | Record<string, string[]>;
  title?: string;
};

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  autoComplete: string;
  isVisible: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
};

function getApiErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Failed to update password.";
  }

  try {
    const parsed = JSON.parse(error.message) as ApiErrorResponse;

    if (parsed.error) {
      return parsed.error;
    }

    if (Array.isArray(parsed.errors) && parsed.errors.length > 0) {
      return parsed.errors.join(" ");
    }

    if (parsed.errors && typeof parsed.errors === "object") {
      const messages = Object.values(parsed.errors).flat();

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }

    if (parsed.title) {
      return parsed.title;
    }
  } catch {
    // Use fallback below.
  }

  return "Failed to update password. Please check your current password and try again.";
}

function PasswordField({
  id,
  label,
  value,
  placeholder,
  autoComplete,
  isVisible,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[13px] font-semibold text-[#153d73]"
      >
        {label}
      </label>

      <div className="relative">
        <Lock
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8aa2c3]"
        />

        <input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-2xl border border-[#d9e3f3] bg-[#f8fbff] py-3 pl-12 pr-12 text-[15px] text-[#0f172a] outline-none transition placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/10"
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-[#8aa2c3] transition hover:text-[#2563eb]"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [email, setEmail] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pageError, setPageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadSettings() {
      try {
        setLoading(true);
        setPageError("");

        const result = await getAdminAccountSettings();

        if (!isCancelled) {
          setEmail(result.email);
          setMustChangePassword(result.mustChangePassword);
        }
      } catch {
        if (!isCancelled) {
          setPageError("Failed to load admin settings.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      isCancelled = true;
    };
  }, []);

  function validateForm() {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return "Please fill in all password fields.";
    }

    if (newPassword.length < 6) {
      return "New password must be at least 6 characters.";
    }

    if (currentPassword === newPassword) {
      return "New password must be different from the current password.";
    }

    if (newPassword !== confirmNewPassword) {
      return "New password and confirm password do not match.";
    }

    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    const validationError = validateForm();

    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setShowConfirmModal(true);
  }

  async function handleConfirmPasswordChange() {
    try {
      setSaving(true);
      setSubmitError("");
      setSuccessMessage("");

      await changeAdminPassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setMustChangePassword(false);
      setShowConfirmModal(false);
      setSuccessMessage("Password updated successfully.");
    } catch (error) {
      setShowConfirmModal(false);
      setSubmitError(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[900px]">
        <AdminCard className="p-5 md:p-7">
          <div className="mb-6 flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4ff] text-[#2563eb]">
              <Settings size={22} />
            </div>

            <div>
              <h1 className="text-[22px] font-bold leading-tight text-[#0f172a]">
                Admin Settings
              </h1>
              <p className="mt-1 text-[14px] text-[#7183a3]">
                Manage your admin account
              </p>
            </div>
          </div>

          <div className="mb-6 h-px bg-[#e6edf7]" />
          {loading && (
            <p className="rounded-2xl border border-[#dbe6f5] bg-[#f8fbff] p-4 text-[14px] text-slate-600">
              Loading admin settings...
            </p>
          )}

          {pageError && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-[14px] text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{pageError}</p>
            </div>
          )}

          {!loading && !pageError && (
            <form onSubmit={handleSubmit}>
              {mustChangePassword && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-[14px] text-amber-800">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>
                    You are using a temporary password. Please update it before
                    continuing.
                  </p>
                </div>
              )}

              <section>
                <h2 className="text-[17px] font-bold text-[#153d73]">
                  Account Email
                </h2>

                <div className="mt-4">
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-[13px] font-semibold text-[#153d73]"
                  >
                    Admin Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8aa2c3]"
                    />

                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      readOnly
                      className="w-full cursor-not-allowed rounded-2xl border border-[#d9e3f3] bg-[#f8fbff] py-3 pl-12 pr-4 text-[15px] text-[#0f172a] outline-none"
                    />
                  </div>

                  <p className="mt-2 text-[13px] text-slate-500">
                    This email is used for admin sign-in. Contact the project
                    team if this needs to be changed.
                  </p>
                </div>
              </section>

              <div className="my-7 h-px bg-[#e6edf7]" />

              <section>
                <h2 className="text-[17px] font-bold text-[#153d73]">
                  Change Password
                </h2>

                <div className="mt-4 space-y-4">
                  <PasswordField
                    id="current-password"
                    label="Current Password"
                    value={currentPassword}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    isVisible={showCurrentPassword}
                    onChange={setCurrentPassword}
                    onToggleVisibility={() =>
                      setShowCurrentPassword((prev) => !prev)
                    }
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <PasswordField
                      id="new-password"
                      label="New Password"
                      value={newPassword}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      isVisible={showNewPassword}
                      onChange={setNewPassword}
                      onToggleVisibility={() =>
                        setShowNewPassword((prev) => !prev)
                      }
                    />

                    <PasswordField
                      id="confirm-new-password"
                      label="Confirm New Password"
                      value={confirmNewPassword}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      isVisible={showConfirmNewPassword}
                      onChange={setConfirmNewPassword}
                      onToggleVisibility={() =>
                        setShowConfirmNewPassword((prev) => !prev)
                      }
                    />
                  </div>
                </div>
              </section>

              {submitError && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-[14px] text-red-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{submitError}</p>
                </div>
              )}

              {successMessage && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-[14px] text-emerald-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  <p>{successMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563eb] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.25)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </form>
          )}
        </AdminCard>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-[#dbe6f5] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <AlertTriangle size={22} />
                  </div>

                  <div>
                    <h2 className="text-[20px] font-bold text-[#0f172a]">
                      Change password?
                    </h2>
                    <p className="mt-2 text-[14px] leading-6 text-slate-600">
                      Are you sure you want to update your admin password? You
                      will need to use the new password the next time you sign
                      in.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={saving}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Close confirmation"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={saving}
                  className="inline-flex justify-center rounded-2xl border border-[#dbe6f5] bg-white px-5 py-3 text-[14px] font-semibold text-[#153d73] transition hover:bg-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPasswordChange}
                  disabled={saving}
                  className="inline-flex justify-center rounded-2xl bg-[#2563eb] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.25)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Updating..." : "Yes, change password"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
