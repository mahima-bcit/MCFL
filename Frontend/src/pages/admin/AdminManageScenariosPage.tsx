import { type FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import AdminCard from "../../components/admin/ui/AdminCard";
import ScenarioStatusModal from "../../components/admin/scenarios/ScenarioStatusModal";
import {
  activateAdminScenario,
  createAdminScenario,
  deactivateAdminScenario,
  getManageScenarios,
  updateAdminScenario,
} from "../../services/adminScenariosApi";
import type {
  AdminManageScenario,
  AdminUpsertScenarioRequest,
} from "../../types/adminScenarios";
import { Link } from "react-router-dom";

type ScenarioFormState = {
  title: string;
  description: string;
  choices: {
    scenarioChoiceId?: number;
    optionText: string;
    resultText: string;
    lessonText: string;
    moneyImpact: string;
    confidenceImpact: string;
  }[];
};

type PendingStatusAction = {
  mode: "activate" | "deactivate";
  scenario: AdminManageScenario;
} | null;

function createEmptyForm(): ScenarioFormState {
  return {
    title: "",
    description: "",
    choices: Array.from({ length: 3 }, () => ({
      optionText: "",
      resultText: "",
      lessonText: "",
      moneyImpact: "0",
      confidenceImpact: "0",
    })),
  };
}

function mapScenarioToForm(scenario: AdminManageScenario): ScenarioFormState {
  const sortedChoices = [...scenario.choices].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return {
    title: scenario.title,
    description: scenario.description,
    choices: Array.from({ length: 3 }, (_, index) => {
      const choice = sortedChoices[index];
      return {
        scenarioChoiceId: choice?.scenarioChoiceId,
        optionText: choice?.optionText ?? "",
        resultText: choice?.resultText ?? "",
        lessonText: choice?.lessonText ?? "",
        moneyImpact: String(choice?.moneyImpact ?? 0),
        confidenceImpact: String(choice?.confidenceImpact ?? 0),
      };
    }),
  };
}

function formatSignedMoney(value: number) {
  const rounded = Number(value.toFixed(2));
  return `${rounded > 0 ? "+" : ""}$${rounded.toFixed(2)}`;
}

function formatSignedConfidence(value: number) {
  return `${value > 0 ? "+" : ""}${value}`;
}

function getMoneyToneClass(value: number) {
  if (value > 0) return "bg-[#eafaf3] text-[#10b981]";
  if (value < 0) return "bg-[#fff7ed] text-[#f59e0b]";
  return "bg-slate-100 text-slate-500";
}

function getConfidenceToneClass(value: number) {
  if (value > 0) return "bg-[#eef4ff] text-[#2563eb]";
  if (value < 0) return "bg-[#f3ecff] text-[#7c3aed]";
  return "bg-slate-100 text-slate-500";
}

export default function AdminManageScenariosPage() {
  const [scenarios, setScenarios] = useState<AdminManageScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingScenarioId, setEditingScenarioId] = useState<number | null>(
    null,
  );
  const [pendingStatusAction, setPendingStatusAction] =
    useState<PendingStatusAction>(null);
  const [form, setForm] = useState<ScenarioFormState>(createEmptyForm());
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  async function loadScenarios() {
    try {
      setLoading(true);
      setError("");
      const result = await getManageScenarios();
      setScenarios(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load scenarios.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    getManageScenarios()
      .then((result) => {
        if (!isMounted) return;
        setScenarios(result);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err instanceof Error ? err.message : "Failed to load scenarios.",
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function startCreate() {
    setView("create");
    setEditingScenarioId(null);
    setPendingStatusAction(null);
    setForm(createEmptyForm());
    setError("");
  }

  function startEdit(scenario: AdminManageScenario) {
    setView("edit");
    setEditingScenarioId(scenario.scenarioId);
    setPendingStatusAction(null);
    setForm(mapScenarioToForm(scenario));
    setError("");
  }

  function updateChoiceField(
    index: number,
    field:
      | "optionText"
      | "resultText"
      | "lessonText"
      | "moneyImpact"
      | "confidenceImpact",
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      choices: current.choices.map((choice, choiceIndex) =>
        choiceIndex === index ? { ...choice, [field]: value } : choice,
      ),
    }));
  }

  async function handleSave() {
    const payload: AdminUpsertScenarioRequest = {
      title: form.title.trim(),
      description: form.description.trim(),
      choices: form.choices.map((choice) => ({
        scenarioChoiceId: choice.scenarioChoiceId,
        optionText: choice.optionText.trim(),
        resultText: choice.resultText.trim(),
        lessonText: choice.lessonText.trim() || null,
        moneyImpact: Number(choice.moneyImpact || 0),
        confidenceImpact: Number(choice.confidenceImpact || 0),
      })),
    };

    if (!payload.title || !payload.description) {
      setError("Title and description are required.");
      return;
    }

    if (
      payload.choices.some((choice) => !choice.optionText || !choice.resultText)
    ) {
      setError("Each choice must include option text and result text.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setPendingStatusAction(null);

      if (view === "edit" && editingScenarioId) {
        await updateAdminScenario(editingScenarioId, payload);
      } else {
        await createAdminScenario(payload);
      }

      await loadScenarios();
      setView("list");
      setEditingScenarioId(null);
      setForm(createEmptyForm());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save scenario.");
    } finally {
      setSaving(false);
    }
  }

  function requestActivate(scenario: AdminManageScenario) {
    setPendingStatusAction({ mode: "activate", scenario });
    setError("");
  }

  function requestDeactivate(scenario: AdminManageScenario) {
    setPendingStatusAction({ mode: "deactivate", scenario });
    setError("");
  }

  async function confirmStatusAction() {
    if (!pendingStatusAction) return;

    try {
      setStatusUpdating(true);
      setError("");

      if (pendingStatusAction.mode === "activate") {
        await activateAdminScenario(pendingStatusAction.scenario.scenarioId);
      } else {
        await deactivateAdminScenario(pendingStatusAction.scenario.scenarioId);
      }

      await loadScenarios();
      setPendingStatusAction(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update scenario status.",
      );
    } finally {
      setStatusUpdating(false);
    }
  }

  function closeStatusModal() {
    if (statusUpdating) return;
    setPendingStatusAction(null);
  }

  function handleScenarioSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  }

  function clearScenarioSearch() {
    setSearchInput("");
    setSearchTerm("");
  }

  const normalizedSearchTerm = searchTerm.toLowerCase();

  const filteredScenarios = normalizedSearchTerm
    ? scenarios.filter((scenario) =>
        scenario.title.toLowerCase().includes(normalizedSearchTerm),
      )
    : scenarios;

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600">
            {error}
          </div>
        ) : null}

        {view === "list" ? (
          <AdminCard className="p-4 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/admin/scenarios"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dbe6f5] bg-white text-slate-700 transition hover:bg-[#f8fbff]"
                  aria-label="Back to scenarios"
                >
                  <ArrowLeft size={17} />
                </Link>

                <h2 className="min-w-0 text-[22px] font-semibold leading-tight text-[#0f172a] md:text-[24px]">
                  Manage Scenarios
                </h2>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <form
                  onSubmit={handleScenarioSearch}
                  className="group flex w-full items-center gap-2 rounded-full border border-[#dbe6f5] bg-white px-3 py-2 shadow-sm transition-all duration-300 focus-within:border-[#5a00e8] focus-within:ring-2 focus-within:ring-[#5a00e8]/10 sm:w-[230px] sm:focus-within:w-[360px]"
                >
                  <Search size={16} className="shrink-0 text-slate-400" />

                  <input
                    type="text"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search scenario"
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] outline-none placeholder:text-slate-400"
                  />

                  {searchInput || searchTerm ? (
                    <button
                      type="button"
                      onClick={clearScenarioSearch}
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#5a00e8] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#4c00c7]"
                  >
                    Search
                  </button>
                </form>

                <button
                  type="button"
                  onClick={startCreate}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5a00e8] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#4c00c7] sm:w-auto"
                >
                  <Plus size={16} />
                  <span>Add Scenario</span>
                </button>
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <p className="text-slate-600">Loading scenarios...</p>
              ) : scenarios.length === 0 ? (
                <p className="text-[15px] text-slate-600">
                  No scenarios found. Add your first one.
                </p>
              ) : filteredScenarios.length === 0 ? (
                <p className="text-[15px] text-slate-600">
                  No scenarios found matching "{searchTerm}".
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredScenarios.map((scenario) => (
                    <AdminCard
                      key={scenario.scenarioId}
                      className="border border-[#dbe6f5] p-3.5 md:p-5"
                    >
                      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-[17px] font-bold leading-tight text-[#0f172a] md:text-[24px]">
                              {scenario.title}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                                scenario.isActive
                                  ? "bg-[#eafaf3] text-[#10b981]"
                                  : "bg-[#fff7ed] text-[#b45309]"
                              }`}
                            >
                              {scenario.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <p className="mt-1.5 text-[13px] leading-6 text-slate-600 md:mt-2 md:text-[15px]">
                            {scenario.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                          <button
                            type="button"
                            onClick={() => startEdit(scenario)}
                            className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#dbe6f5] bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 transition hover:bg-[#f8fbff] sm:w-auto sm:py-1"
                          >
                            <Pencil size={13} />
                            <span>Edit</span>
                          </button>

                          {scenario.isActive ? (
                            <button
                              type="button"
                              onClick={() => requestDeactivate(scenario)}
                              className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#fecaca] bg-[#fff5f5] px-3 py-2 text-[12px] font-semibold text-[#dc2626] transition hover:bg-[#ffebeb] sm:w-auto sm:py-1"
                            >
                              <Trash2 size={13} />
                              <span>Set Inactive</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => requestActivate(scenario)}
                              className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#cfe0ff] bg-white px-3 py-2 text-[12px] font-semibold text-[#2563eb] transition hover:bg-[#f5f9ff] sm:w-auto sm:py-1"
                            >
                              <CheckCircle2 size={13} />
                              <span>Set Active</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 rounded-[18px] bg-[#f8fbff] px-3 py-3 md:px-4 md:py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          Choices ({scenario.choices.length})
                        </p>

                        <div className="mt-2 divide-y divide-[#e8eef8]">
                          {[...scenario.choices]
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((choice, index) => (
                              <div
                                key={choice.scenarioChoiceId}
                                className="grid gap-2 py-2.5 first:pt-0 last:pb-0 md:grid-cols-[28px_minmax(0,1fr)_230px] md:items-start md:gap-3"
                              >
                                <div className="text-[13px] font-semibold text-slate-400">
                                  {index + 1}
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[14px] leading-6 text-[#334155] md:text-[15px]">
                                    {choice.optionText}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ${getMoneyToneClass(
                                      choice.moneyImpact,
                                    )}`}
                                  >
                                    {formatSignedMoney(choice.moneyImpact)}
                                  </span>

                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ${getConfidenceToneClass(
                                      choice.confidenceImpact,
                                    )}`}
                                  >
                                    {formatSignedConfidence(
                                      choice.confidenceImpact,
                                    )}{" "}
                                    confidence
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end pr-1">
                        <p className="text-[12px] text-slate-400">
                          Updated: {scenario.updatedAt}
                        </p>
                      </div>
                    </AdminCard>
                  ))}
                </div>
              )}
            </div>
          </AdminCard>
        ) : (
          <AdminCard className="p-4 md:p-6">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                  Scenario Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-[#dbe6f5] bg-[#f8fbff] px-4 py-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:bg-white"
                  placeholder="Enter scenario title"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-2xl border border-[#dbe6f5] bg-[#f8fbff] px-4 py-3 text-[15px] leading-7 text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:bg-white"
                  placeholder="Explain the scenario"
                />
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-slate-700">
                  Choices
                </h3>

                <div className="mt-3 space-y-4">
                  {form.choices.map((choice, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-[#e3ebf8] bg-[#f8fbff] p-4 md:p-5"
                    >
                      <h4 className="text-[14px] font-semibold text-[#0f172a]">
                        Choice {index + 1}
                      </h4>

                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="mb-2 block text-[12px] font-medium text-slate-500">
                            Option Text
                          </label>
                          <input
                            type="text"
                            value={choice.optionText}
                            onChange={(e) =>
                              updateChoiceField(
                                index,
                                "optionText",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-xl border border-[#dbe6f5] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                            placeholder="What the user can choose"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-[12px] font-medium text-slate-500">
                              Money Impact ($)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={choice.moneyImpact}
                              onChange={(e) =>
                                updateChoiceField(
                                  index,
                                  "moneyImpact",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-xl border border-[#dbe6f5] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-[12px] font-medium text-slate-500">
                              Confidence Impact (%)
                            </label>
                            <input
                              type="number"
                              value={choice.confidenceImpact}
                              onChange={(e) =>
                                updateChoiceField(
                                  index,
                                  "confidenceImpact",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-xl border border-[#dbe6f5] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-[12px] font-medium text-slate-500">
                            Result Text
                          </label>
                          <textarea
                            value={choice.resultText}
                            onChange={(e) =>
                              updateChoiceField(
                                index,
                                "resultText",
                                e.target.value,
                              )
                            }
                            rows={3}
                            className="w-full rounded-xl border border-[#dbe6f5] bg-white px-4 py-3 text-[14px] leading-6 text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                            placeholder="Immediate outcome shown after the user chooses this option"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-[12px] font-medium text-slate-500">
                            Lesson Text (Optional)
                          </label>
                          <textarea
                            value={choice.lessonText}
                            onChange={(e) =>
                              updateChoiceField(
                                index,
                                "lessonText",
                                e.target.value,
                              )
                            }
                            rows={3}
                            className="w-full rounded-xl border border-[#dbe6f5] bg-white px-4 py-3 text-[14px] leading-6 text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                            placeholder="Optional takeaway or lesson shown after the result"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-[#e6edf8] pt-4 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] px-5 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                >
                  <Save size={16} />
                  <span>
                    {saving
                      ? "Saving..."
                      : view === "edit"
                        ? "Save Scenario"
                        : "Create Scenario"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setView("list");
                    setEditingScenarioId(null);
                    setPendingStatusAction(null);
                    setError("");
                    setForm(createEmptyForm());
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-[#dbe6f5] bg-white px-5 py-3 text-[14px] font-semibold text-slate-700 transition hover:bg-[#f8fbff] sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </AdminCard>
        )}
      </div>

      <ScenarioStatusModal
        open={!!pendingStatusAction}
        mode={pendingStatusAction?.mode ?? "deactivate"}
        scenarioTitle={pendingStatusAction?.scenario.title ?? ""}
        loading={statusUpdating}
        onClose={closeStatusModal}
        onConfirm={confirmStatusAction}
      />
    </AdminLayout>
  );
}
