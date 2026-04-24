import { Link } from 'react-router-dom'

type ActiveGoal = {
  goalTitle: string
  targetAmount: number
  currentSavedAmount: number
  targetDate?: string | null
}

const dashboardData: {
  nickName: string
  gameMoney: number
  confidenceScore: number
  weeklyPlays: number
  activeGoal?: ActiveGoal | null
} = {
  nickName: 'Harry',
  gameMoney: 245,
  confidenceScore: 72,
  weeklyPlays: 3,
  activeGoal: {
    goalTitle: 'Save for a laptop',
    targetAmount: 800,
    currentSavedAmount: 260,
    targetDate: '2026-06-30'
  }
}

export default function DashboardPage() {
  const data = dashboardData

  const nickname = data.nickName || 'Friend'
  const gameMoney = data.gameMoney ?? 0
  const confidenceScore = data.confidenceScore ?? 0
  const weeklyPlays = data.weeklyPlays ?? 0
  const activeGoal = data.activeGoal

  const goalProgress =
    activeGoal && Number(activeGoal.targetAmount) > 0
      ? Math.min(
          100,
          (Number(activeGoal.currentSavedAmount) / Number(activeGoal.targetAmount)) * 100
        )
      : 0

  const confidenceMessage =
    confidenceScore >= 80
      ? 'You are doing a great job building strong money habits.'
      : confidenceScore >= 50
        ? 'You are making steady progress with your money confidence.'
        : 'Keep going. Small money decisions build big confidence over time.'

  return (
    <div className="min-h-screen bg-[#edf7f3] text-[#163d32]">
      

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-[#d9e8e1] bg-white p-6 shadow-[0_14px_36px_rgba(18,63,50,0.08)] sm:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cde8dc] bg-[#dff4ea] px-4 py-2 text-sm font-bold text-[#2b8e70]">
              <span>👋</span>
              <span>Registered user dashboard</span>
            </div>

            <h1 className="mb-4 font-serif text-4xl font-bold leading-tight tracking-[-0.03em] text-[#163d32] sm:text-5xl lg:text-6xl">
              Welcome back,
              <br />
              {nickname}
            </h1>

            <p className="mb-6 max-w-2xl text-base leading-7 text-[#71877f] sm:text-lg sm:leading-8">
              Keep learning through simple money decisions, track your growth, and build confidence one step at a time.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/game"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-[#22a879] px-7 text-base font-bold text-white shadow-[0_10px_22px_rgba(34,168,121,0.2)] transition hover:bg-[#1f9d71] sm:text-lg"
              >
                Start scenario <span>→</span>
              </Link>

              <Link
                to="/money"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border-2 border-[#163d32] bg-white px-7 text-base font-bold text-[#163d32] transition hover:bg-[#f8fbf9] sm:text-lg"
              >
                Track money
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 rounded-[22px] border border-[#d9e8e1] bg-[#f8fbfa] p-5 shadow-[0_14px_36px_rgba(18,63,50,0.08)] sm:grid-cols-3">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">Current score</p>
                <p className="font-serif text-2xl font-bold text-[#163d32]">{confidenceScore}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">Weekly plays</p>
                <p className="font-serif text-2xl font-bold text-[#163d32]">{weeklyPlays}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">Game money</p>
                <p className="font-serif text-2xl font-bold text-[#163d32]">${gameMoney.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#d9e8e1] bg-white p-6 shadow-[0_14px_36px_rgba(18,63,50,0.08)] sm:p-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">This week</p>
            <h2 className="mb-3 font-serif text-2xl font-bold tracking-[-0.03em] text-[#163d32] sm:text-3xl">
              Progress snapshot
            </h2>
            <p className="text-base leading-7 text-[#71877f]">{confidenceMessage}</p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-[#d9e8e1] bg-[#f8fbfa] p-5 shadow-[0_14px_36px_rgba(18,63,50,0.08)]">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">Confidence</p>
                <div className="font-serif text-4xl font-bold tracking-[-0.03em] text-[#163d32]">
                  {confidenceScore}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#d9e8e1] bg-[#f8fbfa] p-5 shadow-[0_14px_36px_rgba(18,63,50,0.08)]">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">Scenarios</p>
                <div className="font-serif text-4xl font-bold tracking-[-0.03em] text-[#163d32]">
                  {weeklyPlays}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#d9e8e1] bg-white p-7 shadow-[0_14px_36px_rgba(18,63,50,0.08)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d4ebe1] bg-[#eef8f4] text-2xl text-[#22a879]">
              🎯
            </div>
            <h3 className="mb-3 font-serif text-2xl font-bold tracking-[-0.03em] text-[#163d32]">
              Spin &amp; Learn
            </h3>
            <p className="mb-5 text-base leading-7 text-[#71877f]">
              Explore short real-world money scenarios and practice judgment-free learning.
            </p>
            <Link
              to="/game"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#22a879] px-7 text-base font-bold text-white shadow-[0_10px_22px_rgba(34,168,121,0.2)] transition hover:bg-[#1f9d71]"
            >
              Play now
            </Link>
          </div>

          <div className="rounded-3xl border border-[#d9e8e1] bg-white p-7 shadow-[0_14px_36px_rgba(18,63,50,0.08)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d4ebe1] bg-[#eef8f4] text-2xl text-[#22a879]">
              📊
            </div>
            <h3 className="mb-3 font-serif text-2xl font-bold tracking-[-0.03em] text-[#163d32]">
              Track Real Money
            </h3>
            <p className="mb-5 text-base leading-7 text-[#71877f]">
              Log cash in and cash out to better understand your money picture.
            </p>
            <Link
              to="/money"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#22a879] px-7 text-base font-bold text-white shadow-[0_10px_22px_rgba(34,168,121,0.2)] transition hover:bg-[#1f9d71]"
            >
              Open money
            </Link>
          </div>

          <div className="rounded-3xl border border-[#d9e8e1] bg-white p-7 shadow-[0_14px_36px_rgba(18,63,50,0.08)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d4ebe1] bg-[#eef8f4] text-2xl text-[#22a879]">
              📝
            </div>
            <h3 className="mb-3 font-serif text-2xl font-bold tracking-[-0.03em] text-[#163d32]">
              Share Feedback
            </h3>
            <p className="mb-5 text-base leading-7 text-[#71877f]">
              Tell us what is useful, what feels confusing, and what you want next.
            </p>
            <Link
              to="/feedback"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#22a879] px-7 text-base font-bold text-white shadow-[0_10px_22px_rgba(34,168,121,0.2)] transition hover:bg-[#1f9d71]"
            >
              Give feedback
            </Link>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-[#d9e8e1] bg-white p-6 shadow-[0_14px_36px_rgba(18,63,50,0.08)] sm:p-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">Confidence journey</p>
            <h2 className="mb-3 font-serif text-4xl font-bold tracking-[-0.03em] text-[#163d32] sm:text-5xl">
              ${gameMoney.toFixed(2)}
            </h2>
            <p className="mb-5 text-base leading-7 text-[#71877f]">
              Your current game money total reflects the choices you have made in scenarios so far.
            </p>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex items-center">
                <span className="ml-0 h-7 w-7 rounded-full border-4 border-[#edf7f3] bg-[#20ad84]" />
                <span className="-ml-2 h-7 w-7 rounded-full border-4 border-[#edf7f3] bg-[#0f7e68]" />
                <span className="-ml-2 h-7 w-7 rounded-full border-4 border-[#edf7f3] bg-[#d5a51d]" />
                <span className="-ml-2 h-7 w-7 rounded-full border-4 border-[#edf7f3] bg-[#18493d]" />
              </div>
              <span className="text-sm leading-6 text-[#71877f] sm:text-base">
                You completed <strong className="text-[#163d32]">{weeklyPlays}</strong> scenarios this week
              </span>
            </div>

            <div className="rounded-[22px] border border-[#d9e8e1] bg-[#f8fbfa] p-5 shadow-[0_14px_36px_rgba(18,63,50,0.08)]">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">Next step</p>
              <p className="text-base leading-7 text-[#71877f]">
                Try one more scenario today and compare how your decisions affect your confidence score.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#d9e8e1] bg-white p-6 shadow-[0_14px_36px_rgba(18,63,50,0.08)] sm:p-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">Active goal</p>

            {activeGoal ? (
              <>
                <h3 className="mb-2 font-serif text-2xl font-bold tracking-[-0.03em] text-[#163d32]">
                  {activeGoal.goalTitle}
                </h3>
                <p className="mb-4 text-base leading-7 text-[#71877f]">
                  Saved ${Number(activeGoal.currentSavedAmount).toFixed(2)} of ${Number(activeGoal.targetAmount).toFixed(2)}
                </p>

                <div className="mb-4 h-3.5 w-full overflow-hidden rounded-full bg-[#e8f2ee]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#22a879] to-[#1f9d71]"
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>

                <p className="mb-5 text-base leading-7 text-[#71877f]">
                  {activeGoal.targetDate ? `Target date: ${activeGoal.targetDate}` : 'No target date set yet.'}
                </p>

                <div className="rounded-[22px] border border-[#d9e8e1] bg-[#f8fbfa] p-5 shadow-[0_14px_36px_rgba(18,63,50,0.08)]">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7b8f87]">Goal progress</p>
                  <p className="text-base leading-7 text-[#71877f]">
                    You have completed <strong className="text-[#163d32]">{goalProgress.toFixed(0)}%</strong> of this goal.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-2 font-serif text-2xl font-bold tracking-[-0.03em] text-[#163d32]">
                  No active goal yet
                </h3>
                <p className="mb-5 text-base leading-7 text-[#71877f]">
                  Start tracking your spending and build a savings target that fits your life.
                </p>
                <Link
                  to="/money"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#22a879] px-7 text-base font-bold text-white shadow-[0_10px_22px_rgba(34,168,121,0.2)] transition hover:bg-[#1f9d71]"
                >
                  Create goal
                </Link>
              </>
            )}
          </div>
        </section>

        
      </main>
    </div>
  )
}