import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

type AccountType = "youth" | "parent";

type FormData = {
  accountType: AccountType;
  fullName: string;
  nickname: string;
  age: string;
  email: string;
  parentEmail: string;
  password: string;
  confirmPassword: string;
  parentName: string;
  parentConsent: boolean;
  selectedFinancialItems: string[];
  selectedBeliefs: Record<string, string>;
  parentMoneyLesson: string;
  learningGoals: string[];
};

const financialQuestions = [
  {
    question: "Do you have any income?",
    options: ["Checking", "Saving", "Both"],
  },
  {
    question: "Do you save money?",
    options: ["yes", "no", "sometimes"],
  },
  {
    question: "Do you have savings?",
    options: ["yes", "no", "sometimes"],
  },
  {
    question: "Do you pay bills?",
    options: ["yes", "no", "sometimes"],
  },
  {
    question: "Do you spend on things you like?",
    options: ["yes", "no", "sometimes"],
  },
];

const moneyBeliefQuestions = [
  "Money is good",
  "Money is bad",
  "I like having money",
  "I like saving things for me",
  "I fear spending money",
  "My parents give me money",
  "I don't need money",
  "I like buying others, they don't have to pay me",
];

const learningOptions = [
  "How to spend",
  "How to save my money",
  "How to earn money",
  "How to budget",
  "Investment",
];

export default function Signup() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    accountType: "youth",
    fullName: "",
    nickname: "",
    age: "",
    email: "",
    parentEmail: "",
    password: "",
    confirmPassword: "",
    parentName: "",
    parentConsent: false,
    selectedFinancialItems: [],
    selectedBeliefs: {},
    parentMoneyLesson: "",
    learningGoals: [],
  });

  const numericAge = Number(formData.age);
  const needsParentEmail =
    formData.accountType === "youth" &&
    formData.age !== "" &&
    numericAge <= 17;

  const totalSteps = needsParentEmail ? 6 : 5;

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleFinancialItem = (value: string) => {
    setFormData((prev) => {
      const exists = prev.selectedFinancialItems.includes(value);

      return {
        ...prev,
        selectedFinancialItems: exists
          ? prev.selectedFinancialItems.filter((item) => item !== value)
          : [...prev.selectedFinancialItems, value],
      };
    });
  };

  const selectBeliefAnswer = (question: string, answer: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedBeliefs: {
        ...prev.selectedBeliefs,
        [question]: answer,
      },
    }));
  };

  const toggleLearningGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.learningGoals.includes(goal);

      return {
        ...prev,
        learningGoals: exists
          ? prev.learningGoals.filter((item) => item !== goal)
          : [...prev.learningGoals, goal],
      };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Registration flow data:", formData);
  };

  const currentProgress = Math.round((step / totalSteps) * 100);

  return (
    <main className="min-h-screen bg-mint px-4 py-6 sm:px-6 sm:py-8">
      <section className="mx-auto w-full max-w-3xl">
        <div className="mb-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-bold text-primary">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
              💙
            </span>
            Money Confidence for Life
          </Link>

          {step > 1 && (
            <button
              type="button"
              onClick={previousStep}
              className="text-xs font-semibold text-nav/60 hover:text-nav"
            >
              ← Back
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-primary/10 bg-white p-5 shadow-lg sm:p-8 md:p-10"
        >
          {step === 1 && (
            <>
              <div className="mb-7 text-center">
                <h2 className="font-display text-3xl font-bold text-nav sm:text-4xl">
                  Sign up
                </h2>
                <p className="mt-2 text-sm text-nav/60 sm:text-base">
                  Fill in your details to create your profile.
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl bg-mint p-2">
                <button
                  type="button"
                  onClick={() => updateField("accountType", "youth")}
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                    formData.accountType === "youth"
                      ? "bg-white text-primary-dark shadow-sm"
                      : "text-nav/60 hover:text-nav"
                  }`}
                >
                  Youth account
                </button>

                <button
                  type="button"
                  onClick={() => updateField("accountType", "parent")}
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                    formData.accountType === "parent"
                      ? "bg-white text-primary-dark shadow-sm"
                      : "text-nav/60 hover:text-nav"
                  }`}
                >
                  Parent account
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-nav">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Ashley Smith"
                      required
                      className="w-full rounded-xl border-2 border-nav/15 px-4 py-3 text-nav outline-none transition placeholder:text-nav/35 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-nav">
                      Nickname
                    </label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => updateField("nickname", e.target.value)}
                      placeholder="Ashley"
                      required
                      className="w-full rounded-xl border-2 border-nav/15 px-4 py-3 text-nav outline-none transition placeholder:text-nav/35 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-[0.45fr_1fr]">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-nav">
                      Age
                    </label>
                    <input
                      type="number"
                      min="13"
                      max="99"
                      value={formData.age}
                      onChange={(e) => updateField("age", e.target.value)}
                      placeholder="16"
                      required
                      className="w-full rounded-xl border-2 border-nav/15 px-4 py-3 text-nav outline-none transition placeholder:text-nav/35 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-nav">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-xl border-2 border-nav/15 px-4 py-3 text-nav outline-none transition placeholder:text-nav/35 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-nav">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Create password"
                      required
                      className="w-full rounded-xl border-2 border-nav/15 px-4 py-3 text-nav outline-none transition placeholder:text-nav/35 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-nav">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      placeholder="Repeat password"
                      required
                      className="w-full rounded-xl border-2 border-nav/15 px-4 py-3 text-nav outline-none transition placeholder:text-nav/35 focus:border-primary"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-mint p-4">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 cursor-pointer accent-primary"
                  />
                  <span className="text-sm leading-relaxed text-nav/70">
                    I agree to use this app respectfully and understand this is
                    a learning tool, not financial advice.
                  </span>
                </label>
              </div>
            </>
          )}

          {step === 2 && needsParentEmail && (
            <QuestionPageHeader
              title="Parent authorization"
              subtitle="Required for users age 17 or under"
            >
              <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4">
                <label className="mb-2 block text-sm font-semibold text-nav">
                  Parent / guardian name
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => updateField("parentName", e.target.value)}
                  placeholder="Parent or guardian name"
                  className="mb-4 w-full rounded-xl border-2 border-gold/30 bg-white px-4 py-3 text-nav outline-none transition placeholder:text-nav/35 focus:border-primary"
                />

                <label className="mb-2 block text-sm font-semibold text-nav">
                  Parent / guardian email
                </label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => updateField("parentEmail", e.target.value)}
                  placeholder="parent@email.com"
                  className="w-full rounded-xl border-2 border-gold/30 bg-white px-4 py-3 text-nav outline-none transition placeholder:text-nav/35 focus:border-primary"
                />

                <label className="mt-4 flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.parentConsent}
                    onChange={(e) =>
                      updateField("parentConsent", e.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <span className="text-sm leading-relaxed text-nav/70">
                    I confirm this parent or guardian should receive the account
                    authorization request.
                  </span>
                </label>
              </div>
            </QuestionPageHeader>
          )}

          {step === (needsParentEmail ? 3 : 2) && (
            <QuestionPageHeader
              title="Financial stuff"
              subtitle="Let us understand saving, spending, bills, and spending habits."
            >
              <div className="mx-auto max-w-md rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                <div className="space-y-5">
                  {financialQuestions.map((item) => (
                    <div key={item.question}>
                      <p className="mb-2 text-sm font-bold text-nav">
                        {item.question}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.options.map((option) => {
                          const value = `${item.question}-${option}`;
                          const selected =
                            formData.selectedFinancialItems.includes(value);

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleFinancialItem(value)}
                              className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                                selected
                                  ? "border-primary bg-primary text-white"
                                  : "border-primary/10 bg-mint text-nav/70 hover:border-primary"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </QuestionPageHeader>
          )}

          {step === (needsParentEmail ? 4 : 3) && (
            <QuestionPageHeader
              title="Money beliefs"
              subtitle="Agree / disagree to help personalize the experience."
            >
              <div className="mx-auto max-w-md rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                <div className="space-y-4">
                  {moneyBeliefQuestions.map((question) => (
                    <div key={question}>
                      <p className="mb-2 text-sm font-bold text-nav">
                        {question}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {["agree", "disagree", "unsure"].map((answer) => {
                          const selected =
                            formData.selectedBeliefs[question] === answer;

                          return (
                            <button
                              key={answer}
                              type="button"
                              onClick={() =>
                                selectBeliefAnswer(question, answer)
                              }
                              className={`rounded-full border px-4 py-2 text-xs font-bold capitalize transition ${
                                selected
                                  ? "border-primary bg-primary text-white"
                                  : "border-primary/10 bg-mint text-nav/70 hover:border-primary"
                              }`}
                            >
                              {answer}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </QuestionPageHeader>
          )}

          {step === (needsParentEmail ? 5 : 4) && (
            <QuestionPageHeader
              title="What did your parents teach you about money?"
              subtitle="Common money lessons"
            >
              <div className="mx-auto max-w-lg rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                <textarea
                  value={formData.parentMoneyLesson}
                  onChange={(e) =>
                    updateField("parentMoneyLesson", e.target.value)
                  }
                  placeholder="They told me to be careful with money and not spend too quickly..."
                  className="min-h-36 w-full resize-none rounded-xl border-2 border-nav/10 bg-white px-4 py-3 text-sm text-nav outline-none transition placeholder:text-nav/35 focus:border-primary"
                />
              </div>
            </QuestionPageHeader>
          )}

          {step === (needsParentEmail ? 6 : 5) && (
            <QuestionPageHeader
              title="What do you want to learn?"
              subtitle="Tell us what you are here for."
            >
              <div className="mx-auto max-w-lg rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {learningOptions.map((goal) => {
                    const selected = formData.learningGoals.includes(goal);

                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleLearningGoal(goal)}
                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-primary/10 bg-mint text-nav/70 hover:border-primary"
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </div>
            </QuestionPageHeader>
          )}

          <div className="mt-8">
            <div className="mb-4 flex items-center gap-3">
              <button
                type="button"
                onClick={previousStep}
                disabled={step === 1}
                className="text-xs font-bold text-nav/60 disabled:opacity-30"
              >
                ← Back
              </button>

              <div className="h-3 flex-1 overflow-hidden rounded-full bg-nav/10">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>

              <span className="text-xs font-bold text-primary">
                {currentProgress}%
              </span>
            </div>

            {step < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                className="w-full justify-center py-4 text-base"
              >
                Next →
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-4 text-base"
              >
                Complete registration
              </Button>
            )}
          </div>

          {step === 1 && (
            <p className="mt-6 text-center text-sm text-nav/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary transition hover:text-primary-dark"
              >
                Log in
              </Link>
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

function QuestionPageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-7">
        <h2 className="font-display text-2xl font-bold leading-tight text-nav sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-nav/60">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}