import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-xs font-bold text-[#153c73]">{children}</label>;
}

function TextInput({
  type = "text",
  value,
  placeholder,
  onChange,
}: {
  type?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-full rounded-2xl border border-[#dce6ef] bg-[#f7fbff] px-4 text-sm text-[#1f3a60] outline-none transition-all placeholder:text-[#9aa9bc] focus:border-[#5c7cff] focus:bg-white focus:ring-4 focus:ring-[#5c7cff]/10"
    />
  );
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
      JSON.stringify({
        ...formData,
        age,
        requiresParentConsent,
      }),
    );

    navigate("/profile-setup");
  }

  return (
      <section className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-12">
        <header className="mb-7">
          <h1 className="text-[1.55rem] font-black leading-tight tracking-[-0.04em] md:text-[2rem]">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[#7c90aa]">Start your journey to financial confidence</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[#edf1f6] bg-white p-5 shadow-[0_14px_34px_rgba(23,42,79,0.07)] md:p-7"
        >
          <div className="space-y-5">
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <TextInput
                value={formData.fullName}
                placeholder="Your full legal name"
                onChange={(value) => updateField("fullName", value)}
              />
            </div>

            <div>
              <FieldLabel>Nickname</FieldLabel>
              <TextInput
                value={formData.nickname}
                placeholder="What should we call you in the app?"
                onChange={(value) => updateField("nickname", value)}
              />
            </div>

            <div>
              <FieldLabel>Date of Birth</FieldLabel>
              <TextInput
                type="date"
                value={formData.dateOfBirth}
                placeholder="yyyy-mm-dd"
                onChange={(value) => updateField("dateOfBirth", value)}
              />
              {age !== null && age < 13 && (
                <p className="mt-2 text-xs font-semibold text-[#c53030]">
                  This prototype is currently intended for users age 13 and older.
                </p>
              )}
            </div>

            <div>
              <FieldLabel>Email</FieldLabel>
              <TextInput
                type="email"
                value={formData.email}
                placeholder="your@email.com"
                onChange={(value) => updateField("email", value)}
              />
            </div>

            <div>
              <FieldLabel>Password</FieldLabel>
              <TextInput
                type="password"
                value={formData.password}
                placeholder="••••••••"
                onChange={(value) => updateField("password", value)}
              />
            </div>

            <div>
              <FieldLabel>Confirm Password</FieldLabel>
              <TextInput
                type="password"
                value={formData.confirmPassword}
                placeholder="••••••••"
                onChange={(value) => updateField("confirmPassword", value)}
              />
            </div>
          </div>

          {requiresParentConsent && (
            <div className="mt-6 rounded-2xl border border-[#f2e6b5] bg-[#fff8e6] px-4 py-3 text-sm leading-6 text-[#8d6a22]">
              Because you are age 17 or under, the next step will explain the parent/guardian consent requirement.
            </div>
          )}

          <p className="mt-7 text-center text-xs text-[#7c90aa]">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#295cff] hover:underline">
              Log in
            </Link>
          </p>
        </form>

        <button
          type="button"
          disabled={!formIsValid}
          onClick={() => {
            const form = document.querySelector("form");
            form?.requestSubmit();
          }}
          className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-semibold transition-all md:text-base ${
            formIsValid
              ? "bg-[#2f6feb] text-white shadow-[0_10px_24px_rgba(47,111,235,0.22)] hover:bg-[#255ed0]"
              : "bg-[#d8e3ee] text-[#9aa9bc]"
          }`}
        >
          Next →
        </button>
      </section>
  );
}
