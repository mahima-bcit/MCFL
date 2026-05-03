import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Save,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import AdminCard from "../ui/AdminCard";
import { formatDateTimeForCsv } from "../../../utils/csvExport";
import {
  createAdminScenario,
  deactivateAdminScenario,
  getManageScenarios,
  updateAdminScenario,
} from "../../../services/adminScenariosApi";
import type {
  AdminManageScenario,
  AdminUpsertScenarioRequest,
} from "../../../types/adminScenarios";

type Props = {
  open: boolean;
  onClose: () => void;
  onChanged: () => Promise<void> | void;
};

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
    (a, b) => a.sortOrder - b.sortOrder
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
  return "bg-slate-100 text-slate-700";
}

export default function ManageScenariosModal({
  open,
  onClose,
  onChanged,
}: Props) {
  const [scenarios, setScenarios] = useState<AdminManageScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingScenarioId, setEditingScenarioId] = useState<number | null>(
    null
  );
  const [form, setForm] = useState<ScenarioFormState>(createEmptyForm());

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    void loadScenarios();

    return () => {
      document.body.style.overflow = originalOverflow;
      setView("list");
      setEditingScenarioId(null);
      setError("");
      setForm(createEmptyForm());
    };
  }, [open]);

  async function loadScenarios() {
    try {
      setLoading(true);
      setError("");
      const result = await getManageScenarios();
      setScenarios(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load scenarios."
      );
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setView("create");
    setEditingScenarioId(null);
    setForm(createEmptyForm());
    setError("");
  }

  function startEdit(scenario: AdminManageScenario) {
    setView("edit");
    setEditingScenarioId(scenario.scenarioId);
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
    value: string
  ) {
    setForm((current) => ({
      ...current,
      choices: current.choices.map((choice, choiceIndex) =>
        choiceIndex === index ? { ...choice, [field]: value } : choice
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
        lessonText: choice.lessonText.trim(),
        moneyImpact: Number(choice.moneyImpact || 0),
        confidenceImpact: Number(choice.confidenceImpact || 0),
      })),
    };

    if (!payload.title || !payload.description) {
      setError("Title and description are required.");
      return;
    }

    if (
      payload.choices.some(
        (choice) =>
          !choice.optionText || !choice.resultText || !choice.lessonText
      )
    ) {
      setError("All three choices must be fully completed.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (view === "edit" && editingScenarioId) {
        await updateAdminScenario(editingScenarioId, payload);
      } else {
        await createAdminScenario(payload);
      }

      await loadScenarios();
      await Promise.resolve(onChanged());
      setView("list");
      setEditingScenarioId(null);
      setForm(createEmptyForm());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save scenario.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(scenario: AdminManageScenario) {
    const confirmed = window.confirm(
      `Deactivate "${scenario.title}"? This will hide it from active scenario reporting.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await deactivateAdminScenario(scenario.scenarioId);
      await loadScenarios();
      await Promise.resolve(onChanged());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to deactivate scenario."
      );
    }
  }

  if (!open) {
    return null;
  }

  const modalTitle =
    view === "list"
      ? "Manage Scenarios"
      : view === "create"
        ? "Add Scenario"
        : "Edit Scenario";

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full px-4 py-4 md:flex md:items-center md:justify-center md:p-8">
          <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col rounded-[28px] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.2)] md:min-h-0 md:max-h-[90vh]">
            <div className="sticky top-0 z-10 border-b border-[#dbe6f5] bg-white/95 px-4 py-4 backdrop-blur md:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {view !== "list" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setView("list");
                          setEditingScenarioId(null);
                          setError("");
                        }}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe6f5] bg-[#f5f8fc] text-slate-700 transition hover:bg-[#edf3fd]"
                        aria-label="Back"
                      >
                        <ArrowLeft size={16} />
                      </button>
                    ) : null}

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
                      <Settings2 size={18} className="text-[#2563eb]" />
                    </div>

                    <div>
                      <h2 className="text-[20px] font-semibold text-[#0f172a]">
                        {modalTitle}
                      </h2>
                      <p className="mt-1 text-[13px] text-slate-500">
                        {view === "list"
                          ? "Create, update, and deactivate scenarios used in the app."
                          : "Keep all three choices complete before saving."}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe6f5] bg-[#f5f8fc] text-slate-700 transition hover:bg-[#edf3fd]"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
              {view === "list" ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="max-w-2xl text-[14px] text-slate-500">
                      Active scenarios are shown here with their current choices
                      and money/confidence impacts.
                    </p>

                    <button
                      type="button"
                      onClick={startCreate}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563eb] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
                    >
                      <Plus size={16} />
                      <span>Add Scenario</span>
                    </button>
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600">
                      {error}
                    </div>
                  ) : null}

                  {loading ? (
                    <p className="text-slate-600">Loading scenarios...</p>
                  ) : scenarios.length === 0 ? (
                    <AdminCard className="p-5">
                      <p className="text-[15px] text-slate-600">
                        No scenarios found. Add your first one.
                      </p>
                    </AdminCard>
                  ) : (
                    <div className="space-y-3">
                      {scenarios.map((scenario) => (
                        <AdminCard key={scenario.scenarioId} className="p-4 md:p-5">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-[18px] font-semibold text-[#0f172a]">
                                  {scenario.title}
                                </h3>
                                <span className="rounded-full bg-[#eafaf3] px-2.5 py-1 text-[11px] font-semibold text-[#10b981]">
                                  Active
                                </span>
                              </div>

                              <p className="mt-2 text-[14px] leading-6 text-slate-600">
                                {scenario.description}
                              </p>

                              <p className="mt-2 text-[12px] text-slate-400">
                                Updated: {formatDateTimeForCsv(scenario.updatedAt)}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(scenario)}
                                className="inline-flex items-center gap-2 rounded-full border border-[#dbe6f5] bg-white px-4 py-2 text-[14px] font-semibold text-slate-700 transition hover:bg-[#f8fbff]"
                              >
                                <Pencil size={15} />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeactivate(scenario)}
                                className="inline-flex items-center gap-2 rounded-full border border-[#fde2e2] bg-[#fff5f5] px-4 py-2 text-[14px] font-semibold text-[#dc2626] transition hover:bg-[#ffebeb]"
                              >
                                <Trash2 size={15} />
                                <span>Deactivate</span>
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            {scenario.choices
                              .sort((a, b) => a.sortOrder - b.sortOrder)
                              .map((choice, index) => (
                                <div
                                  key={choice.scenarioChoiceId}
                                  className="rounded-2xl bg-[#f5f8fc] p-3"
                                >
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    Choice {index + 1}
                                  </p>

                                  <p className="mt-2 text-[14px] font-medium text-[#0f172a]">
                                    {choice.optionText}
                                  </p>

                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <span
                                      className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${getMoneyToneClass(
                                        choice.moneyImpact
                                      )}`}
                                    >
                                      {formatSignedMoney(choice.moneyImpact)}
                                    </span>

                                    <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[12px] font-semibold text-[#2563eb]">
                                      {formatSignedConfidence(
                                        choice.confidenceImpact
                                      )} confidence
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </AdminCard>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600">
                      {error}
                    </div>
                  ) : null}

                  <AdminCard className="p-4 md:p-5">
                    <div className="grid gap-4">
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
                          className="w-full rounded-2xl border border-[#dbe6f5] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#2563eb]"
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
                          className="w-full rounded-2xl border border-[#dbe6f5] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                          placeholder="Explain the scenario"
                        />
                      </div>
                    </div>
                  </AdminCard>

                  <div className="grid gap-4 xl:grid-cols-3">
                    {form.choices.map((choice, index) => (
                      <AdminCard key={index} className="p-4 md:p-5">
                        <h3 className="text-[16px] font-semibold text-[#0f172a]">
                          Choice {index + 1}
                        </h3>

                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                              Option Text
                            </label>
                            <input
                              type="text"
                              value={choice.optionText}
                              onChange={(e) =>
                                updateChoiceField(
                                  index,
                                  "optionText",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-2xl border border-[#dbe6f5] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                              placeholder="What the user can choose"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                              Result Text
                            </label>
                            <textarea
                              value={choice.resultText}
                              onChange={(e) =>
                                updateChoiceField(
                                  index,
                                  "resultText",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className="w-full rounded-2xl border border-[#dbe6f5] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                              placeholder="Immediate result shown to the user"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                              Lesson Text
                            </label>
                            <textarea
                              value={choice.lessonText}
                              onChange={(e) =>
                                updateChoiceField(
                                  index,
                                  "lessonText",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className="w-full rounded-2xl border border-[#dbe6f5] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                              placeholder="Learning takeaway"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                                Money Impact
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={choice.moneyImpact}
                                onChange={(e) =>
                                  updateChoiceField(
                                    index,
                                    "moneyImpact",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-2xl border border-[#dbe6f5] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                                Confidence Impact
                              </label>
                              <input
                                type="number"
                                value={choice.confidenceImpact}
                                onChange={(e) =>
                                  updateChoiceField(
                                    index,
                                    "confidenceImpact",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-2xl border border-[#dbe6f5] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                              />
                            </div>
                          </div>
                        </div>
                      </AdminCard>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setView("list");
                        setEditingScenarioId(null);
                        setError("");
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dbe6f5] bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-[#f8fbff]"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563eb] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={16} />
                      <span>
                        {saving
                          ? "Saving..."
                          : view === "edit"
                            ? "Save Changes"
                            : "Create Scenario"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}