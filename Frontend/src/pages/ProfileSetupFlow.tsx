import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../services/apiClient";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

type TernaryAnswer = "yes" | "no" | "sometimes";
type YesNoAnswer = "yes" | "no";
type BeliefAnswer = "agree" | "disagree" | "unsure";

type BeliefKey = string;

type RegistrationDraft = {
  fullName?: string;
  nickname?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
  age?: number | null;
  requiresParentConsent?: boolean;
};

type ProfileSetupData = {
  parentAuthorized: boolean;
  parentGuardianName: string;
  parentGuardianEmail: string;
  bankAccount: YesNoAnswer | "";
  earnMoney: TernaryAnswer | "";
  haveSavings: TernaryAnswer | "";
  payBills: TernaryAnswer | "";
  spendOnWants: TernaryAnswer | "";
  beliefs: Record<BeliefKey, BeliefAnswer | "">;
  parentsTaughtMoney: string;
  learningGoals: string[];
  learningGoalText: string;
};

type ParentAuthorizationErrors = {
  parentAuthorized?: string;
  parentGuardianName?: string;
  parentGuardianEmail?: string;
};

type StepDefinition = {
  key: "parent-auth" | "financial" | "beliefs" | "parents-taught" | "learning-goals";
  title: string;
  subtitle: string;
};

const initialData: ProfileSetupData = {
  parentAuthorized: false,
  parentGuardianName: "",
  parentGuardianEmail: "",
  bankAccount: "",
  earnMoney: "",
  haveSavings: "",
  payBills: "",
  spendOnWants: "",
  beliefs: {},
  parentsTaughtMoney: "",
  learningGoals: [],
  learningGoalText: "",
};



const parentSteps: StepDefinition[] = [
  {
    key: "parent-auth",
    title: "Parent authorization",
    subtitle: "Required for players age 17 or under",
  },
];

const setupSteps: StepDefinition[] = [
  {
    key: "financial",
    title: "Financial stuff",
    subtitle: "Bank account, earning money, savings, bills, and spending basics",
  },
  {
    key: "beliefs",
    title: "Money beliefs",
    subtitle: "Agree / disagree to help personalize the experience",
  },
  {
    key: "parents-taught",
    title: "What did your parents teach you about money?",
    subtitle: "Comment freely here",
  },
  {
    key: "learning-goals",
    title: "What do you want to learn?",
    subtitle: "Tick as many as you like",
  },
];

const optionBaseClass =
  "rounded-2xl border px-5 py-3 text-[15px] font-medium transition-all duration-200";

const pageFontClass = "font-sans";
const pageTitleClass =
  "font-display text-[1.55rem] font-bold leading-tight text-nav md:text-[2rem]";
const subtitleClass = "mt-2 text-sm text-nav/60 md:text-base";
const fieldLabelClass = "mb-1.5 block text-sm font-semibold text-nav";

type RegisterResponse = {
  token: string;
  role: string;
};

function readRegistrationDraft(): RegistrationDraft | null {
  try {
    const rawDraft = localStorage.getItem("mcflRegistrationDraft");
    return rawDraft ? JSON.parse(rawDraft) : null;
  } catch {
    return null;
  }
}

function ArrowLeftIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}


function StepCard({ title, subtitle, children, className = "" }: { title?: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-nav/10 bg-white shadow-lg ${className}`}>
      {title && (
        <div className="border-b border-nav/10 px-6 py-5 md:px-8">
          <h2 className={pageTitleClass}>{title}</h2>
          {subtitle && <p className={subtitleClass}>{subtitle}</p>}
        </div>
      )}
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className={fieldLabelClass}>{children}</label>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
      {message}
    </p>
  );
}

function TextField({ value, placeholder, onChange }: { value: string; placeholder: string; onChange: (nextValue: string) => void }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full px-4 py-3 rounded-lg border-2 border-nav/20 text-nav placeholder-nav/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-colors"
      placeholder={placeholder}
    />
  );
}

function LargeTextarea({ value, placeholder, rows = 6, maxLength, onChange }: { value: string; placeholder: string; rows?: number; maxLength?: number; onChange: (nextValue: string) => void }) {
  return (
    <textarea
      value={value}
      rows={rows}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
      className="w-full resize-none rounded-lg border-2 border-nav/20 px-4 py-3 text-sm leading-7 text-nav outline-none transition-colors placeholder:text-nav/40 focus:border-primary focus:ring-4 focus:ring-primary/15"
      placeholder={placeholder}
    />
  );
}

function TogglePill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${optionBaseClass} ${
        active
          ? "border-primary bg-primary text-white shadow-md"
          : "border-nav/20 bg-white text-nav hover:border-nav/30 hover:bg-nav/5"
      }`}
    >
      {children}
    </button>
  );
}

function FooterNav({ showBack, nextLabel, nextDisabled, onBack }: { showBack: boolean; nextLabel: string; nextDisabled: boolean; onBack: () => void }) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-nav/20 px-6 py-2.5 text-sm font-medium text-nav/70 transition-all hover:border-nav/40 hover:text-nav sm:w-auto"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
      ) : (
        <span className="hidden sm:block" />
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={nextDisabled}
        className="w-full justify-center sm:w-auto sm:min-w-64"
      >
        {nextLabel}
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function ProfileSetupFlow() {
  const { login } = useAuth();
  const registrationDraft = useMemo(() => readRegistrationDraft(), []);
  const requiresParentAuthorization = registrationDraft?.requiresParentConsent ?? false;
  const visibleSteps = useMemo(
    () => (requiresParentAuthorization ? [...parentSteps, ...setupSteps] : setupSteps),
    [requiresParentAuthorization],
  );

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState<ProfileSetupData>(initialData);
  const [parentAuthorizationErrors, setParentAuthorizationErrors] = useState<ParentAuthorizationErrors>({});
  const [availableGoals, setAvailableGoals] = useState<string[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [beliefDefinitions, setBeliefDefinitions] = useState<{ key: string; label: string }[]>([]);

  useEffect(() => {
    apiFetch<{ learningTopicId: number; topicName: string }[]>("/account/learning-topics")
      .then((data) => setAvailableGoals(data.map((t) => t.topicName)))
      .catch(() => setAvailableGoals([]))
      .finally(() => setGoalsLoading(false));
  }, []);

  useEffect(() => {
    apiFetch<{ key: string; label: string }[]>("/account/belief-definitions")
      .then((defs) => {
        setBeliefDefinitions(defs);
        setFormData((current) => {
          const updatedBeliefs = { ...current.beliefs };
          for (const { key } of defs) {
            if (!(key in updatedBeliefs)) updatedBeliefs[key] = "";
          }
          return { ...current, beliefs: updatedBeliefs };
        });
      })
      .catch(console.error);
  }, []);

  const currentStepDefinition = visibleSteps[step] ?? visibleSteps[0];

  const isCurrentStepValid = useMemo(() => {
    switch (currentStepDefinition.key) {
      case "parent-auth":
        return (
          formData.parentAuthorized &&
          formData.parentGuardianName.trim().length > 0 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentGuardianEmail)
        );
      case "financial":
        return Boolean(formData.bankAccount && formData.earnMoney && formData.haveSavings && formData.payBills && formData.spendOnWants);
      case "beliefs":
        return beliefDefinitions.length > 0 &&
          beliefDefinitions.every(({ key }) => Boolean(formData.beliefs[key]));
      case "parents-taught":
        return formData.parentsTaughtMoney.trim().length >= 10;
      case "learning-goals":
        return formData.learningGoals.length > 0 || formData.learningGoalText.trim().length > 0;
      default:
        return false;
    }
  }, [currentStepDefinition.key, formData]);

  function validateParentAuthorizationStep() {
    const errors: ParentAuthorizationErrors = {};

    if (!formData.parentAuthorized) {
      errors.parentAuthorized =
        "You must confirm that a parent or guardian has authorized this player to continue.";
    }

    if (formData.parentGuardianName.trim().length === 0) {
      errors.parentGuardianName = "Parent or guardian name is required.";
    }

    if (formData.parentGuardianEmail.trim().length === 0) {
      errors.parentGuardianEmail = "Parent or guardian email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentGuardianEmail)) {
      errors.parentGuardianEmail = "Please enter a valid parent or guardian email address.";
    }

    return errors;
  }

  function updateBelief(key: BeliefKey, value: BeliefAnswer) {
    setFormData((current) => ({ ...current, beliefs: { ...current.beliefs, [key]: value } }));
  }

  function goBack() {
    if (step === 0) {
      window.location.assign("/signup");
      return;
    }
    setStep((current) => current - 1);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    if (isSubmitting) return;

    if (currentStepDefinition.key === "parent-auth") {
      const errors = validateParentAuthorizationStep();
      setParentAuthorizationErrors(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }
    } else if (!isCurrentStepValid) {
      return;
    }

    if (step !== visibleSteps.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    if (!registrationDraft?.email || !registrationDraft.fullName || !registrationDraft.dateOfBirth) {
      setSubmitError("Signup information is missing. Please go back and complete signup again.");
      return;
    }

    const password = (registrationDraft as RegistrationDraft & { password?: string }).password;

    if (!password) {
      setSubmitError("Password is missing. Please go back and complete signup again.");
      return;
    }

    const payload = {
      email: registrationDraft.email,
      password,
      fullName: registrationDraft.fullName,
      nickname: registrationDraft.nickname,
      dateOfBirth: registrationDraft.dateOfBirth,
      requiresParentConsent: requiresParentAuthorization,
      parentAuthorization: requiresParentAuthorization
        ? {
            authorized: formData.parentAuthorized,
            parentGuardianName: formData.parentGuardianName,
            parentGuardianEmail: formData.parentGuardianEmail,
          }
        : null,
      profileSetup: {
        bankAccount: formData.bankAccount,
        earnMoney: formData.earnMoney,
        haveSavings: formData.haveSavings,
        payBills: formData.payBills,
        spendOnWants: formData.spendOnWants,
        beliefs: formData.beliefs,
        parentsTaughtMoney: formData.parentsTaughtMoney,
        learningGoals: formData.learningGoals,
        learningGoalText: formData.learningGoalText,
      },
    };

    try {
      setIsSubmitting(true);

      const result = await apiFetch<RegisterResponse>("/account/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      login(result.token, result.role, true);
      localStorage.removeItem("mcflRegistrationDraft");
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderParentAuthorizationStep() {
    return (
      <StepCard title="Parent authorization" subtitle="Required for players age 17 or under">
        {/* Notice banner */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-sm leading-6 text-amber-800">
            Because you are under 18, a parent or guardian authorization is required before continuing.
          </p>
        </div>

        {/* Consent checkbox */}
        <label className={`mt-5 flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
          formData.parentAuthorized ? "border-primary bg-primary/5" : "border-nav/15 bg-nav/2 hover:border-nav/25"
        }`}>
          <input
            type="checkbox"
            checked={formData.parentAuthorized}
            onChange={(event) => {
              setFormData((current) => ({ ...current, parentAuthorized: event.target.checked }));
              setParentAuthorizationErrors((current) => ({ ...current, parentAuthorized: undefined }));
            }}
            className="mt-0.5 h-4 w-4 rounded border-nav/30 accent-primary"
          />
          <span className="text-sm font-medium leading-6 text-nav">
            I confirm that a parent or guardian has authorized this player to continue.
          </span>
        </label>
        <FieldError message={parentAuthorizationErrors.parentAuthorized} />

        {/* Parent details */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel>Parent / guardian name</FieldLabel>
            <TextField
              value={formData.parentGuardianName}
              placeholder="Full name"
              onChange={(nextValue) => {
                setFormData((current) => ({ ...current, parentGuardianName: nextValue }));
                setParentAuthorizationErrors((current) => ({ ...current, parentGuardianName: undefined }));
              }}
            />
            <FieldError message={parentAuthorizationErrors.parentGuardianName} />
          </div>

          <div>
            <FieldLabel>Parent / guardian email</FieldLabel>
            <TextField
              value={formData.parentGuardianEmail}
              placeholder="parent@example.com"
              onChange={(nextValue) => {
                setFormData((current) => ({ ...current, parentGuardianEmail: nextValue }));
                setParentAuthorizationErrors((current) => ({ ...current, parentGuardianEmail: undefined }));
              }}
            />
            <FieldError message={parentAuthorizationErrors.parentGuardianEmail} />
          </div>
        </div>
      </StepCard>
    );
  }

  function renderFinancialStuffStep() {
    return (
      <StepCard title="Financial stuff" subtitle="Bank account, earning money, savings, bills, and spending basics">
        <div className="space-y-7">
          <div>
            <FieldLabel>Do you have a bank account?</FieldLabel>
            <div className="flex flex-wrap gap-3">
              {(["yes", "no"] as const).map((option) => (
                <TogglePill key={option} active={formData.bankAccount === option} onClick={() => setFormData((current) => ({ ...current, bankAccount: option }))}>{option}</TogglePill>
              ))}
            </div>
          </div>

          {[
            ["Do you earn money?", "earnMoney"],
            ["Do you have savings?", "haveSavings"],
            ["Do you pay bills?", "payBills"],
            ["Do you spend on things you want?", "spendOnWants"],
          ].map(([label, key]) => (
            <div key={key}>
              <FieldLabel>{label}</FieldLabel>
              <div className="flex flex-wrap gap-3">
                {(["yes", "no", "sometimes"] as const).map((option) => (
                  <TogglePill
                    key={option}
                    active={formData[key as keyof ProfileSetupData] === option}
                    onClick={() => setFormData((current) => ({ ...current, [key]: option }))}
                  >
                    {option}
                  </TogglePill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StepCard>
    );
  }

  function renderMoneyBeliefsStep() {
    return (
      <StepCard title="Money beliefs" subtitle="Agree / disagree to help personalize the experience">
        <div className="space-y-6">
          {beliefDefinitions.map(({ key, label }) => (
            <div key={key}>
              <FieldLabel>{label}</FieldLabel>
              <div className="flex flex-wrap gap-3">
                {(["agree", "disagree", "unsure"] as const).map((option) => (
                  <TogglePill key={option} active={formData.beliefs[key] === option} onClick={() => updateBelief(key, option)}>{option}</TogglePill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StepCard>
    );
  }

  function renderParentsTeachMoneyStep() {
    return (
      <StepCard title="What did your parents teach you about money?" subtitle="Comment freely here">
        <div className="relative">
          <LargeTextarea value={formData.parentsTaughtMoney} placeholder="They told me to be careful with money and not spend too quickly." rows={7} maxLength={1000} onChange={(nextValue) => setFormData((current) => ({ ...current, parentsTaughtMoney: nextValue }))} />
          <span className={`absolute bottom-3 right-4 text-xs tabular-nums ${
            formData.parentsTaughtMoney.trim().length < 10 && formData.parentsTaughtMoney.length > 0
              ? "text-red-400"
              : formData.parentsTaughtMoney.length >= 900
              ? "text-amber-500"
              : "text-nav/40"
          }`}>
            {formData.parentsTaughtMoney.length} / 1000
          </span>
        </div>
      </StepCard>
    );
  }

  function renderLearningGoalsStep() {
    return (
      <StepCard title="What do you want to learn?" subtitle="Tick as many as you like">
        {goalsLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-h-14 animate-pulse rounded-2xl bg-nav/10" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {availableGoals.map((goal, index) => {
              const isSelected = formData.learningGoals.includes(goal);
              const isLastOdd = availableGoals.length % 2 !== 0 && index === availableGoals.length - 1;
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setFormData((current) => ({ ...current, learningGoals: isSelected ? current.learningGoals.filter((item) => item !== goal) : [...current.learningGoals, goal] }))}
                  className={`${optionBaseClass} min-h-14 text-left ${isLastOdd ? "md:col-span-2" : ""} ${
                    isSelected ? "border-primary bg-primary text-white shadow-md" : "border-nav/20 bg-white text-nav hover:border-nav/30 hover:bg-nav/5"
                  }`}
                >
                  {goal}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6">
          <FieldLabel>Tell us what you want to learn?</FieldLabel>
          <TextField
            value={formData.learningGoalText}
            placeholder="Write your idea here"
            onChange={(nextValue) =>
              setFormData((current) => ({
                ...current,
                learningGoalText: nextValue,
              }))
            }
          />
        </div>
      </StepCard>
    );
  }

  function renderCurrentStep() {
    switch (currentStepDefinition.key) {
      case "parent-auth":
        return renderParentAuthorizationStep();
      case "financial":
        return renderFinancialStuffStep();
      case "beliefs":
        return renderMoneyBeliefsStep();
      case "parents-taught":
        return renderParentsTeachMoneyStep();
      case "learning-goals":
        return renderLearningGoalsStep();
      default:
        return null;
    }
  }

  return (
    <section className={`mx-auto max-w-3xl px-4 py-6 sm:px-5 sm:py-10 md:px-8 md:py-12 ${pageFontClass}`}>
      {submitted ? (
        <div className="mx-auto rounded-2xl border border-nav/10 bg-white p-8 text-center shadow-lg">
          <h1 className="font-display text-[2rem] font-bold text-nav">Registration complete</h1>
          <p className="mt-3 text-sm leading-6 text-nav/60">
            Your account and profile setup answers were saved successfully.
          </p>
          <Link to="/login" className="mt-7 inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-medium text-white transition-all hover:bg-gold hover:shadow-md">
            Go to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {renderCurrentStep()}
          {submitError && (
            <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {submitError}
            </div>
          )}
          <FooterNav
            showBack={true}
            nextLabel={step === visibleSteps.length - 1 ? (isSubmitting ? "Creating account..." : "Complete Registration") : "Next"}
            nextDisabled={
              currentStepDefinition.key === "parent-auth"
                ? isSubmitting
                : !isCurrentStepValid || isSubmitting
            }
            onBack={goBack}
          />
        </form>
      )}
    </section>
  );
}