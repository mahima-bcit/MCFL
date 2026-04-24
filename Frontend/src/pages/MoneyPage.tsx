import { Link } from "react-router-dom";

export default function MoneyPage() {
  return (
    <main className="min-h-screen bg-[#edf7f3] px-4 py-10 text-[#163d32] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-[28px] border border-[#d9e8e1] bg-white p-6 shadow-[0_14px_36px_rgba(18,63,50,0.08)] sm:p-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">
          Money tracker
        </p>

        <h1 className="mb-4 font-serif text-4xl font-bold tracking-[-0.03em] text-[#163d32]">
          Track Money
        </h1>

        <p className="mb-6 text-base leading-7 text-[#71877f]">
          This page will be used for budget, spending, and savings-goal tracking.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#22a879] px-7 text-base font-bold text-white shadow-[0_10px_22px_rgba(34,168,121,0.2)] transition hover:bg-[#1f9d71]"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}