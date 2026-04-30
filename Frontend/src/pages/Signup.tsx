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

type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>;

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
  return <label className="mb-2 block font-sans text-xs font-bold text-black">{children}</label>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-2 text-xs font-semibold text-[#c53030]">{message}</p>;
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
      className="h-12 w-full rounded-2xl border border-[#dce6ef] bg-[#f7fbff] px-4 font-sans text-sm text-[#1f3a60] outline-none transition-all placeholder:text-[#9aa9bc] focus:border-[#21A879] focus:bg-white focus:ring-4 focus:ring-[#21A879]/15"
    />
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<SignupFormErrors>({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const age = useMemo(() => calculateAge(formData.dateOfBirth), [formData.dateOfBirth]);
  const requiresParentConsent = age !== null && age <= 17;

  function validateForm() {
    const errors: SignupFormErrors = {};

    if (formData.fullName.trim().length === 0) {
      errors.fullName = "Full name is required.";
    }

    if (formData.nickname.trim().length === 0) {
      errors.nickname = "Nickname is required.";
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required.";
    } else if (age === null) {
      errors.dateOfBirth = "Please enter a valid date of birth.";
    } else if (age < 13) {
      errors.dateOfBirth = "This prototype is currently intended for users age 13 and older.";
    }

    if (formData.email.trim().length === 0) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (formData.password.length === 0) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must include at least one uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = "Password must include at least one lowercase letter.";
    } else if (!/\d/.test(formData.password)) {
      errors.password = "Password must include at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      errors.password = "Password must include at least one special character.";
    }

    if (formData.confirmPassword.length === 0) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Confirm password must match password.";
    }

    return errors;
  }

  function updateField<K extends keyof SignupFormData>(key: K, value: SignupFormData[K]) {
    setFormData((current) => ({ ...current, [key]: value }));

    setFormErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  }

  async function validateRegistrationEmail() {
    const response = await fetch(
      `/api/account/validate-registration-email?email=${encodeURIComponent(
        formData.email.trim(),
      )}`,
    );

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(responseBody?.error ?? "Unable to validate email.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsCheckingEmail(true);

      await validateRegistrationEmail();

      localStorage.setItem(
        "mcflRegistrationDraft",
        JSON.stringify({
          ...formData,
          email: formData.email.trim(),
          age,
          requiresParentConsent,
        }),
      );

      navigate("/profile-setup");
    } catch (error) {
      setFormErrors((current) => ({
        ...current,
        email:
          error instanceof Error
            ? error.message
            : "Unable to validate email.",
      }));
    } finally {
      setIsCheckingEmail(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 font-sans md:px-8 md:py-12">
      <header className="mb-7">
        <h1 className="font-sans text-[1.55rem] font-black leading-tight tracking-[-0.04em] text-black md:text-[2rem]">
          Create your account
        </h1>
        <p className="mt-2 font-sans text-sm text-[#7c90aa]">Start your journey to financial confidence</p>
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
            <FieldError message={formErrors.fullName} />
          </div>

          <div>
            <FieldLabel>Nickname</FieldLabel>
            <TextInput
              value={formData.nickname}
              placeholder="What should we call you in the app?"
              onChange={(value) => updateField("nickname", value)}
            />
            <FieldError message={formErrors.nickname} />
          </div>

          <div>
            <FieldLabel>Date of Birth</FieldLabel>
            <TextInput
              type="date"
              value={formData.dateOfBirth}
              placeholder="yyyy-mm-dd"
              onChange={(value) => updateField("dateOfBirth", value)}
            />
            <FieldError message={formErrors.dateOfBirth} />
          </div>

          <div>
            <FieldLabel>Email</FieldLabel>
            <TextInput
              type="email"
              value={formData.email}
              placeholder="your@email.com"
              onChange={(value) => updateField("email", value)}
            />
            <FieldError message={formErrors.email} />
          </div>

          <div>
            <FieldLabel>Password</FieldLabel>
            <TextInput
              type="password"
              value={formData.password}
              placeholder="••••••••"
              onChange={(value) => updateField("password", value)}
            />
            <FieldError message={formErrors.password} />
          </div>

          <div>
            <FieldLabel>Confirm Password</FieldLabel>
            <TextInput
              type="password"
              value={formData.confirmPassword}
              placeholder="••••••••"
              onChange={(value) => updateField("confirmPassword", value)}
            />
            <FieldError message={formErrors.confirmPassword} />
          </div>
        </div>

        {requiresParentConsent && (
          <div className="mt-6 rounded-2xl border border-[#f2e6b5] bg-[#fff8e6] px-4 py-3 font-sans text-sm leading-6 text-[#8d6a22]">
            Because you are age 17 or under, the next step will explain the parent/guardian consent requirement.
          </div>
        )}

        <p className="mt-7 text-center font-sans text-xs text-[#7c90aa]">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#295cff] hover:underline">
            Log in
          </Link>
        </p>
      </form>

      <button
        type="button"
        disabled={isCheckingEmail}
        onClick={() => {
          const form = document.querySelector("form");
          form?.requestSubmit();
        }}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#21A879] px-8 py-4 font-sans text-sm font-semibold text-white shadow-[0_10px_24px_rgba(33,168,121,0.24)] transition-all hover:bg-[#1c9169] disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
      >
        {isCheckingEmail ? "Checking email..." : "Next →"}
      </button>
    </section>
  );
}