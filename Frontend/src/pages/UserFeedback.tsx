import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/apiClient";

type FeedbackCategory = "General" | "Bug Report" | "Feature Idea" | "Scenario" |"Others";

interface FeedbackFormData {
  category: FeedbackCategory;
  comment: string;
}

interface FormErrors {
  comment?: string;
}

const CATEGORIES: FeedbackCategory[] = [
  "General",
  "Bug Report",
  "Feature Idea",
  "Scenario",
  "Others"
];

const ErrorIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clipRule="evenodd"
    />
  </svg>
);

const UserFeedback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  const [formData, setFormData] = useState<FeedbackFormData>({
    category: "General",
    comment: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.comment.trim()) {
      newErrors.comment = "Please enter your feedback before submitting.";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Please provide a bit more detail (at least 10 characters).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCategorySelect = (category: FeedbackCategory) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, comment: e.target.value }));
    if (errors.comment) {
      setErrors((prev) => ({ ...prev, comment: undefined }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await apiFetch("/api/UserFeedback", {
        method: "POST",
        body: JSON.stringify({
          feedbackType: formData.category,
          comment: formData.comment,
        }),
      });
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mint px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center animate-fade-up">
          <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l4.5 4.5 10.5-10.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-nav mb-3">Thank You!</h2>
          <p className="text-gray-600 font-body leading-relaxed">
            Your {formData.category.toLowerCase()} feedback has been received. We appreciate
            you taking the time to help us improve.
          </p>
          <button
            onClick={() => {
              setSubmitSuccess(false);
              setFormData({ category: "General", comment: "" });
            }}
            className="mt-8 text-primary font-body font-medium hover:text-primary-dark transition-colors underline underline-offset-4"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-5 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="text-nav hover:text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-display font-bold text-nav leading-tight">Share Your Feedback</h1>
          <p className="text-sm font-body text-gray-400 mt-0.5">Help us improve your experience</p>
        </div>
      </header>

      {/* Body */}
      <form onSubmit={handleSubmit} noValidate className="max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-6">
        {/* Category selector */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-up">
          <h2 className="text-base font-display font-semibold text-nav mb-4">
            What's your feedback about?
          </h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-body font-semibold transition-all duration-150 border ${
                  formData.category === cat
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-nav/60 border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Comments */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-up [animation-delay:150ms]">
          <h2 className="text-base font-display font-semibold text-nav mb-4">Comments</h2>
          <textarea
            id="comment"
            name="comment"
            rows={6}
            value={formData.comment}
            onChange={handleCommentChange}
            placeholder="Share your thoughts, suggestions, or report an issue..."
            className={`w-full px-4 py-3 rounded-xl border font-body text-nav placeholder:text-gray-400 bg-gray-50/50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y min-h-35 text-sm ${
              errors.comment ? "border-error ring-2 ring-error/20" : "border-gray-200"
            }`}
          />
          <div className="flex justify-between items-center mt-2">
            {errors.comment ? (
              <p className="text-sm text-error font-body flex items-center gap-1.5">
                <ErrorIcon />
                {errors.comment}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400 font-mono ml-auto">
              {formData.comment.length} characters
            </span>
          </div>
        </section>

        {/* Submit error */}
        {submitError && (
          <p className="text-sm text-error font-body flex items-center gap-1.5 px-1">
            <ErrorIcon />
            {submitError}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-body font-bold text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2.5 animate-fade-up [animation-delay:300ms]"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Submit Feedback
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-400 font-body animate-fade-in [animation-delay:450ms]">
          Your responses help us build a better experience — thank you for contributing.
        </p>
      </form>
    </div>
  );
};

export default UserFeedback;
