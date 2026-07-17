"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, RotateCcw, FileText, Users, LineChart as LineChartIcon, CheckCircle2, Globe, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: string;
    agentKey: string;
    status: string;
    deliverableType: string | null;
    deliverableContent: string | null;
  };
  projectId: string;
  onAction: (taskId: string, action: "approve" | "revise") => void;
}

const agentMeta: Record<string, { name: string; role: string; icon: any }> = {
  planner: { name: "Planner Agent", role: "Business Strategist", icon: BrainCircuit },
  marketing: { name: "Marketing Agent", role: "Growth Marketer", icon: Users },
  finance: { name: "Finance Agent", role: "Financial Analyst", icon: LineChartIcon },
  operations: { name: "Operations Agent", role: "Operations Manager", icon: CheckCircle2 },
  website: { name: "Website Agent", role: "Web Developer", icon: Globe },
};

function parseDeliverable(content: string | null): any {
  if (!content) return null;
  try {
    // Try parsing as JSON directly
    return JSON.parse(content);
  } catch {
    // Try extracting JSON from markdown code fences
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ═══ Deliverable Renderers ═══

function PlannerDeliverable({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <Section title="Business Concept">
        <p className="text-[#0A121A]/70 leading-relaxed">{data.businessConcept}</p>
      </Section>

      <Section title="Brand Identity">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard label="Suggested Name" value={data.brandIdentity?.suggestedName} />
          <InfoCard label="Tagline" value={data.brandIdentity?.tagline} />
          <InfoCard label="Personality" value={data.brandIdentity?.personality} />
        </div>
      </Section>

      <Section title="Target Market">
        <p className="text-[#0A121A]/70 leading-relaxed">{data.targetMarket}</p>
      </Section>

      <Section title="Competitive Edge">
        <p className="text-[#0A121A]/70 leading-relaxed">{data.competitiveEdge}</p>
      </Section>

      <Section title="Revenue Streams">
        <div className="flex flex-wrap gap-2">
          {data.revenueStreams?.map((s: string, i: number) => (
            <span key={i} className="px-3 py-1.5 rounded-full bg-[#4F7CFF]/10 text-[#4F7CFF] text-sm font-bold border border-[#4F7CFF]/20">{s}</span>
          ))}
        </div>
      </Section>

      <Section title="90-Day Launch Roadmap">
        <div className="space-y-4">
          {data.launchRoadmap?.map((phase: any, i: number) => (
            <div key={i} className="p-4 rounded-2xl bg-white/60 border border-white/80">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#4F7CFF] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <div>
                  <h5 className="font-bold text-[#0A121A] text-sm">{phase.phase}</h5>
                  <span className="text-xs text-[#0A121A]/50 font-medium">{phase.weeks}</span>
                </div>
              </div>
              <ul className="ml-11 space-y-1">
                {phase.actions?.map((a: string, j: number) => (
                  <li key={j} className="text-sm text-[#0A121A]/70 flex items-start gap-2">
                    <span className="text-[#42D392] mt-1">•</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Key Success Metrics">
        <div className="flex flex-wrap gap-2">
          {data.successMetrics?.map((m: string, i: number) => (
            <span key={i} className="px-3 py-1.5 rounded-full bg-[#42D392]/10 text-[#42D392] text-sm font-bold border border-[#42D392]/20">{m}</span>
          ))}
        </div>
      </Section>
    </div>
  );
}

function MarketingDeliverable({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <Section title="Brand Voice">
        <p className="text-[#0A121A]/70 leading-relaxed">{data.brandVoice}</p>
      </Section>

      <Section title="Campaign Strategy">
        <p className="text-[#0A121A]/70 leading-relaxed">{data.campaignStrategy}</p>
      </Section>

      <Section title="Scheduled Posts">
        <div className="space-y-4">
          {data.posts?.map((post: any, i: number) => (
            <div key={i} className="p-5 rounded-2xl bg-white/60 border border-white/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#7B5CFF]/10 text-[#7B5CFF] border border-[#7B5CFF]/20">{post.platform}</span>
                <span className="text-xs text-[#0A121A]/50 font-medium">{post.scheduledDay} · {post.scheduledTime}</span>
              </div>
              <h5 className="font-bold text-[#0A121A]">{post.headline}</h5>
              <p className="text-sm text-[#0A121A]/70 leading-relaxed">{post.body}</p>
              <div className="flex flex-wrap gap-1.5">
                {post.hashtags?.map((tag: string, j: number) => (
                  <span key={j} className="text-xs font-bold text-[#4F7CFF] bg-[#4F7CFF]/5 px-2 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function FinanceDeliverable({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoCard label="Projected Investment" value={data.projectedInvestment} color="text-[#4F7CFF]" />
        <InfoCard label="Monthly Burn" value={data.monthlyBurn} color="text-[#FF6B81]" />
        <InfoCard label="Break-Even" value={data.breakEvenMonth} color="text-[#42D392]" />
      </div>

      <Section title="12-Month Revenue vs Expenses">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyProjections} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(10,18,26,0.05)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "rgba(10,18,26,0.4)", fontSize: 11, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(10,18,26,0.4)", fontSize: 11, fontWeight: 600 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#42D392" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="expenses" stroke="#FF6B81" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="Startup Cost Breakdown">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.startupCosts} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="rgba(10,18,26,0.05)" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "rgba(10,18,26,0.4)", fontSize: 11, fontWeight: 600 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: "rgba(10,18,26,0.6)", fontSize: 11, fontWeight: 700 }} width={120} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.9)" }} />
              <Bar dataKey="amount" fill="#4F7CFF" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>
    </div>
  );
}

function OperationsDeliverable({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <Section title="Supplier & Inventory Checklist">
        <div className="space-y-2">
          {data.supplierChecklist?.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-white/80">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.priority === "High" ? "bg-[#FF6B81]/10 text-[#FF6B81]" : item.priority === "Medium" ? "bg-[#F7B955]/10 text-[#F7B955]" : "bg-[#0A121A]/5 text-[#0A121A]/50"}`}>
                  {item.priority}
                </span>
                <span className="font-bold text-[#0A121A] text-sm">{item.item}</span>
              </div>
              <span className="text-sm font-bold text-[#4F7CFF]">{item.estimatedCost}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Daily Standard Operating Procedure">
        <div className="space-y-3">
          {data.dailySOP?.map((step: any, i: number) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/60 border border-white/80">
              <span className="w-8 h-8 rounded-full bg-[#4F7CFF] text-white text-xs font-bold flex items-center justify-center shrink-0">{step.step}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#0A121A] text-sm">{step.task}</span>
                  <span className="text-xs text-[#0A121A]/50 font-medium">{step.time}</span>
                </div>
                <span className="text-xs text-[#7B5CFF] font-bold bg-[#7B5CFF]/10 px-2 py-0.5 rounded">{step.responsible}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Quality Control Checklist">
        <div className="space-y-2">
          {data.qualityChecklist?.map((item: any, i: number) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/60 border border-white/80">
              <CheckCircle2 className="w-5 h-5 text-[#42D392] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0A121A] text-sm block">{item.item}</span>
                <span className="text-xs text-[#0A121A]/50 font-medium">{item.frequency} · {item.standard}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function WebsiteDeliverable({ data }: { data: any }) {
  return (
    <div className="space-y-2">
      {/* Mini Landing Page Preview */}
      <div className="rounded-2xl overflow-hidden border border-white/80 bg-gradient-to-br from-[#0A121A] to-[#1a2a3a]">
        {/* Hero */}
        <div className="p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">{data.hero?.headline}</h2>
          <p className="text-white/60 max-w-lg mx-auto mb-6">{data.hero?.subheadline}</p>
          <div className="flex gap-3 justify-center">
            <span className="px-6 py-3 bg-[#4F7CFF] text-white rounded-xl font-bold text-sm">{data.hero?.ctaText}</span>
            <span className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold text-sm border border-white/20">{data.hero?.ctaSecondary}</span>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.features?.map((f: any, i: number) => (
            <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-2xl mb-2 block">{f.icon}</span>
              <h5 className="font-bold text-white text-sm mb-1">{f.title}</h5>
              <p className="text-white/50 text-xs">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="p-8">
          <h4 className="text-center text-white/50 text-xs uppercase tracking-widest font-bold mb-6">What customers say</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.testimonials?.map((t: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/70 text-xs mb-3 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-white text-xs font-bold">{t.name}</p>
                  <p className="text-white/40 text-[10px]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white/5 p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.pricing?.map((p: any, i: number) => (
              <div key={i} className={`p-5 rounded-xl border ${p.highlighted ? "bg-[#4F7CFF]/20 border-[#4F7CFF]/40" : "bg-white/5 border-white/10"}`}>
                <h5 className="font-bold text-white text-sm">{p.plan}</h5>
                <p className="text-2xl font-bold text-white my-2">{p.price}</p>
                <ul className="space-y-1">
                  {p.features?.map((f: string, j: number) => (
                    <li key={j} className="text-white/60 text-xs flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#42D392]" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center border-t border-white/10">
          <p className="text-white/40 text-xs">{data.footer?.tagline}</p>
        </div>
      </div>
    </div>
  );
}

// ═══ Helper Components ═══

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-lg font-bold text-[#0A121A] mb-4 tracking-tight">{title}</h4>
      {children}
    </div>
  );
}

function InfoCard({ label, value, color = "text-[#0A121A]" }: { label: string; value?: string; color?: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/60 border border-white/80">
      <p className="text-[10px] uppercase tracking-widest font-bold text-[#0A121A]/40 mb-1">{label}</p>
      <p className={`font-bold text-lg ${color}`}>{value || "—"}</p>
    </div>
  );
}

// ═══ Main Modal ═══

export function ReviewModal({ isOpen, onClose, task, projectId, onAction }: ReviewModalProps) {
  const [isActioning, setIsActioning] = useState(false);
  const meta = agentMeta[task.agentKey] || agentMeta.planner;
  const Icon = meta.icon;
  const data = parseDeliverable(task.deliverableContent);

  const handleAction = async (action: "approve" | "revise") => {
    setIsActioning(true);
    await onAction(task.id, action);
    setIsActioning(false);
    if (action === "approve") onClose();
  };

  const renderDeliverable = () => {
    if (!data) {
      return <p className="text-[#0A121A]/50 text-center py-12">No deliverable content available.</p>;
    }
    switch (task.agentKey) {
      case "planner": return <PlannerDeliverable data={data} />;
      case "marketing": return <MarketingDeliverable data={data} />;
      case "finance": return <FinanceDeliverable data={data} />;
      case "operations": return <OperationsDeliverable data={data} />;
      case "website": return <WebsiteDeliverable data={data} />;
      default: return <pre className="text-sm whitespace-pre-wrap">{task.deliverableContent}</pre>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl bg-[#FCFDFF] border border-white/60 shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#0A121A]/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4F7CFF]/10 border border-[#4F7CFF]/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#4F7CFF]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A121A] text-lg tracking-tight">{task.deliverableType}</h3>
                  <p className="text-sm text-[#0A121A]/50 font-medium">Produced by {meta.name} ({meta.role})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border ${
                  task.status === "approved" ? "bg-[#42D392]/10 text-[#42D392] border-[#42D392]/20" :
                  task.status === "needs_review" ? "bg-[#F7B955]/10 text-[#F7B955] border-[#F7B955]/20" :
                  "bg-[#4F7CFF]/10 text-[#4F7CFF] border-[#4F7CFF]/20"
                }`}>
                  {task.status === "needs_review" ? "Awaiting Approval" : task.status === "approved" ? "Approved" : task.status}
                </span>
                <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-[#0A121A]/5 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-[#0A121A]/50" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {renderDeliverable()}
            </div>

            {/* Footer */}
            {(task.status === "needs_review") && (
              <div className="p-6 border-t border-[#0A121A]/5 flex justify-end gap-3 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => handleAction("revise")}
                  disabled={isActioning}
                  className="rounded-xl h-12 px-6 font-bold bg-white/40 hover:bg-white border-white/60"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Request Revision
                </Button>
                <Button
                  onClick={() => handleAction("approve")}
                  disabled={isActioning}
                  className="rounded-xl h-12 px-6 font-bold shadow-[0_10px_20px_rgba(79,124,255,0.2)]"
                >
                  <Check className="w-4 h-4 mr-2" /> Approve Work
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
