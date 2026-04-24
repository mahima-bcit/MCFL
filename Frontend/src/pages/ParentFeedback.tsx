import { useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";

type ParentFeedbackFormData = {
  parentEmail: string;
  childName: string;
  moneyStory: string;
  whatChildShouldLearn: string;
};

const initialFormData: ParentFeedbackFormData = {
  parentEmail: "",
  childName: "Alex Rivera",
  moneyStory: "",
  whatChildShouldLearn: "",
};

export default function ParentFeedback() {
  const { token } = useParams();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ParentFeedbackFormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    console.log("Parent feedback submitted:", {
      token: token ?? null,
      ...formData,
    });

    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-[#f8fcff] to-[#f5f2ff] text-[#123765]">
      <header className="border-b border-[#eef2f7] bg-white/80">
        <div className="mx-auto flex h-16 max-w-[640px] items-center justify-center px-5">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Money Confidence for Life"
              className="h-8 w-8"
            />
            <span className="font-display text-[18px] font-bold text-[#123765]">
              Money Confidence for Life
            </span>
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-[640px] px-5 pb-12 pt-9">
        <div className="mb-7 text-center">
          <h1 className="font-display text-[34px] font-bold leading-tight text-[#123765]">
            Parent Feedback
          </h1>
          <p className="mt-2 text-[14px] text-[#6f8299]">
            Help us understand your child&apos;s money learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-[#ddeeff] bg-[#eef7ff] p-5">
            <h2 className="mb-3 font-display text-[17px] font-bold text-[#123765]">
              Why we&apos;re asking
            </h2>
            <p className="text-[13px] leading-6 text-[#5c7188]">
              Your perspective as a parent is invaluable. We want to understand
              the money lessons and values you&apos;re already sharing with your
              child, so we can build on that foundation and support their
              learning journey.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_10px_28px_rgba(18,55,101,0.10)]">
            <h2 className="mb-5 font-display text-[18px] font-bold text-[#123765]">
              Your Contact Information
            </h2>

            <label
              htmlFor="parentEmail"
              className="mb-2 block text-[13px] font-bold text-[#123765]"
            >
              Your Email
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9eb0c1]">
                ✉
              </span>
              <input
                id="parentEmail"
                type="email"
                value={formData.parentEmail}
                onChange={(event) =>
                  handleChange("parentEmail", event.target.value)
                }
                placeholder="your@email.com"
                className="h-12 w-full rounded-xl border border-[#dcebf0] bg-[#f4fbfb] pl-11 pr-4 text-[14px] text-[#123765] outline-none placeholder:text-[#9eb0c1] focus:border-[#2f7df4]"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_10px_28px_rgba(18,55,101,0.10)]">
            <h2 className="mb-5 font-display text-[18px] font-bold text-[#123765]">
              About Your Child
            </h2>

            <label
              htmlFor="childName"
              className="mb-2 block text-[13px] font-bold text-[#123765]"
            >
              Child&apos;s Name
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9eb0c1]">
                ♙
              </span>
              <input
                id="childName"
                type="text"
                value={formData.childName}
                onChange={(event) =>
                  handleChange("childName", event.target.value)
                }
                placeholder="Alex Rivera"
                className="h-12 w-full rounded-xl border border-[#dcebf0] bg-[#f4fbfb] pl-11 pr-4 text-[14px] text-[#123765] outline-none placeholder:text-[#9eb0c1] focus:border-[#2f7df4]"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_10px_28px_rgba(18,55,101,0.10)]">
            <h2 className="mb-4 font-display text-[18px] font-bold text-[#123765]">
              Share a Money Story
            </h2>

            <label
              htmlFor="moneyStory"
              className="mb-2 block text-[13px] font-bold text-[#123765]"
            >
              Tell us about a money lesson you learned or wish you had learned
            </label>

            <textarea
              id="moneyStory"
              rows={7}
              value={formData.moneyStory}
              onChange={(event) =>
                handleChange("moneyStory", event.target.value)
              }
              placeholder="For example: I remember when I got my first paycheck and spent it all in one weekend. I wish someone had taught me about saving a portion first..."
              className="w-full resize-none rounded-xl border border-[#dcebf0] bg-[#f4fbfb] px-4 py-4 text-[14px] leading-6 text-[#123765] outline-none placeholder:text-[#9eb0c1] focus:border-[#2f7df4]"
            />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_10px_28px_rgba(18,55,101,0.10)]">
            <h2 className="mb-4 font-display text-[18px] font-bold text-[#123765]">
              Your Hopes for Their Learning
            </h2>

            <label
              htmlFor="whatChildShouldLearn"
              className="mb-2 block text-[13px] font-bold text-[#123765]"
            >
              What do you most want your child to learn about money?
            </label>

            <textarea
              id="whatChildShouldLearn"
              rows={7}
              value={formData.whatChildShouldLearn}
              onChange={(event) =>
                handleChange("whatChildShouldLearn", event.target.value)
              }
              placeholder="For example: I want them to understand that money is a tool, not a measure of worth. I want them to feel confident making financial decisions without fear..."
              className="w-full resize-none rounded-xl border border-[#dcebf0] bg-[#f4fbfb] px-4 py-4 text-[14px] leading-6 text-[#123765] outline-none placeholder:text-[#9eb0c1] focus:border-[#2f7df4]"
            />
          </div>

          <button
  type="submit"
  disabled={isSubmitting}
  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2f7df4] to-[#6c3df4] text-[15px] font-bold text-white shadow-[0_14px_28px_rgba(47,125,244,0.32)] transition hover:scale-[1.01]"
>
  <span className="text-[18px] leading-none">➤</span>
  <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
</button>
        </form>
      </section>
    </main>
  );
}