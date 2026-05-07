import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/apiClient";
import { resolveParentFeedbackToken } from "../services/parentFeedbackApi";

interface FormData {
  email: string;
  parentName: string;
  moneyStory: string;
  hopesForLearning: string;
}

interface FormErrors {
  email?: string;
  parentName?: string;
  moneyStory?: string;
  hopesForLearning?: string;
}

const ParentsFeedback: React.FC = () => {
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [childName, setChildName] = useState("");
  const [tokenError, setTokenError] = useState(!token);
  const [isLoadingToken, setIsLoadingToken] = useState(!!token);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    parentName: "",
    moneyStory: "",
    hopesForLearning: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    resolveParentFeedbackToken(token)
      .then((info) => {
        setChildName(info.childName);
        setIsLoadingToken(false);
      })
      .catch(() => {
        setTokenError(true);
        setIsLoadingToken(false);
      });
  }, [token]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent's name is required.";
    }

    if (!formData.moneyStory.trim()) {
      newErrors.moneyStory = "Please share a money story.";
    } else if (formData.moneyStory.trim().length < 20) {
      newErrors.moneyStory = "Please share a bit more detail (at least 20 characters).";
    }

    if (!formData.hopesForLearning.trim()) {
      newErrors.hopesForLearning = "Please share your hopes for their learning.";
    } else if (formData.hopesForLearning.trim().length < 20) {
      newErrors.hopesForLearning = "Please elaborate a bit more (at least 20 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await apiFetch("/ParentFeedback", {
        method: "POST",
        body: JSON.stringify({
          parentEmail: formData.email,
          parentName: formData.parentName,
          moneyStory: formData.moneyStory,
          whatChildShouldLearn: formData.hopesForLearning,
          token,
        }),
      });
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoadingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mint px-4">
        <div className="flex flex-col items-center gap-4 text-nav">
          <svg
            className="animate-spin w-10 h-10 text-primary"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="font-body text-gray-500">Loading feedback form…</p>
        </div>
      </div>
    );
  }

  // ── Invalid / expired token ────────────────────────────────────────────────
  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mint px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-error"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-nav mb-3">
            Invalid or Expired Link
          </h2>
          <p className="text-gray-600 font-body leading-relaxed">
            This feedback link is invalid or has expired. Please ask your child
            to share a new link from their dashboard.
          </p>
        </div>
      </div>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mint px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 text-center animate-fade-up">
          <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l4.5 4.5 10.5-10.5"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-nav mb-3">
            Thank You for Your Feedback
          </h2>
          <p className="text-gray-600 font-body leading-relaxed">
            Your insights will help us build a stronger money learning journey
            for {childName}. We truly appreciate you taking the time to share.
          </p>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-mint py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary leading-tight">
            Parent Feedback
          </h1>
          <p className="mt-4 text-gray-600 font-body text-lg max-w-xl mx-auto">
            Help us understand{" "}
            <span className="font-semibold text-nav">{childName}'s</span> money
            learning journey
          </p>
        </div>

        {/* Why we're asking */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8 animate-fade-up [animation-delay:150ms]">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 21a9 9 0 100-18 9 9 0 000 18zm0-4.5h.008v.008H12V16.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-nav mb-2">
                Why we're asking
              </h3>
              <p className="text-gray-600 font-body leading-relaxed">
                Your perspective as a parent is invaluable. We want to
                understand the money lessons and values you're already sharing
                with {childName}, so we can build on that foundation and support
                their learning journey.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-7 animate-fade-up [animation-delay:300ms]"
          noValidate
        >
          {/* Email */}
          <fieldset>
            <legend className="text-sm font-mono tracking-wide uppercase text-nav/70 mb-1.5">
              Your Contact Information
            </legend>
            <label
              htmlFor="email"
              className="block text-sm font-body font-medium text-nav mb-1.5"
            >
              Your Email <span className="text-error">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 rounded-xl border font-body text-nav placeholder:text-gray-400 bg-gray-50/50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                errors.email ? "border-error ring-2 ring-error/20" : "border-gray-200"
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-error font-body flex items-center gap-1.5">
                <ErrorIcon />
                {errors.email}
              </p>
            )}
          </fieldset>

          {/* Parent Name + Child Name (read-only) */}
          <fieldset>
            <legend className="text-sm font-mono tracking-wide uppercase text-nav/70 mb-1.5">
              About You &amp; Your Child
            </legend>

            <label
              htmlFor="parentName"
              className="block text-sm font-body font-medium text-nav mb-1.5"
            >
              Your Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Jordan Smith"
              className={`w-full px-4 py-3 rounded-xl border font-body text-nav placeholder:text-gray-400 bg-gray-50/50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                errors.parentName
                  ? "border-error ring-2 ring-error/20"
                  : "border-gray-200"
              }`}
            />
            {errors.parentName && (
              <p className="mt-1.5 text-sm text-error font-body flex items-center gap-1.5">
                <ErrorIcon />
                {errors.parentName}
              </p>
            )}

            {/* Child name — auto-filled, read-only */}
            <label
              htmlFor="childName"
              className="block text-sm font-body font-medium text-nav mb-1.5 mt-4"
            >
              Child's Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="childName"
                name="childName"
                value={childName}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-nav bg-gray-100 cursor-not-allowed select-none pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400 font-body">
              Filled automatically from the shared link
            </p>
          </fieldset>

          {/* Money Story */}
          <fieldset>
            <legend className="text-sm font-mono tracking-wide uppercase text-nav/70 mb-1.5">
              Share a Money Story
            </legend>
            <label
              htmlFor="moneyStory"
              className="block text-sm font-body font-medium text-nav mb-1.5"
            >
              Tell us about a money lesson you learned (or wish you had learned){" "}
              <span className="text-error">*</span>
            </label>
            <textarea
              id="moneyStory"
              name="moneyStory"
              rows={4}
              value={formData.moneyStory}
              onChange={handleChange}
              placeholder="For example: I remember when I got my first paycheck and spent it all in one weekend. I wish someone had taught me about saving a portion first..."
              className={`w-full px-4 py-3 rounded-xl border font-body text-nav placeholder:text-gray-400 bg-gray-50/50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y min-h-30 ${
                errors.moneyStory
                  ? "border-error ring-2 ring-error/20"
                  : "border-gray-200"
              }`}
            />
            <div className="flex justify-between items-center mt-1.5">
              {errors.moneyStory ? (
                <p className="text-sm text-error font-body flex items-center gap-1.5">
                  <ErrorIcon />
                  {errors.moneyStory}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400 font-mono">
                {formData.moneyStory.length} characters
              </span>
            </div>
          </fieldset>

          {/* Hopes for Learning */}
          <fieldset>
            <legend className="text-sm font-mono tracking-wide uppercase text-nav/70 mb-1.5">
              Your Hopes for Their Learning
            </legend>
            <label
              htmlFor="hopesForLearning"
              className="block text-sm font-body font-medium text-nav mb-1.5"
            >
              What do you most want {childName} to learn about money?{" "}
              <span className="text-error">*</span>
            </label>
            <textarea
              id="hopesForLearning"
              name="hopesForLearning"
              rows={4}
              value={formData.hopesForLearning}
              onChange={handleChange}
              placeholder="For example: I want them to understand that money is a tool, not a measure of worth. I want them to feel confident making financial decisions without fear..."
              className={`w-full px-4 py-3 rounded-xl border font-body text-nav placeholder:text-gray-400 bg-gray-50/50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y min-h-30 ${
                errors.hopesForLearning
                  ? "border-error ring-2 ring-error/20"
                  : "border-gray-200"
              }`}
            />
            <div className="flex justify-between items-center mt-1.5">
              {errors.hopesForLearning ? (
                <p className="text-sm text-error font-body flex items-center gap-1.5">
                  <ErrorIcon />
                  {errors.hopesForLearning}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400 font-mono">
                {formData.hopesForLearning.length} characters
              </span>
            </div>
          </fieldset>

          {/* Submit */}
          <div className="pt-2">
            {submitError && (
              <p className="mb-4 text-sm text-error font-body flex items-center gap-1.5">
                <ErrorIcon />
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark active:bg-primary-dark text-white font-body font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2.5"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  Submit Feedback
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400 font-body mt-6 animate-fade-in [animation-delay:600ms]">
          Your responses help us shape a better financial education — thank you
          for contributing.
        </p>
      </div>
    </div>
  );
};

function ErrorIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default ParentsFeedback;
