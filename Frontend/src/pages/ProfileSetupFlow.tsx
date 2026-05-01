import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type TernaryAnswer = "yes" | "no" | "sometimes";
type YesNoAnswer = "yes" | "no";
type BeliefAnswer = "agree" | "disagree" | "unsure";
type LearningGoal =
  | "How to get rich"
  | "How to take care of my money"
  | "How to save money"
  | "How to budget"
  | "How to invest";

type BeliefKey =
  | "moneyIsGood"
  | "moneyIsBad"
  | "likeHavingMoney"
  | "likeDoingThingsForFree"
  | "loveSpendingMoney"
  | "parentsGiveMeMoney"
  | "dontNeedMoney"
  | "likeHelpingOthers";

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
  learningGoals: LearningGoal[];
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
  beliefs: {
    moneyIsGood: "",
    moneyIsBad: "",
    likeHavingMoney: "",
    likeDoingThingsForFree: "",
    loveSpendingMoney: "",
    parentsGiveMeMoney: "",
    dontNeedMoney: "",
    likeHelpingOthers: "",
  },
  parentsTaughtMoney: "",
  learningGoals: [],
  learningGoalText: "",
};

const beliefRows: { key: BeliefKey; label: string }[] = [
  { key: "moneyIsGood", label: "Money is good" },
  { key: "moneyIsBad", label: "Money is bad" },
  { key: "likeHavingMoney", label: "I like having money" },
  { key: "likeDoingThingsForFree", label: "I like doing things for free" },
  { key: "loveSpendingMoney", label: "I love spending money" },
  { key: "parentsGiveMeMoney", label: "My parents give me money" },
  { key: "dontNeedMoney", label: "I don't need money" },
  { key: "likeHelpingOthers", label: "I like helping others, they don't have to pay me" },
];

const learningGoals: LearningGoal[] = [
  "How to get rich",
  "How to take care of my money",
  "How to save money",
  "How to budget",
  "How to invest",
];

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
  "rounded-2xl border border-[#d7e6f3] bg-[#f7fbff] px-5 py-3 text-[15px] font-medium text-[#264a74] transition-all duration-200";
const API_BASE_URL = "";

const pageFontClass = "font-sans";
const pageTitleClass =
  "font-sans text-[1.55rem] font-black leading-tight tracking-[-0.04em] text-black md:text-[2rem]";
const subtitleClass = "font-sans mt-2 text-sm text-[#7c90aa] md:text-base";
const fieldLabelClass = "font-sans mb-3 block text-sm font-bold text-black";

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

function PageTitle({ title, subtitle }: Pick<StepDefinition, "title" | "subtitle">) {
  return (
    <header className="mb-7">
      <h1 className={pageTitleClass}>{title}</h1>
      <p className={subtitleClass}>{subtitle}</p>
    </header>
  );
}

function StepCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[28px] border border-[#edf1f6] bg-white p-5 shadow-[0_14px_34px_rgba(23,42,79,0.07)] md:p-7 ${className}`}>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className={fieldLabelClass}>{children}</label>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-2 text-xs font-semibold text-[#c53030]">{message}</p>;
}

function TextField({ value, placeholder, onChange }: { value: string; placeholder: string; onChange: (nextValue: string) => void }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-full rounded-2xl border border-[#dce6ef] bg-[#f7fbff] px-4 text-sm text-[#1f3a60] outline-none transition-all placeholder:text-[#9aa9bc] focus:border-[#6fbf9a] focus:bg-white focus:shadow-[0_0_8px_rgba(111,191,154,0.9)]"
      placeholder={placeholder}
    />
  );
}

function LargeTextarea({ value, placeholder, rows = 6, onChange }: { value: string; placeholder: string; rows?: number; onChange: (nextValue: string) => void }) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      className="w-full resize-none rounded-2xl border border-[#dce6ef] bg-[#f7fbff] px-4 py-4 text-sm leading-7 text-[#1f3a60] outline-none transition-all placeholder:text-[#9aa9bc] focus:border-[#6fbf9a] focus:bg-white focus:shadow-[0_0_8px_rgba(111,191,154,0.9)]"
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
          ? "border-[#6fbf9a] bg-[#eefaf5] text-[#153c73] shadow-[0_0_8px_rgba(111,191,154,0.9)]"
          : "hover:border-[#bfd2ea] hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function FooterNav({ showBack, nextLabel, nextDisabled, onBack }: { showBack: boolean; nextLabel: string; nextDisabled: boolean; onBack: () => void }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      {showBack ? (
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-2 py-2 text-sm font-medium text-[#2d4c72] hover:text-[#295cff]">
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
      ) : (
        <span />
      )}

      <button
        type="submit"
        disabled={nextDisabled}
        className={`inline-flex min-w-[220px] items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-semibold transition-all ${
        nextDisabled
        ? "bg-[#d8e3ee] text-[#9aa9bc]"
         : "bg-[#21A879] text-white shadow-[0_10px_24px_rgba(33,168,121,0.24)] hover:bg-[#1c9169]"
      } md:min-w-[320px]`}
      >
        {nextLabel}
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ProfileSetupFlow() {
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
        return beliefRows.every(({ key }) => Boolean(formData.beliefs[key]));
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

      const response = await fetch(`${API_BASE_URL}/api/account/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        const message = responseBody?.error ?? "Registration failed. Please try again.";
        throw new Error(message);
      }

      const result = responseBody as RegisterResponse;
      localStorage.setItem("mcflAuthToken", result.token);
      localStorage.setItem("mcflUserRole", result.role);
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
      <StepCard>
        <div className="rounded-2xl border border-[#f2e6b5] bg-[#fff8e6] px-4 py-4 text-sm leading-6 text-[#8d6a22]">
          Because you are under 18, a parent or guardian authorization is required before continuing.
        </div>

        <label className="mt-6 flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.parentAuthorized}
            onChange={(event) => {
              setFormData((current) => ({ ...current, parentAuthorized: event.target.checked }));
              setParentAuthorizationErrors((current) => ({ ...current, parentAuthorized: undefined }));
            }}
            className="mt-1 h-4 w-4 rounded border-[#bcc9d8] accent-[#1d2b39]"
          />
          <span className="text-sm leading-6 text-[#2b466a]">
            I confirm that a parent or guardian has authorized this player to continue.
          </span>
        </label>
        <FieldError message={parentAuthorizationErrors.parentAuthorized} />

        <div className="mt-6 space-y-5">
          <div>
            <FieldLabel>Parent / guardian name</FieldLabel>
            <TextField
              value={formData.parentGuardianName}
              placeholder="Parent or guardian name"
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
      <StepCard>
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
      <StepCard>
        <div className="space-y-6">
          {beliefRows.map(({ key, label }) => (
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
      <StepCard>
        <LargeTextarea value={formData.parentsTaughtMoney} placeholder="They told me to be careful with money and not spend too quickly." rows={7} onChange={(nextValue) => setFormData((current) => ({ ...current, parentsTaughtMoney: nextValue }))} />
      </StepCard>
    );
  }

  function renderLearningGoalsStep() {
    return (
      <StepCard>
        <div className="grid gap-4 md:grid-cols-2">
          {learningGoals.map((goal, index) => {
            const isSelected = formData.learningGoals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => setFormData((current) => ({ ...current, learningGoals: isSelected ? current.learningGoals.filter((item) => item !== goal) : [...current.learningGoals, goal] }))}
                className={`${optionBaseClass} min-h-[58px] text-left ${index === 4 ? "md:col-span-2" : ""} ${
                  isSelected ? "border-[#6fbf9a] bg-[#eefaf5] text-[#153c73] shadow-[0_0_8px_rgba(111,191,154,0.9)]" : "hover:border-[#bfd2ea] hover:bg-white"
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>

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
    <section className={`mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-12 ${pageFontClass}`}>
      {submitted ? (
        <div className="mx-auto rounded-[32px] border border-[#edf1f6] bg-white p-8 text-center shadow-[0_16px_38px_rgba(23,42,79,0.08)]">
          <h1 className="font-sans text-[2rem] font-black tracking-[-0.04em] text-black">Registration complete</h1>
          <p className="mt-3 text-sm leading-6 text-[#7c90aa]">
            Your account and profile setup answers were saved successfully.
          </p>
          <Link to="/login" className="mt-7 inline-flex rounded-2xl bg-[#21A879] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(33,168,121,0.24)] hover:bg-[#1c9169]">
            Go to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <PageTitle title={currentStepDefinition.title} subtitle={currentStepDefinition.subtitle} />
          {renderCurrentStep()}
          {submitError && (
            <div className="mt-5 rounded-2xl border border-[#f5c2c7] bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-[#b42318]">
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