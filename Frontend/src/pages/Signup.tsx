import { type FormEvent, type ReactNode, useMemo, useState } from "react";
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

function FieldLabel({ children }: { children: ReactNode }) {
    return (
        <label className="block text-sm font-semibold text-nav mb-1.5">
            {children}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;

    return (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {message}
        </p>
    );
}

function TextInput({
    type = "text",
    value,
    placeholder,
    max,
    onChange,
}: {
    type?: string;
    value: string;
    placeholder: string;
    max?: string;
    onChange: (value: string) => void;
}) {
    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            max={max}
            onChange={(event) => onChange(event.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-nav/20 text-nav placeholder-nav/40 focus:outline-none focus:border-primary transition-colors"
        />
    );
}

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignupFormData>(initialFormData);
    const [formErrors, setFormErrors] = useState<SignupFormErrors>({});
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const age = useMemo(
        () => calculateAge(formData.dateOfBirth),
        [formData.dateOfBirth],
    );

    const requiresParentConsent = age !== null && age <= 17;

    const today = new Date();
    const todayDateOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );
    const maxDateOfBirth = todayDateOnly.toISOString().split("T")[0];

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
        } else {
            const selectedBirthDate = new Date(`${formData.dateOfBirth}T00:00:00`);

            if (age === null || Number.isNaN(selectedBirthDate.getTime())) {
                errors.dateOfBirth = "Please enter a valid date of birth.";
            } else if (selectedBirthDate > todayDateOnly) {
                errors.dateOfBirth = "Date of birth cannot be in the future.";
            } else if (age < 13) {
                errors.dateOfBirth =
                    "This prototype is currently intended for users age 13 and older.";
            }
        }

        if (formData.email.trim().length === 0) {
            errors.email = "Email is required.";
        } else if (!emailPattern.test(formData.email.trim())) {
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

    function updateField<K extends keyof SignupFormData>(
        key: K,
        value: SignupFormData[K],
    ) {
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
                    fullName: formData.fullName.trim(),
                    nickname: formData.nickname.trim(),
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
        <main>
            <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
                <div className="w-full max-w-2xl animate-fade-up">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-center mb-6">
                            <h1 className="font-display text-3xl font-bold text-nav mb-1.5">
                                Create Account
                            </h1>
                            <p className="text-nav/60 text-base">
                                Start your journey to financial confidence
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                                        placeholder="In-app name"
                                        onChange={(value) => updateField("nickname", value)}
                                    />
                                    <FieldError message={formErrors.nickname} />
                                </div>
                            </div>

                            <div>
                                <FieldLabel>Date of Birth</FieldLabel>
                                <TextInput
                                    type="date"
                                    value={formData.dateOfBirth}
                                    placeholder="yyyy-mm-dd"
                                    max={maxDateOfBirth}
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

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                                    Because you are age 17 or under, the next step will explain the
                                    parent/guardian consent requirement.
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full text-base py-3 justify-center"
                                disabled={isCheckingEmail}
                            >
                                {isCheckingEmail ? "Checking email..." : "Next →"}
                            </Button>
                        </form>

                        <p className="text-center text-nav/70 text-sm mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
