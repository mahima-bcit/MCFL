import type { AdminUserDetail } from "../../../types/adminUsers";
import AdminCard from "../ui/AdminCard";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Coins,
  Gauge,
  Heart,
  MessageSquareText,
  Target,
  Wallet,
} from "lucide-react";

type Props = {
  user: AdminUserDetail;
};

export default function UserDetailsPanel({ user }: Props) {
  return (
    <div className="space-y-5 rounded-[24px] bg-[#f5f8fc] p-4">
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Target size={18} className="text-[#2563eb]" />
          <h3 className="text-[16px] font-semibold text-[#0f172a]">
            Learning Savings Goal
          </h3>
        </div>

        <AdminCard className="rounded-[16px] p-3 md:rounded-[18px] md:p-4">
          <div className="space-y-3">
            {user.learningGoalTitle ? (
              <>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Goal
                  </p>
                  <p className="mt-1 text-[16px] font-semibold text-[#0f172a]">
                    {user.learningGoalTitle}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] text-slate-700">
                    Progress: ${user.learningGoalProgress} / $
                    {user.learningGoalTargetAmount}
                  </p>

                  <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2.5 rounded-full bg-[#2563eb]"
                      style={{
                        width: `${Math.min(
                          100,
                          user.learningGoalTargetAmount > 0
                            ? (user.learningGoalProgress /
                                user.learningGoalTargetAmount) *
                                100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[14px] text-slate-700">
                  <CalendarDays size={15} className="text-slate-400" />
                  <span>
                    Target Date: {user.learningGoalTargetDate || "Not set"}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-[14px] text-slate-400">No goal set yet.</p>
            )}
          </div>
        </AdminCard>
      </section>
      
      <section>
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 size={18} className="text-[#2563eb]" />
          <h3 className="text-[16px] font-semibold text-[#0f172a]">
            Game Progress
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AdminCard className="rounded-[16px] p-3 md:rounded-[18px] md:p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
              <BarChart3 size={18} className="text-[#2563eb]" />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Scenarios Completed
            </p>
            <p className="mt-1.5 text-[15px] font-semibold text-[#0f172a] md:mt-2 md:text-[16px]">
              {user.scenariosCompleted}
            </p>
          </AdminCard>

          <AdminCard className="rounded-[16px] p-3 md:rounded-[18px] md:p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eafaf3]">
              <Coins size={18} className="text-[#10b981]" />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Game Money
            </p>
            <p className="mt-1.5 text-[15px] font-semibold text-[#0f172a] md:mt-2 md:text-[16px]">
              ${user.gameMoney}
            </p>
          </AdminCard>

          <AdminCard className="rounded-[16px] p-3 md:rounded-[18px] md:p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3ecff]">
              <Gauge size={18} className="text-[#7c3aed]" />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Confidence
            </p>
            <p className="mt-1.5 text-[15px] font-semibold text-[#0f172a] md:mt-2 md:text-[16px]">
              {user.confidence}%
            </p>
          </AdminCard>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Wallet size={18} className="text-[#2563eb]" />
          <h3 className="text-[16px] font-semibold text-[#0f172a]">
            Financial Stuff
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {Object.entries(user.financialStuff).map(([key, value]) => (
            <AdminCard key={key} className="rounded-[18px] p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {key}
              </p>
              <p className="mt-2 text-[15px] font-semibold text-[#0f172a]">
                {value && value.trim() !== "" ? value : "Not provided"}
              </p>
            </AdminCard>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Heart size={18} className="text-[#2563eb]" />
          <h3 className="text-[16px] font-semibold text-[#0f172a]">
            Money Beliefs
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {Object.entries(user.moneyBeliefs).map(([label, answer]) => {
            const answerLower = answer.toLowerCase();
            const chip =
              answerLower === "agree"
                ? "bg-emerald-50 text-emerald-700"
                : answerLower === "disagree"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-amber-50 text-amber-700";

            return (
              <AdminCard key={label} className="rounded-[18px] p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  {label}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-0.5 text-[13px] font-semibold ${chip}`}
                >
                  {answer}
                </span>
              </AdminCard>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-[#2563eb]" />
          <h3 className="text-[16px] font-semibold text-[#0f172a]">
            Learning Preferences
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {Object.entries(user.learningPreferences).map(([key, value]) => (
            <AdminCard key={key} className="rounded-[18px] p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {key}
              </p>
              <p className="mt-2 text-[15px] font-semibold text-[#0f172a]">
                {value && value.trim() !== "" ? value : "Not provided"}
              </p>
            </AdminCard>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <MessageSquareText size={18} className="text-[#2563eb]" />
          <h3 className="text-[16px] font-semibold text-[#0f172a]">
            Parent Teachings
          </h3>
        </div>

        <AdminCard className="rounded-[16px] p-3 md:rounded-[18px] md:p-4">
          <p className="text-[15px] leading-6 text-slate-700">
            {user.parentTeachings && user.parentTeachings.trim() !== ""
              ? user.parentTeachings
              : "Not provided"}
          </p>
        </AdminCard>
      </section>
    </div>
  );
}