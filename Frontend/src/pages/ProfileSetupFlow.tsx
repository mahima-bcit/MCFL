import { useMemo, useState } from "react";

type TernaryAnswer = "yes" | "no" | "sometimes";
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

type ProfileSetupData = {
  parentAuthorized: boolean;
  parentGuardianName: string;
  parentGuardianEmail: string;
  bankAccount: "Chequing" | "Savings" | "Both" | "";
  earnMoney: TernaryAnswer | "";
  haveSavings: TernaryAnswer | "";
  payBills: TernaryAnswer | "";
  spendOnWants: TernaryAnswer | "";
  beliefs: Record<BeliefKey, BeliefAnswer | "">;
  parentsTaughtMoney: string;
  learningGoals: LearningGoal[];
};

type StepDefinition = {
  title: string;
  subtitle: string;
};

const requiresParentAuthorization = true;

const stepDefinitions: StepDefinition[] = [
  {
    title: "Parent Authorization",
    subtitle: "Required for players age 17 or under",
  },
  {
    title: "Financial stuff",
    subtitle: "Bank account, earning money, savings, bills, and spending basics",
  },
  {
    title: "Money beliefs",
    subtitle: "Agree / disagree to help personalize the experience",
  },
  {
    title: "What did your parents teach you about money?",
    subtitle: "Comment freely here",
  },
  {
    title: "What do you want to learn?",
    subtitle: "Tick as many as you like",
  },
];

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
};

const beliefRows: { key: BeliefKey; label: string }[] = [
  { key: "moneyIsGood", label: "Money is good" },
  { key: "moneyIsBad", label: "Money is bad" },
  { key: "likeHavingMoney", label: "I like having money" },
  { key: "likeDoingThingsForFree", label: "I like doing things for free" },
  { key: "loveSpendingMoney", label: "I love spending money" },
  { key: "parentsGiveMeMoney", label: "My parents give me money" },
  { key: "dontNeedMoney", label: "I don't need money" },
  {
    key: "likeHelpingOthers",
    label: "I like helping others, they don't have to pay me",
  },
];

const learningGoals: LearningGoal[] = [
  "How to get rich",
  "How to take care of my money",
  "How to save money",
  "How to budget",
  "How to invest",
];

const optionBaseClass =
  "rounded-2xl border border-[#d7e6f3] bg-[#f7fbff] px-5 py-3 text-[15px] font-medium text-[#264a74] transition-all duration-200";

function BrandHeader() {
  return (
    <div className="border-b border-[#edf1f6] bg-white/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4d5cff] shadow-[0_8px_20px_rgba(77,92,255,0.18)]">
            <img src="/logo.png" alt="Money Confidence for Life logo" className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#143a73] md:text-[1.7rem]">
            Money Confidence for Life
          </span>
        </a>

        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#516c8f] transition-colors hover:text-[#295cff]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </a>
      </div>
    </div>
  );
}

function ArrowLeftIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function PageTitle({ title, subtitle }: StepDefinition) {
  return (
    <header className="mb-8 md:mb-10">
      <h1 className="text-[1.5rem] font-black leading-[1.06] tracking-[-0.04em] text-[#153c73] md:text-[2.4rem]">
        {title}
      </h1>
      <p className="mt-3 text-base text-[#7c90aa] md:text-lg">{subtitle}</p>
    </header>
  );
}

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-[#edf1f6] bg-white p-5 shadow-[0_12px_32px_rgba(23,42,79,0.06)] md:p-7">
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-3 block text-sm font-semibold text-[#2b466a]">{children}</label>;
}

function TextField({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (nextValue: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-2xl border border-[#dce6ef] bg-[#f7fbff] px-4 py-3.5 text-[15px] text-[#1f3a60] outline-none transition-all duration-200 placeholder:text-[#9aa9bc] focus:border-[#5c7cff] focus:bg-white focus:ring-4 focus:ring-[#5c7cff]/10"
      placeholder={placeholder}
    />
  );
}

function LargeTextarea({
  value,
  placeholder,
  rows = 6,
  onChange,
}: {
  value: string;
  placeholder: string;
  rows?: number;
  onChange: (nextValue: string) => void;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      className="w-full resize-none rounded-2xl border border-[#dce6ef] bg-[#f7fbff] px-4 py-4 text-[15px] leading-7 text-[#1f3a60] outline-none transition-all duration-200 placeholder:text-[#9aa9bc] focus:border-[#5c7cff] focus:bg-white focus:ring-4 focus:ring-[#5c7cff]/10"
      placeholder={placeholder}
    />
  );
}

function TogglePill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${optionBaseClass} ${
        active
          ? "border-[#7e8cff] bg-[#eef1ff] text-[#153c73] shadow-[0_0_15px_rgba(101,116,255,0.4)]"
  : "hover:border-[#bfd2ea] hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function FooterNav({
  showBack,
  nextLabel,
  nextDisabled,
  onBack,
}: {
  showBack: boolean;
  nextLabel: string;
  nextDisabled: boolean;
  onBack: () => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-2 py-2 text-base font-medium text-[#2d4c72] transition-colors hover:text-[#295cff]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
      ) : (
        <span />
      )}

      <button
        type="submit"
        disabled={nextDisabled}
        className={`inline-flex min-w-[220px] items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold transition-all duration-200 ${
          nextDisabled
            ? "bg-[#d8e3ee] text-[#9aa9bc]"
            : "bg-[#d8e3ee] text-[#5b6f87] hover:bg-[#cad8e6]"
        } md:min-w-[320px]`}
      >
        {nextLabel}
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ProfileSetupFlow() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ProfileSetupData>(initialData);

  const visibleSteps = requiresParentAuthorization
    ? stepDefinitions
    : stepDefinitions.filter((_, index) => index !== 0);

  const currentStepDefinition = visibleSteps[step] ?? visibleSteps[0];

  const isCurrentStepValid = useMemo(() => {
    const effectiveStepIndex = requiresParentAuthorization ? step : step + 1;

    switch (effectiveStepIndex) {
      case 0:
        return (
          formData.parentAuthorized &&
          formData.parentGuardianName.trim().length > 0 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentGuardianEmail)
        );
      case 1:
        return Boolean(
          formData.bankAccount &&
            formData.earnMoney &&
            formData.haveSavings &&
            formData.payBills &&
            formData.spendOnWants,
        );
      case 2:
        return beliefRows.every(({ key }) => Boolean(formData.beliefs[key]));
      case 3:
        return formData.parentsTaughtMoney.trim().length >= 10;
      case 4:
        return formData.learningGoals.length > 0;
      default:
        return false;
    }
  }, [formData, step]);

  function updateBelief(key: BeliefKey, value: BeliefAnswer) {
    setFormData((current) => ({
      ...current,
      beliefs: {
        ...current.beliefs,
        [key]: value,
      },
    }));
  }

  function goBack() {
    if (step === 0) {
      window.location.assign("/");
      return;
    }

    setStep((current) => current - 1);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isCurrentStepValid) {
      return;
    }

    if (step === visibleSteps.length - 1) {
      console.log("Profile setup complete", formData);
      setSubmitted(true);
      return;
    }

    setStep((current) => current + 1);
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
            onChange={(event) =>
              setFormData((current) => ({ ...current, parentAuthorized: event.target.checked }))
            }
            className="mt-1 h-4 w-4 rounded border-[#bcc9d8] accent-[#1d2b39]"
          />
          <span className="text-[15px] leading-6 text-[#2b466a]">
            I confirm that a parent or guardian has authorized this player to continue.
          </span>
        </label>

        <div className="mt-6 space-y-5">
          <div>
            <FieldLabel>Parent / guardian name</FieldLabel>
            <TextField
              value={formData.parentGuardianName}
              placeholder="Parent or guardian name"
              onChange={(nextValue) =>
                setFormData((current) => ({ ...current, parentGuardianName: nextValue }))
              }
            />
          </div>
          <div>
            <FieldLabel>Parent / guardian email</FieldLabel>
            <TextField
              value={formData.parentGuardianEmail}
              placeholder="parent@example.com"
              onChange={(nextValue) =>
                setFormData((current) => ({ ...current, parentGuardianEmail: nextValue }))
              }
            />
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
              {(["Chequing", "Savings", "Both"] as const).map((option) => (
                <TogglePill
                  key={option}
                  active={formData.bankAccount === option}
                  onClick={() => setFormData((current) => ({ ...current, bankAccount: option }))}
                >
                  {option}
                </TogglePill>
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
                    onClick={() =>
                      setFormData((current) => ({
                        ...current,
                        [key]: option,
                      }))
                    }
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
                  <TogglePill
                    key={option}
                    active={formData.beliefs[key] === option}
                    onClick={() => updateBelief(key, option)}
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

  function renderParentsTeachMoneyStep() {
    return (
      <StepCard>
        <LargeTextarea
          value={formData.parentsTaughtMoney}
          placeholder="They told me to be careful with money and not spend too quickly."
          rows={7}
          onChange={(nextValue) =>
            setFormData((current) => ({ ...current, parentsTaughtMoney: nextValue }))
          }
        />
      </StepCard>
    );
  }

  function renderLearningGoalsStep() {
    return (
      <StepCard>
        <div className="grid gap-4 md:grid-cols-2">
          {learningGoals.map((goal, index) => {
            const isSelected = formData.learningGoals.includes(goal);
            const shouldSpanTwoColumns = index === 4;

            return (
              <button
                key={goal}
                type="button"
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    learningGoals: isSelected
                      ? current.learningGoals.filter((item) => item !== goal)
                      : [...current.learningGoals, goal],
                  }))
                }
                className={`${optionBaseClass} min-h-[84px] text-left text-[1rem] ${
                  shouldSpanTwoColumns ? "md:col-span-2" : ""
                } ${
                  isSelected
                    ? "border-[#7e8cff] bg-[#eef1ff] text-[#153c73] shadow-[0_0_15px_rgba(101,116,255,0.4)]"
  : "hover:border-[#bfd2ea] hover:bg-white"
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </StepCard>
    );
  }

  function renderCurrentStep() {
    const effectiveStepIndex = requiresParentAuthorization ? step : step + 1;

    switch (effectiveStepIndex) {
      case 0:
        return renderParentAuthorizationStep();
      case 1:
        return renderFinancialStuffStep();
      case 2:
        return renderMoneyBeliefsStep();
      case 3:
        return renderParentsTeachMoneyStep();
      case 4:
        return renderLearningGoalsStep();
      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(90deg,#fbfdff_0%,#fdfefe_48%,#fafcff_100%)]">
      <BrandHeader />

      <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-16">
        {submitted ? (
          <div className="mx-auto max-w-2xl rounded-[32px] border border-[#edf1f6] bg-white p-8 text-center shadow-[0_16px_38px_rgba(23,42,79,0.08)] md:p-12">
            <h1 className="text-[2.4rem] font-black tracking-[-0.04em] text-[#153c73] md:text-[3.6rem]">
              Profile setup complete
            </h1>
            
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-[#d7e6f3] bg-white px-6 py-3.5 font-semibold text-[#2b466a] transition-colors hover:bg-[#f7fbff]"
              >
                Back to home
              </a>
              
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            <PageTitle title={currentStepDefinition.title} subtitle={currentStepDefinition.subtitle} />
            {renderCurrentStep()}
            <FooterNav
              showBack={step > 0}
              nextLabel={step === visibleSteps.length - 1 ? "Complete Registration" : "Next"}
              nextDisabled={!isCurrentStepValid}
              onBack={goBack}
            />
          </form>
        )}
      </div>
    </main>
  );
}