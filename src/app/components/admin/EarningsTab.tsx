import React from "react";
import { motion } from "motion/react";
import { DollarSign, Calendar, TrendingUp, Clock, Crown, BarChart2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";

interface Props {
  totalRevenue: number;
  subscriberCount: number;
  allAppointmentsLength: number;
  chartData: any[];
  serviceData: any[];
  xKey: string;
  period: "semanal" | "mensal";
  setPeriod: (p: "semanal" | "mensal") => void;
}

export function EarningsTab({
  totalRevenue,
  subscriberCount,
  allAppointmentsLength,
  chartData,
  serviceData,
  xKey,
  period,
  setPeriod,
}: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="w-8 h-px mb-3 bg-[var(--color-brand-gold)]" />
          <h1 className="font-playfair text-[var(--color-text-primary)] text-3xl">Ganhos</h1>
          <p className="text-sm mt-1 text-[var(--color-text-secondary)]">Painel financeiro — Nobre Cut</p>
        </div>

        {/* Period toggle */}
        <div className="flex rounded-sm overflow-hidden border border-[var(--color-border-gold-light)]">
          {(["semanal", "mensal"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-all font-mono
                ${period === p ? "bg-[var(--color-brand-gold)] text-[var(--color-bg-dark)]" : "bg-transparent text-[var(--color-text-secondary)]"}
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={<DollarSign size={16} />} label="Receita Total" value={`R$ ${totalRevenue.toFixed(0)}`} badge={<TrendBadge up={null} />} gold />
        <KpiCard icon={<Calendar size={16} />} label="Agendamentos" value={String(allAppointmentsLength)} badge={<TrendBadge up={null} />} />
        <KpiCard icon={<TrendingUp size={16} />} label="Ticket Médio" value={`R$ ${allAppointmentsLength > 0 ? (totalRevenue / allAppointmentsLength).toFixed(0) : 0}`} badge={<TrendBadge up={null} />} />
        <KpiCard icon={<Clock size={16} />} label="Horas Trabalhadas" value="--" badge={<TrendBadge up={null} />} />
      </div>

      {/* Subscriber counter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-sm p-6 mb-8 flex items-center gap-6 bg-[var(--color-card-dark)] border border-[var(--color-border-gold-strong)]"
      >
        <div className="w-14 h-14 rounded-sm flex items-center justify-center flex-shrink-0 bg-[var(--color-border-gold-light)] border border-[var(--color-border-gold-strong)]">
          <Crown size={22} className="text-[var(--color-brand-gold)]" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest mb-1 text-[var(--color-text-secondary)] font-mono">
            Plano Nobre Cut Club
          </p>
          <p className="font-playfair text-[var(--color-text-primary)] text-lg">
            Assinantes Ativos
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <motion.p
            key={subscriberCount}
            initial={{ scale: 1.3, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="font-playfair text-[var(--color-brand-gold)] text-4xl leading-none"
          >
            {subscriberCount}
          </motion.p>
          <p className="text-xs mt-1 text-[#5a5248] font-mono">
            {subscriberCount === 0 ? "nenhum ainda" : subscriberCount === 1 ? "assinante" : "assinantes"}
          </p>
        </div>
      </motion.div>

      {/* Area chart */}
      <div className="rounded-sm p-6 mb-6 bg-[var(--color-card-dark)] border border-[var(--color-border-gold-light)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest mb-1 text-[var(--color-text-secondary)] font-mono">
              Evolução de Receita
            </p>
            <p className="font-playfair text-[var(--color-text-primary)] text-xl">
              Nenhum dado disponível
            </p>
          </div>
          <BarChart2 size={18} className="text-[#2a2a2a]" />
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-gold)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="var(--color-brand-gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border-gold-light)" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fill: "#5a5248", fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#5a5248", fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 2, fontFamily: "'DM Mono', monospace" }}
              labelStyle={{ color: "var(--color-text-secondary)", fontSize: 11 }}
              itemStyle={{ color: "var(--color-brand-gold)", fontSize: 11 }}
              formatter={(v: number) => [`R$ ${v}`, "Receita"]}
            />
            <Area type="monotone" dataKey="receita" stroke="var(--color-brand-gold)" strokeWidth={1.5} fill="url(#goldGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: bar chart + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-sm p-6 bg-[var(--color-card-dark)] border border-[var(--color-border-gold-light)]">
          <p className="text-xs uppercase tracking-widest mb-1 text-[var(--color-text-secondary)] font-mono">
            Receita por Serviço
          </p>
          <p className="mb-5 font-playfair text-[var(--color-text-primary)]">Distribuição</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={serviceData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border-gold-light)" vertical={false} />
              <XAxis dataKey="nome" tick={{ fill: "#5a5248", fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a5248", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 2, fontFamily: "'DM Mono', monospace" }}
                labelStyle={{ color: "var(--color-text-secondary)", fontSize: 10 }}
                itemStyle={{ color: "var(--color-brand-gold)", fontSize: 10 }}
                formatter={(v: number) => [`R$ ${v}`, "Receita"]}
              />
              <Bar dataKey="valor" radius={[2, 2, 0, 0]}>
                {serviceData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "var(--color-brand-gold)" : "var(--color-border-gold-strong)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-sm p-6 bg-[var(--color-card-dark)] border border-[var(--color-border-gold-light)]">
          <p className="text-xs uppercase tracking-widest mb-1 text-[var(--color-text-secondary)] font-mono">Breakdown</p>
          <p className="mb-5 font-playfair text-[var(--color-text-primary)]">Detalhamento</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Receita Bruta", value: "R$ 0,00" },
              { label: "Comissões", value: "R$ 0,00" },
              { label: "Receita Líquida", value: "R$ 0,00", highlight: true },
              { label: "Cortes Realizados", value: "0" },
              { label: "Barbas Realizadas", value: "0" },
              { label: "Cancelamentos", value: "0" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-[var(--color-border-gold-light)]">
                <span className="text-xs text-[var(--color-text-secondary)] font-mono">{row.label}</span>
                <span className={`text-sm font-mono ${row.highlight ? "text-[var(--color-brand-gold)]" : "text-[var(--color-text-primary)]"}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function KpiCard({ icon, label, value, badge, gold }: { icon: React.ReactNode; label: string; value: string; badge?: React.ReactNode; gold?: boolean; }) {
  return (
    <div className={`rounded-sm p-5 ${gold ? "bg-[var(--color-border-gold-light)] border-[var(--color-border-gold-strong)]" : "bg-[var(--color-card-dark)] border-[var(--color-border-gold-light)]"} border`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[var(--color-brand-gold)]">{icon}</div>
        {badge}
      </div>
      <p className="mb-0.5 font-mono text-[#3a3a3a] text-xl">{value}</p>
      <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
    </div>
  );
}

function TrendBadge({ up }: { up: boolean | null }) {
  if (up === null) return (
    <span className="text-xs px-2 py-0.5 rounded-sm bg-[#1e1e1e] text-[#3a3a3a] font-mono">—</span>
  );
  return (
    <span className={`flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-sm font-mono ${up ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
      {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      0%
    </span>
  );
}
