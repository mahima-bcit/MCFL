import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { apiFetch } from "../services/apiClient";
import { getParentFeedbackToken, regenerateParentFeedbackToken } from "../services/parentFeedbackApi";
import { useTheme } from "../context/ThemeContext";

const FALLBACK_ICONS: React.ReactNode[] = [
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
  </svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
  </svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>,
];

function iconForCategory(name: string, index: number): React.ReactNode {
  const lower = name.toLowerCase();
  if (lower.includes("bug"))
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0V9m0-4.5v.25m-3.75.25v-.25a3.75 3.75 0 017.5 0v.25m-7.5 0a3.75 3.75 0 00-.75 2.25v.75m9-3a3.75 3.75 0 01.75 2.25v.75M9 9.75h6M6.75 15h10.5" />
      </svg>
    );
  if (lower.includes("feature") || lower.includes("idea") || lower.includes("request"))
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a7.5 7.5 0 01-3 0m3 0a3 3 0 003-3v-1.5a3 3 0 00-3-3H9a3 3 0 00-3 3v1.5a3 3 0 003 3m3 0v2.25" />
      </svg>
    );
  if (lower.includes("general"))
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    );
  if (lower.includes("scenario"))
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    );
  if (lower.includes("other"))
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    );
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

export default function FeedbackPage() {
  const { isDark } = useTheme();

  const [categories, setCategories] = useState<string[]>([]);
  const [isCatsLoading, setIsCatsLoading] = useState(true);
  const [category, setCategory] = useState<string>("");
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [parentToken, setParentToken] = useState<string | null>(null);
  const [isLoadingLink, setIsLoadingLink] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      if (copiedTimerRef.current)  clearTimeout(copiedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    apiFetch<string[]>("/UserFeedback/types")
      .then((types) => {
        setCategories(types);
        if (types.length > 0) setCategory(types[0]);
      })
      .catch((err) => console.error("Failed to fetch feedback types:", err))
      .finally(() => setIsCatsLoading(false));
  }, []);

  useEffect(() => {
    getParentFeedbackToken()
      .then(({ token }) => setParentToken(token))
      .catch((err) => console.error("Failed to fetch parent feedback token:", err))
      .finally(() => setIsLoadingLink(false));
  }, []);

  const parentLink = parentToken
    ? `${window.location.origin}/parentFeedback?token=${parentToken}`
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setCommentError("Please enter your feedback before submitting.");
      return;
    }
    if (comment.trim().length < 10) {
      setCommentError("Please provide a bit more detail (at least 10 characters).");
      return;
    }
    setCommentError(null);
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await apiFetch("/UserFeedback", {
        method: "POST",
        body: JSON.stringify({ feedbackType: category, comment }),
      });
      setSubmitSuccess(true);
      setComment("");
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!parentLink) return;
    navigator.clipboard.writeText(parentLink).then(() => {
      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const { token } = await regenerateParentFeedbackToken();
      setParentToken(token);
      setCopied(false);
    } catch (err) {
      console.error("Failed to regenerate parent feedback token:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const clr = {
    heading: isDark ? "#c8e8da" : "#194d3e",
    subtext: isDark ? "#7aaa98" : "#4c5f91",
    muted:   isDark ? "#7aaa98" : "#61708f",
  };

  const t = {
    bg:       isDark ? "bg-[#0d1a15]"   : "bg-[#edf4f0]",
    card:     isDark ? "bg-[#172620] border-[#2a4039]" : "bg-white border-[#cfe0d7]",
    iconBg:   isDark ? "bg-[#1e3530]"   : "bg-[#d6ede3]",
    inputBg:  isDark
      ? "bg-[#1e3530] border-[#2a4039] text-[#d4efe5] placeholder:text-[#4a7a68] focus:border-[#34d39a] focus:ring-[#34d39a]/20"
      : "bg-white border-[#cfe0d7] text-[#183c32] placeholder:text-[#7aaa98] focus:border-[#1a7a50] focus:ring-[#1a7a50]/20",
    catActive: isDark
      ? "border-[#34d39a] bg-[#1e3530] text-[#34d39a]"
      : "border-[#1a7a50] bg-[#edf4f0] text-[#1a7a50]",
    catIdle:  isDark
      ? "border-[#2a4039] bg-[#172620] text-[#7aaa98] hover:border-[#34d39a]/50 hover:text-[#d4efe5]"
      : "border-[#cfe0d7] bg-white text-[#20463b] hover:border-[#1a7a50]/50 hover:text-[#183c32]",
    linkBox:  isDark ? "bg-[#1e3530] border-[#2a4039]" : "bg-[#edf4f0] border-[#cfe0d7]",
    skeleton: isDark ? "border-[#2a4039] bg-[#1e3530]" : "border-[#cfe0d7] bg-[#edf4f0]",
  };

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${t.bg} transition-colors duration-200`}>
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8" style={{ maxWidth: "1240px", margin: "0 auto" }}>

        {/* Page header */}
        <div className="mb-8 flex items-center gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${t.iconBg}`}>
            <svg className="w-7 h-7 text-[#1a7a50]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display" style={{ color: clr.heading }}>Share Feedback</h1>
            <p className="text-sm font-body mt-0.5" style={{ color: clr.subtext }}>
              Help us improve your experience! Share your thoughts, report issues, or suggest new features.
            </p>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">

          {/* Left: User Feedback Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`${t.card} rounded-2xl shadow-sm border p-6 space-y-5`}
          >
            <div>
              <h2 className="text-lg font-bold font-body" style={{ color: clr.heading }}>Send Us Your Feedback</h2>
              <p className="text-sm font-body mt-1" style={{ color: clr.subtext }}>
                Tell us what's on your mind so we can keep improving.
              </p>
            </div>

            {/* Category selector */}
            <div>
              <p className="text-sm font-semibold font-body mb-3" style={{ color: clr.heading }}>
                What type of feedback is this?
              </p>
              {isCatsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-24 rounded-xl border-2 ${t.skeleton} animate-pulse`} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {categories.map((cat, i) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-xs font-semibold font-body transition-all duration-150 ${
                        category === cat ? t.catActive : t.catIdle
                      }`}
                    >
                      {category === cat && (
                        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1a7a50]">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l4.5 4.5 10.5-10.5" />
                          </svg>
                        </span>
                      )}
                      {iconForCategory(cat, i)}
                      <span className="text-center leading-tight">{cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Comment textarea */}
            <div>
              <label htmlFor="feedback-comment" className="block text-sm font-semibold font-body mb-2" style={{ color: clr.heading }}>
                Your Comments
              </label>
              <textarea
                id="feedback-comment"
                rows={5}
                maxLength={1000}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (commentError) setCommentError(null);
                }}
                placeholder="Share your thoughts, suggestions, or report an issue..."
                className={`w-full rounded-xl border px-4 py-3 text-sm font-body outline-none focus:ring-2 resize-y transition-colors ${t.inputBg} ${
                  commentError ? "border-red-400 ring-2 ring-red-100" : ""
                }`}
              />
              <div className="flex justify-between items-center mt-1.5">
                {commentError && (
                  <p className="text-xs text-red-500 font-body">{commentError}</p>
                )}
                <span className="text-xs font-mono ml-auto" style={{ color: clr.muted }}>{comment.length} / 1000</span>
              </div>
            </div>

            {submitError && (
              <p className="text-sm text-red-400 font-body">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !category}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1a7a50] hover:bg-[#155f3e] text-white font-bold font-body py-3.5 text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Submit Feedback
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs font-body">
              <svg className="w-4 h-4 shrink-0" style={{ color: clr.muted }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              {submitSuccess ? (
                <span className="text-[#34d39a] font-semibold">
                  Thank you! Your feedback has been received.
                </span>
              ) : (
                <span style={{ color: clr.muted }}>
                  Thank you! Your feedback helps us build a better experience.
                </span>
              )}
            </div>
          </form>

          {/* Right: Parent Feedback Link */}
          <div className={`${t.card} rounded-2xl shadow-sm border p-6 space-y-5`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.iconBg}`}>
                <svg className="w-5 h-5 text-[#1a7a50]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold font-body" style={{ color: clr.heading }}>Parent Feedback Link</h2>
                <p className="text-sm font-body mt-0.5" style={{ color: clr.subtext }}>
                  Share this link with your parent or guardian so they can provide feedback about your money learning journey.
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold font-body mb-2" style={{ color: clr.heading }}>
                Your Unique Parent Feedback Link
              </p>
              <div className={`rounded-xl border px-4 py-3 text-xs font-mono break-all min-h-12 leading-relaxed ${t.linkBox}`} style={{ color: clr.subtext }}>
                {isLoadingLink ? "Loading your link..." : parentLink || "Unable to load link."}
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={isLoadingLink || !parentLink}
                  className="flex items-center gap-2 rounded-xl bg-[#1a7a50] hover:bg-[#155f3e] text-white font-bold font-body px-5 py-2.5 text-sm transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isLoadingLink || isRegenerating}
                  className="flex items-center gap-2 rounded-xl border border-[#1a7a50] text-[#1a7a50] hover:bg-[#1a7a50] hover:text-white font-bold font-body px-5 py-2.5 text-sm transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRegenerating ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  )}
                  {isRegenerating ? "Regenerating..." : "Regenerate"}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 text-xs font-body mt-8" style={{ color: clr.muted }}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Your privacy matters. Feedback is used to improve your learning experience.
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
