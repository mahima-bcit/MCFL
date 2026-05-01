const scenarios = [
  {
    id: 1,
    tag: "First Paycheque",
    question: "Your first paycheque just hit — $847 after tax. Rent is due in 3 days and your friends want to celebrate. What do you do?",
    choices: [
      { label: "Pay rent first, skip the night out", outcome: "+12% confidence", positive: true },
      { label: "Go out, pay rent from next cheque", outcome: "−8% confidence", positive: false },
      { label: "Pay rent, set aside $50 for fun", outcome: "+18% confidence", positive: true },
    ],
  },
  {
    id: 2,
    tag: "Unexpected Cost",
    question: "Your phone screen cracks. Repair is $180 but you have no emergency fund. You need your phone for work.",
    choices: [
      { label: "Put it on a credit card", outcome: "−5% confidence", positive: false },
      { label: "Sell something you own to cover it", outcome: "+10% confidence", positive: true },
      { label: "Ask family for a short-term loan", outcome: "+6% confidence", positive: true },
    ],
  },
]

export default function ScenarioPreview() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">

        {/* Heading */}
        <div className="mb-10 animate-fade-up text-center md:mb-14">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary-dark">
            Real decisions, real learning
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-nav md:text-4xl">
            See it in action
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-nav/55">
            No textbooks. Just scenarios from real life and you decide what happens next.
          </p>
        </div>

        {/* Scenario cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {scenarios.map((scenario, si) => (
            <div
              key={scenario.id}
              className="animate-fade-up overflow-hidden rounded-3xl border border-primary/10 bg-mint shadow-sm"
              style={{ animationDelay: `${si * 150}ms` }}
            >
              {/* Card header */}
              <div className="border-b border-primary/10 bg-nav px-5 py-4">
                <span className="mb-2 inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/80">
                  {scenario.tag}
                </span>
                <p className="text-[15px] font-medium leading-snug text-white">
                  {scenario.question}
                </p>
              </div>

              {/* Choices */}
              <div className="flex flex-col gap-2 p-4">
                {scenario.choices.map((choice, ci) => (
                  <div
                    key={ci}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-white px-4 py-3"
                  >
                    <span className="text-[14px] text-nav/80">{choice.label}</span>
                    <span
                      className={`shrink-0 text-[12px] font-semibold ${
                        choice.positive ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {choice.outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-nav/40">
          Outcomes are shown for illustration — in the real game, you discover them after you choose.
        </p>

      </div>
    </section>
  )
}