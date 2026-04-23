import { useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";

type ParentFeedbackFormData = {
  parentName: string;
  parentEmail: string;
  moneyStory: string;
  whatChildShouldLearn: string;
};

type ParentFeedbackErrors = Partial<Record<keyof ParentFeedbackFormData, string>>;

const initialFormData: ParentFeedbackFormData = {
  parentName: "",
  parentEmail: "",
  moneyStory: "",
  whatChildShouldLearn: "",
};

function validateForm(data: ParentFeedbackFormData) {
  const errors: ParentFeedbackErrors = {};

  if (!data.parentEmail.trim()) {
    errors.parentEmail = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(data.parentEmail)) {
    errors.parentEmail = "Please enter a valid email address.";
  }

  if (!data.moneyStory.trim()) {
    errors.moneyStory = "Please share your money story.";
  } else if (data.moneyStory.trim().length < 20) {
    errors.moneyStory = "Please write at least 20 characters.";
  }

  if (!data.whatChildShouldLearn.trim()) {
    errors.whatChildShouldLearn = "Please tell us what your child should learn.";
  } else if (data.whatChildShouldLearn.trim().length < 20) {
    errors.whatChildShouldLearn = "Please write at least 20 characters.";
  }

  return errors;
}

export default function ParentFeedback() {
  const { token } = useParams();
  const [formData, setFormData] = useState<ParentFeedbackFormData>(initialFormData);
  const [errors, setErrors] = useState<ParentFeedbackErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    field: keyof ParentFeedbackFormData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    console.log("Parent feedback submitted:", {
      token: token ?? null,
      ...formData,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleSubmitAnotherResponse = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <main>
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto animate-fade-up">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1 mb-4">
                {token ? "Invitation link detected" : "Preview mode"}
              </span>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-nav mb-3">
                Parent / Guardian Feedback
              </h1>

              <p className="text-nav/70 leading-relaxed">
                We&apos;d love to learn how money is talked about at home and what
                you hope your child learns. Your feedback helps us build a more
                supportive experience for families.
              </p>
            </div>

            {isSubmitted ? (
              <div className="rounded-2xl border border-primary/20 bg-mint p-6 md:p-8 animate-fade-in">
                <h2 className="font-display text-2xl font-bold text-nav mb-3">
                  Thank you for sharing your feedback.
                </h2>
                <p className="text-nav/70 leading-relaxed mb-6">
                  Your input will help us support young people as they build
                  money confidence for real life.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSubmitAnotherResponse}
                    className="justify-center"
                  >
                    Submit another response
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.location.assign("/")}
                    className="justify-center"
                  >
                    Back to home
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="parentName"
                    className="block text-sm font-semibold text-nav mb-2"
                  >
                    Parent / Guardian Name <span className="text-nav/40">(optional)</span>
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    value={formData.parentName}
                    onChange={(event) => handleChange("parentName", event.target.value)}
                    placeholder="Your name"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border-2 border-nav/20 text-nav placeholder-nav/40 focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="parentEmail"
                    className="block text-sm font-semibold text-nav mb-2"
                  >
                    Parent / Guardian Email <span className="text-error">*</span>
                  </label>
                  <input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(event) => handleChange("parentEmail", event.target.value)}
                    placeholder="parent@email.com"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-nav placeholder-nav/40 focus:outline-none transition-colors disabled:opacity-60 ${
                      errors.parentEmail
                        ? "border-error focus:border-error"
                        : "border-nav/20 focus:border-primary"
                    }`}
                  />
                  {errors.parentEmail ? (
                    <p className="mt-2 text-sm text-error">{errors.parentEmail}</p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="moneyStory"
                    className="block text-sm font-semibold text-nav mb-2"
                  >
                    What is your money story? <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="moneyStory"
                    rows={5}
                    value={formData.moneyStory}
                    onChange={(event) => handleChange("moneyStory", event.target.value)}
                    placeholder="Share how money was talked about in your family or what experiences shaped your views about money."
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-nav placeholder-nav/40 focus:outline-none transition-colors resize-y disabled:opacity-60 ${
                      errors.moneyStory
                        ? "border-error focus:border-error"
                        : "border-nav/20 focus:border-primary"
                    }`}
                  />
                  <div className="mt-2 flex items-center justify-between gap-4">
                    {errors.moneyStory ? (
                      <p className="text-sm text-error">{errors.moneyStory}</p>
                    ) : (
                      <p className="text-sm text-nav/50">Minimum 20 characters</p>
                    )}
                    <span className="text-xs text-nav/40">
                      {formData.moneyStory.trim().length} characters
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="whatChildShouldLearn"
                    className="block text-sm font-semibold text-nav mb-2"
                  >
                    What should your child learn about money? <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="whatChildShouldLearn"
                    rows={5}
                    value={formData.whatChildShouldLearn}
                    onChange={(event) =>
                      handleChange("whatChildShouldLearn", event.target.value)
                    }
                    placeholder="Tell us what money habits, values, or skills matter most to you."
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-nav placeholder-nav/40 focus:outline-none transition-colors resize-y disabled:opacity-60 ${
                      errors.whatChildShouldLearn
                        ? "border-error focus:border-error"
                        : "border-nav/20 focus:border-primary"
                    }`}
                  />
                  <div className="mt-2 flex items-center justify-between gap-4">
                    {errors.whatChildShouldLearn ? (
                      <p className="text-sm text-error">{errors.whatChildShouldLearn}</p>
                    ) : (
                      <p className="text-sm text-nav/50">Minimum 20 characters</p>
                    )}
                    <span className="text-xs text-nav/40">
                      {formData.whatChildShouldLearn.trim().length} characters
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-mint border border-primary/10 px-4 py-3">
                  <p className="text-sm text-nav/70">
                    This version uses a mock submit for now. When the backend API is ready,
                    this form can send the data to the server.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-base py-4 justify-center"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}