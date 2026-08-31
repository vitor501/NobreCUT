import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Scissors, ChevronLeft, LogOut, Check, Crown,
  Zap, Shield, ChevronRight, X, Star,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  tag?: string;
  cuts: number;
  treatment?: string;
  benefits: { icon: React.ReactNode; text: string }[];
}

const TREATMENTS = [
  "Hidratação Capilar",
  "Hidratação Facial",
  "Coloração",
  "Tratamento Anti-Queda",
];

const PLANS: Plan[] = [
  {
    id: "basico",
    name: "Básico",
    price: 90,
    cuts: 3,
    benefits: [
      { icon: <Scissors size={13} />, text: "3 cortes por mês" },
      { icon: <Shield size={13} />,   text: "Sem taxas" },
      { icon: <Zap size={13} />,      text: "Reagendamento gratuito" },
    ],
  },
  {
    id: "cut-clube",
    name: "Cut Clube",
    price: 100,
    cuts: 3,
    tag: "Popular",
    benefits: [
      { icon: <Scissors size={13} />, text: "3 cortes por mês" },
      { icon: <Star size={13} />,     text: "Agendamento prioritário" },
      { icon: <Zap size={13} />,      text: "Sem taxa de agendamento" },
      { icon: <Shield size={13} />,   text: "Reagendamento gratuito" },
      { icon: <Crown size={13} />,    text: "Acesso a barbeiros exclusivos" },
    ],
  },
  {
    id: "nobre",
    name: "Nobre Cut Club",
    price: 150,
    cuts: 4,
    tag: "Premium",
    treatment: "",
    benefits: [
      { icon: <Scissors size={13} />, text: "4 cortes por mês" },
      { icon: <Star size={13} />,     text: "Agendamento prioritário" },
      { icon: <Zap size={13} />,      text: "Sem taxa de agendamento" },
      { icon: <Shield size={13} />,   text: "Reagendamento gratuito" },
      { icon: <Crown size={13} />,    text: "Acesso a barbeiros exclusivos" },
      { icon: <Star size={13} />,     text: "1 tratamento especial à escolha" },
    ],
  },
];

const GOLD = "#c9a84c";

import { supabase } from "../../lib/supabase";

interface Props {
  user: { name: string; email: string; id?: string };
  subscribedPlan: string | null;
  onSubscribe: (planId: string) => void;
  onBack: () => void;
  onLogout: () => void;
}

export function PlansScreen({ user, subscribedPlan, onSubscribe, onBack, onLogout }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [step, setStep] = useState<"confirm" | "treatment" | "payment" | "success">("confirm");
  const [chosenTreatment, setChosenTreatment] = useState(TREATMENTS[0]);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const openModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep("confirm");
    setCard({ number: "", name: "", expiry: "", cvv: "" });
  };

  const closeModal = () => setSelectedPlan(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) return;
    
    try {
       const { data: { session } } = await supabase.auth.getSession();
       if (session) {
          // Desativa assinaturas anteriores
          await supabase
            .from('subscriptions')
            .update({ active: false })
            .eq('user_id', session.user.id);
            
          // Cria nova
          const { error } = await supabase.from('subscriptions').insert({
            user_id: session.user.id,
            plan_id: selectedPlan.id,
            treatment: selectedPlan.id === 'nobre' ? chosenTreatment : null,
            active: true
          });
          
          if (error) throw error;
       }
       
       setStep("success");
       onSubscribe(selectedPlan.id);
    } catch (err) {
       console.error("Erro na assinatura:", err);
       alert("Erro ao processar assinatura.");
    }
  };

  const formatCard   = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  const activePlan = PLANS.find((p) => p.id === subscribedPlan) ?? null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
        <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 flex items-center justify-center rounded-sm" style={{ backgroundColor: GOLD }}>
            <Scissors size={14} color="#0a0a0a" />
          </div>
          <span className="text-lg tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", letterSpacing: "0.2em" }}>
            Nobre Cut
          </span>
        </button>
        <button onClick={onLogout} className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity" style={{ color: "#8a8278" }}>
          <LogOut size={14} />
          Sair
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 mb-10 hover:opacity-70 transition-opacity" style={{ color: "#8a8278" }}>
          <ChevronLeft size={16} />
          <span className="text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>Voltar</span>
        </button>

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center mb-5">
            <div className="w-14 h-14 rounded-sm flex items-center justify-center" style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
              <Crown size={24} style={{ color: GOLD }} />
            </div>
          </div>
          <div className="w-10 h-px mx-auto mb-4" style={{ backgroundColor: GOLD }} />
          <h1 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "2.4rem" }}>
            Planos de Assinatura
          </h1>
          <p style={{ color: "#8a8278", fontSize: "0.95rem" }}>
            Escolha o plano ideal e economize em cada visita.
          </p>
        </div>

        {/* Active plan banner */}
        {activePlan && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-sm px-5 py-3 mb-10 max-w-lg mx-auto"
            style={{ backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            <Check size={15} style={{ color: GOLD, flexShrink: 0 }} />
            <p className="text-sm" style={{ color: "#f0ece4" }}>
              Você assina o <span style={{ color: GOLD }}>{activePlan.name}</span> — R$ {activePlan.price}/mês
            </p>
          </motion.div>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {PLANS.map((plan, i) => {
            const isActive = subscribedPlan === plan.id;
            const isNobre  = plan.id === "nobre";
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-sm overflow-hidden flex flex-col"
                style={{
                  backgroundColor: "#141414",
                  border: isActive
                    ? `1px solid ${GOLD}`
                    : isNobre
                    ? "1px solid rgba(201,168,76,0.3)"
                    : "1px solid rgba(201,168,76,0.1)",
                  position: "relative",
                }}
              >
                {/* Tag badge */}
                {plan.tag && (
                  <div
                    className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-sm"
                    style={{
                      backgroundColor: isNobre ? GOLD : "rgba(201,168,76,0.15)",
                      color: isNobre ? "#0a0a0a" : GOLD,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {plan.tag}
                  </div>
                )}

                {/* Top */}
                <div className="px-6 pt-7 pb-5 border-b" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1.5">
                    <span style={{ fontFamily: "'Playfair Display', serif", color: GOLD, fontSize: "2.4rem", lineHeight: 1 }}>
                      R$ {plan.price}
                    </span>
                    <span className="pb-1 text-xs" style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>/mês</span>
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: "#5a5248", fontFamily: "'DM Mono', monospace" }}>
                    Cancele quando quiser
                  </p>
                </div>

                {/* Benefits */}
                <div className="px-6 py-5 flex-1">
                  <div className="flex flex-col gap-2.5">
                    {plan.benefits.map((b, bi) => (
                      <div key={bi} className="flex items-center gap-2.5">
                        <div style={{ color: GOLD, flexShrink: 0 }}>{b.icon}</div>
                        <span className="text-sm" style={{ color: "#d0ccc4" }}>{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  {isActive ? (
                    <div
                      className="flex items-center justify-center gap-2 py-2.5 rounded-sm"
                      style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}
                    >
                      <Check size={14} style={{ color: GOLD }} />
                      <span className="text-xs" style={{ color: GOLD, fontFamily: "'DM Mono', monospace" }}>Plano ativo</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => openModal(plan)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-widest transition-all hover:opacity-90"
                      style={{
                        backgroundColor: isNobre ? GOLD : "transparent",
                        color: isNobre ? "#0a0a0a" : GOLD,
                        border: `1px solid ${GOLD}`,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      Assinar
                      <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-lg mx-auto">
          <p className="text-xs uppercase tracking-widest mb-4 text-center" style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>
            Dúvidas frequentes
          </p>
          {[
            { q: "Os cortes acumulam?", a: "Não. Os créditos são válidos apenas dentro do mês de referência." },
            { q: "Posso trocar de plano?", a: "Sim, a qualquer momento. O novo valor é aplicado no próximo ciclo." },
            { q: "Posso cancelar?", a: "Sim, quando quiser. O acesso permanece até o fim do período pago." },
          ].map((item) => (
            <div key={item.q} className="py-4 border-b" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
              <p className="text-sm mb-1" style={{ color: "#f0ece4" }}>{item.q}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#8a8278" }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center px-4 z-50"
            style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
            onClick={(e) => { if (e.target === e.currentTarget && step !== "success") closeModal(); }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-md rounded-sm overflow-hidden"
              style={{ backgroundColor: "#141414", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              {/* Modal header */}
              {step !== "success" && (
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
                  <div className="flex items-center gap-2">
                    <Crown size={14} style={{ color: GOLD }} />
                    <span className="text-sm" style={{ color: "#f0ece4", fontFamily: "'Playfair Display', serif" }}>
                      {step === "confirm" ? selectedPlan.name : step === "treatment" ? "Escolha o Tratamento" : "Pagamento"}
                    </span>
                  </div>
                  <button onClick={closeModal} style={{ color: "#8a8278" }}><X size={16} /></button>
                </div>
              )}

              {/* STEP: confirm */}
              {step === "confirm" && (
                <div className="px-6 py-6">
                  {[
                    { label: "Plano",         value: selectedPlan.name },
                    { label: "Cortes/mês",    value: String(selectedPlan.cuts) },
                    { label: "Total mensal",  value: `R$ ${selectedPlan.price},00`, gold: true },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                      <span className="text-xs" style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>{row.label}</span>
                      <span className="text-sm" style={{ color: row.gold ? GOLD : "#f0ece4", fontFamily: row.gold ? "'DM Mono', monospace" : undefined }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => setStep(selectedPlan.id === "nobre" ? "treatment" : "payment")}
                    className="w-full py-3 mt-6 text-sm uppercase tracking-widest hover:opacity-90 transition-all"
                    style={{ backgroundColor: GOLD, color: "#0a0a0a", fontFamily: "'DM Mono', monospace" }}
                  >
                    Continuar
                  </button>
                </div>
              )}

              {/* STEP: treatment (Nobre only) */}
              {step === "treatment" && (
                <div className="px-6 py-6">
                  <p className="text-xs mb-4" style={{ color: "#8a8278" }}>
                    Escolha 1 tratamento especial incluso no seu plano:
                  </p>
                  <div className="flex flex-col gap-2 mb-6">
                    {TREATMENTS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setChosenTreatment(t)}
                        className="flex items-center justify-between px-4 py-3 rounded-sm text-left transition-all"
                        style={{
                          backgroundColor: chosenTreatment === t ? "rgba(201,168,76,0.1)" : "#1e1e1e",
                          border: chosenTreatment === t ? `1px solid ${GOLD}` : "1px solid rgba(201,168,76,0.1)",
                        }}
                      >
                        <span className="text-sm" style={{ color: "#f0ece4" }}>{t}</span>
                        {chosenTreatment === t && <Check size={14} style={{ color: GOLD }} />}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep("payment")}
                    className="w-full py-3 text-sm uppercase tracking-widest hover:opacity-90 transition-all"
                    style={{ backgroundColor: GOLD, color: "#0a0a0a", fontFamily: "'DM Mono', monospace" }}
                  >
                    Confirmar Tratamento
                  </button>
                </div>
              )}

              {/* STEP: payment */}
              {step === "payment" && (
                <form onSubmit={handlePay} className="px-6 py-6 flex flex-col gap-4">
                  <PayField
                    label="Número do Cartão" value={card.number}
                    onChange={(v) => setCard((c) => ({ ...c, number: formatCard(v) }))}
                    placeholder="0000 0000 0000 0000" maxLength={19}
                  />
                  <PayField
                    label="Nome no Cartão" value={card.name}
                    onChange={(v) => setCard((c) => ({ ...c, name: v.toUpperCase() }))}
                    placeholder="NOME SOBRENOME"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <PayField
                      label="Validade" value={card.expiry}
                      onChange={(v) => setCard((c) => ({ ...c, expiry: formatExpiry(v) }))}
                      placeholder="MM/AA" maxLength={5}
                    />
                    <PayField
                      label="CVV" value={card.cvv}
                      onChange={(v) => setCard((c) => ({ ...c, cvv: v.replace(/\D/g, "").slice(0, 4) }))}
                      placeholder="•••"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield size={11} style={{ color: "#8a8278" }} />
                    <span className="text-xs" style={{ color: "#5a5248", fontFamily: "'DM Mono', monospace" }}>
                      Pagamento 100% seguro e criptografado
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 text-sm uppercase tracking-widest hover:opacity-90 transition-all"
                    style={{ backgroundColor: GOLD, color: "#0a0a0a", fontFamily: "'DM Mono', monospace" }}
                  >
                    Confirmar · R$ {selectedPlan.price},00/mês
                  </button>
                </form>
              )}

              {/* STEP: success */}
              {step === "success" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-10 text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: GOLD }}>
                    <Check size={24} color="#0a0a0a" />
                  </div>
                  <h3 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "1.5rem" }}>
                    Bem-vindo ao {selectedPlan.name}!
                  </h3>
                  <p className="text-sm mb-2" style={{ color: "#8a8278" }}>
                    Seus {selectedPlan.cuts} cortes já estão disponíveis.
                  </p>
                  {selectedPlan.id === "nobre" && (
                    <p className="text-xs mb-6" style={{ color: GOLD, fontFamily: "'DM Mono', monospace" }}>
                      Tratamento incluso: {chosenTreatment}
                    </p>
                  )}
                  {selectedPlan.id !== "nobre" && <div className="mb-6" />}
                  <button
                    onClick={closeModal}
                    className="w-full py-3 text-sm uppercase tracking-widest hover:opacity-90 transition-all"
                    style={{ backgroundColor: GOLD, color: "#0a0a0a", fontFamily: "'DM Mono', monospace" }}
                  >
                    Ir para Agendamentos
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PayField({ label, value, onChange, placeholder, maxLength }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; maxLength?: number;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-xs uppercase tracking-widest" style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>
        {label}
      </label>
      <input
        value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength}
        className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all"
        style={{ backgroundColor: "#1e1e1e", color: "#f0ece4", border: "1px solid rgba(201,168,76,0.15)" }}
        onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.15)")}
      />
    </div>
  );
}
