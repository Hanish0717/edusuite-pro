import { useState } from "react";
import {
  GitBranch,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";
import { WorkflowTemplate, WorkflowTemplateStage, RiskLevel, WorkflowDomainCategory } from "@/types/approval";
import { toast } from "sonner";

interface WorkflowBuilderProps {
  templates: WorkflowTemplate[];
  onSaveTemplate: (template: WorkflowTemplate) => void;
}

const AVAILABLE_ROLES = [
  { role: "Faculty", flagRequired: undefined, label: "Faculty Initiation" },
  { role: "HOD", flagRequired: "isHod", label: "HOD Academic Review" },
  { role: "Dean", flagRequired: "isDean", label: "Dean Endorsement" },
  { role: "HR", flagRequired: "isHRManager", label: "HR Leave Sign-off" },
  { role: "Finance Officer", flagRequired: "isFinanceOfficer", label: "Finance Budget Audit" },
  { role: "Purchase Officer", flagRequired: "isPurchaseOfficer", label: "Purchase Vendor Clearance" },
  { role: "Exam Controller", flagRequired: "isExamController", label: "Exam Board Moderation" },
  { role: "Principal", flagRequired: "isPrincipal", label: "Principal Executive Seal" },
  { role: "Registrar", flagRequired: "isRegistrar", label: "Registrar Seal & Dispatch" },
];

export function WorkflowBuilder({ templates, onSaveTemplate }: WorkflowBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(
    templates[0] || null
  );

  // Form State
  const [title, setTitle] = useState(selectedTemplate?.title || "");
  const [category, setCategory] = useState(selectedTemplate?.category || "");
  const [domainCategory, setDomainCategory] = useState<WorkflowDomainCategory>(
    selectedTemplate?.domainCategory || "Academic"
  );
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(selectedTemplate?.riskLevel || "Low");
  const [defaultSlaHours, setDefaultSlaHours] = useState(selectedTemplate?.defaultSlaHours || 24);
  const [version, setVersion] = useState(selectedTemplate?.version || "v1.0");
  const [description, setDescription] = useState(selectedTemplate?.description || "");
  const [stages, setStages] = useState<WorkflowTemplateStage[]>(
    selectedTemplate?.stages || [
      { id: "s1", role: "Faculty", label: "Faculty Initiation", slaHours: 4 },
      { id: "s2", role: "HOD", label: "HOD Review", flagRequired: "isHod", slaHours: 12 },
    ]
  );

  const handleSelectTemplate = (tmpl: WorkflowTemplate) => {
    setSelectedTemplate(tmpl);
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    setDomainCategory(tmpl.domainCategory);
    setRiskLevel(tmpl.riskLevel);
    setDefaultSlaHours(tmpl.defaultSlaHours);
    setVersion(tmpl.version);
    setDescription(tmpl.description);
    setStages(tmpl.stages);
  };

  const handleNewTemplate = () => {
    const newTmpl: WorkflowTemplate = {
      id: `TMPL-NEW-${Date.now()}`,
      title: "New Custom Workflow",
      category: "General Approval",
      domainCategory: "Academic",
      riskLevel: "Low",
      defaultSlaHours: 24,
      version: "v1.0",
      description: "Define approval hierarchy and role stages.",
      stages: [
        { id: "s1", role: "Faculty", label: "Faculty Initiation", slaHours: 4 },
        { id: "s2", role: "HOD", label: "HOD Review", flagRequired: "isHod", slaHours: 12 },
      ],
    };
    handleSelectTemplate(newTmpl);
  };

  const addStage = (roleObj: typeof AVAILABLE_ROLES[0]) => {
    const newStage: WorkflowTemplateStage = {
      id: `stage-${Date.now()}`,
      role: roleObj.role,
      label: roleObj.label,
      flagRequired: roleObj.flagRequired,
      slaHours: 12,
    };
    setStages([...stages, newStage]);
  };

  const removeStage = (idx: number) => {
    if (stages.length <= 1) {
      toast.error("A workflow must have at least 1 stage.");
      return;
    }
    setStages(stages.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim()) {
      toast.error("Please fill in title and category.");
      return;
    }

    const updated: WorkflowTemplate = {
      id: selectedTemplate?.id || `TMPL-${Date.now()}`,
      title,
      category,
      domainCategory,
      riskLevel,
      defaultSlaHours,
      version,
      description,
      stages,
    };

    onSaveTemplate(updated);
    toast.success(`Workflow Template "${title}" (${version}) saved successfully!`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* LEFT COLUMN: TEMPLATE LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-extrabold flex items-center gap-2">
            <GitBranch className="size-4 text-primary" /> Workflow Templates
          </h3>
          <Button
            size="sm"
            onClick={handleNewTemplate}
            className="bg-brand-gradient text-xs cursor-pointer gap-1.5 font-bold"
          >
            <Plus className="size-3.5" /> Create Template
          </Button>
        </div>

        <div className="space-y-2.5">
          {templates.map((tmpl) => {
            const isSelected = selectedTemplate?.id === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                    : "border-border/80 bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="font-mono text-[0.65rem]">
                    {tmpl.id}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary text-[0.65rem] font-mono">
                    {tmpl.version}
                  </Badge>
                </div>
                <h4 className="font-bold text-xs text-foreground">{tmpl.title}</h4>
                <p className="text-[0.7rem] text-muted-foreground mt-0.5">
                  {tmpl.stages.length} Stages • {tmpl.domainCategory}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT TWO COLUMNS: VISUAL WORKFLOW BUILDER FORM */}
      <div className="md:col-span-2 space-y-6">
        <Panel
          title="Visual Workflow Builder & Design Studio"
          description="Configure multi-stage approval hierarchy, role assignments, SLA timeouts, and risk tiers"
          action={
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-brand-gradient text-xs font-bold cursor-pointer gap-1.5"
            >
              <Save className="size-4" /> Save & Publish Template
            </Button>
          }
        >
          <form onSubmit={handleSave} className="space-y-6">
            {/* GENERAL METADATA GRID */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Workflow Title:
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab Equipment Procurement"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Category Name:
                </label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Purchases & Procurement"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Domain Category:
                </label>
                <select
                  value={domainCategory}
                  onChange={(e) => setDomainCategory(e.target.value as WorkflowDomainCategory)}
                  className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="Academic">Academic</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Administration">Administration</option>
                  <option value="Student Services">Student Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Risk Severity Classification:
                </label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                  className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Critical">Critical Severity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Default SLA Timeout (Hours):
                </label>
                <Input
                  type="number"
                  value={defaultSlaHours}
                  onChange={(e) => setDefaultSlaHours(Number(e.target.value))}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Template Version:
                </label>
                <Input
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. v2.1"
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Workflow Description:
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the purpose and operational scope of this workflow..."
                className="text-xs"
              />
            </div>

            {/* VISUAL STAGE SEQUENCE BUILDER */}
            <div className="space-y-3 pt-2 border-t border-border/80">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xs font-extrabold flex items-center gap-2">
                  <Layers className="size-4 text-primary" /> Approval Sequence & Role Stages ({stages.length} Steps)
                </h4>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[0.68rem] text-muted-foreground mr-1">Add Role Stage:</span>
                  {AVAILABLE_ROLES.map((r) => (
                    <Button
                      key={r.role}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addStage(r)}
                      className="text-[0.65rem] h-7 px-2 cursor-pointer font-bold gap-1"
                    >
                      <Plus className="size-3" /> {r.role}
                    </Button>
                  ))}
                </div>
              </div>

              {/* VISUAL FLOW DIAGRAM STAGES */}
              <div className="space-y-3">
                {stages.map((st, idx) => (
                  <div
                    key={st.id || idx}
                    className="p-3.5 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <Input
                            value={st.label}
                            onChange={(e) => {
                              const next = [...stages];
                              next[idx].label = e.target.value;
                              setStages(next);
                            }}
                            className="h-7 text-xs font-bold w-48"
                          />
                          <Badge variant="outline" className="font-mono text-[0.65rem]">
                            Role: {st.role}
                          </Badge>
                        </div>
                        <p className="text-[0.68rem] text-muted-foreground mt-1">
                          Privilege Flag: <code className="text-primary font-mono">{st.flagRequired || "None (Open)"}</code>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5 text-muted-foreground" />
                        <Input
                          type="number"
                          value={st.slaHours}
                          onChange={(e) => {
                            const next = [...stages];
                            next[idx].slaHours = Number(e.target.value);
                            setStages(next);
                          }}
                          className="h-7 text-xs font-mono w-16 text-center"
                        />
                        <span className="text-[0.7rem]">Hours SLA</span>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeStage(idx)}
                        className="text-destructive hover:bg-destructive/10 cursor-pointer h-7 w-7 p-0"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
