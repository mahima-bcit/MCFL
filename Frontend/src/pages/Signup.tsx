import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

type SignupFormData = {
  fullName: string;
  nickname: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialFormData: SignupFormData = {
  fullName: "",
  nickname: "",
  dateOfBirth: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function calculateAge(dateOfBirth: string) {
  if (!dateOfBirth) return null;

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);

  const age = useMemo(() => calculateAge(formData.dateOfBirth), [formData.dateOfBirth]);
  const requiresParentConsent = age !== null && age <= 17;

  const formIsValid =
    formData.fullName.trim().length > 0 &&
    formData.nickname.trim().length > 0 &&
    age !== null &&
    age >= 13 &&
    emailPattern.test(formData.email) &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword;

  function updateField<K extends keyof SignupFormData>(key: K, value: SignupFormData[K]) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formIsValid) return;
    localStorage.setItem(
      "mcflRegistrationDraft",
      JSON.stringify({ ...formData, age, requiresParentConsent }),
    );
    navigate("/profile-setup");
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border-2 border-nav/20 text-nav placeholder-nav/40 focus:outline-none focus:border-primary transition-colors";
  const labelClass = "block text-sm font-semibold text-nav mb-1.5";

  return (
    <main>
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg animate-fade-up">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h1 className="font-display text-3xl font-bold text-nav mb-1.5">
                Create your account
              </h1>
              <p className="text-nav/60 text-base">
                Start your journey to financial confidence
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name + Nickname */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    placeholder="Your legal name"
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Nickname</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    placeholder="What we call you"
                    onChange={(e) => updateField("nickname", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  className={inputClass}
                />
                {age !== null && age < 13 && (
                  <p className="mt-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                    This prototype is currently intended for users age 13 and older.
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  placeholder="your@email.com"
                  onChange={(e) => updateField("email", e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Password + Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    placeholder="••••••••"
                    onChange={(e) => updateField("password", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    placeholder="••••••••"
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {requiresParentConsent && (
                <p className="rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
                  Because you are age 17 or under, the next step will explain the parent/guardian consent requirement.
                </p>
              )}

              <p className="text-center text-nav/70 text-sm pt-1">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                  Log in
                </Link>
              </p>

              <Button
                type="submit"
                variant="primary"
                className="w-full text-base py-3 justify-center"
              >
                Next →
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
