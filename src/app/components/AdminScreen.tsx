import React, { useState } from "react";
import { motion } from "motion/react";
import { Scissors, LogOut, Users, Calendar, DollarSign, ShieldCheck } from "lucide-react";
import { useAdmin } from "../../hooks/useAdmin";
import { EarningsTab } from "./admin/EarningsTab";
import { AppointmentsTab } from "./admin/AppointmentsTab";

interface Props {
  subscriberCount: number;
  onLogout: () => void;
}

type Tab = "earnings" | "appointments" | "barbers";

export function AdminScreen({ subscriberCount, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>("earnings");
  const [period, setPeriod] = useState<"semanal" | "mensal">("mensal");
  
  const { allAppointments, allBarbers, loading, blockTime } = useAdmin();

  const handleBlockTime = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const barber_id = Number(formData.get("barber_id"));
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;

    try {
      await blockTime(barber_id, date, time);
      return true;
    } catch (err: any) {
      alert("Erro ao bloquear horário: " + err.message);
      return false;
    }
  };

  const totalRevenue = allAppointments.reduce((sum, app) => {
    const priceStr = app.price.replace("R$ ", "").replace(",", ".");
    return sum + (parseFloat(priceStr) || 0);
  }, 0);

  const monthlyData = [
    { mes: "Jan", receita: 0 }, { mes: "Fev", receita: 0 }, { mes: "Mar", receita: 0 },
    { mes: "Abr", receita: 0 }, { mes: "Mai", receita: 0 }, { mes: "Jun", receita: 0 },
    { mes: "Jul", receita: 0 }, { mes: "Ago", receita: 0 }, { mes: "Set", receita: 0 },
    { mes: "Out", receita: 0 }, { mes: "Nov", receita: 0 }, { mes: "Dez", receita: 0 },
  ];

  const weeklyData = [
    { dia: "Dom", receita: 0 }, { dia: "Seg", receita: 0 }, { dia: "Ter", receita: 0 },
    { dia: "Qua", receita: 0 }, { dia: "Qui", receita: 0 }, { dia: "Sex", receita: 0 },
    { dia: "Sáb", receita: 0 },
  ];

  const serviceDataMap: Record<string, number> = {};

  allAppointments.forEach(app => {
    const price = parseFloat(app.price.replace("R$ ", "").replace(",", ".")) || 0;
    serviceDataMap[app.service] = (serviceDataMap[app.service] || 0) + price;
    
    if (app.date) {
      const [dayStr, monthStr, yearStr] = app.date.split("/");
      const monthIndex = parseInt(monthStr, 10) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].receita += price;
      }
      const dateObj = new Date(parseInt(yearStr), monthIndex, parseInt(dayStr));
      const dayOfWeek = dateObj.getDay();
      if (!isNaN(dayOfWeek)) {
         weeklyData[dayOfWeek].receita += price;
      }
    }
  });

  const serviceData = Object.entries(serviceDataMap).map(([nome, valor]) => ({ nome, valor }));
  const chartData = period === "mensal" ? monthlyData : weeklyData;
  const xKey = period === "mensal" ? "mes" : "dia";

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] font-inter">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[var(--color-border-gold)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-sm bg-[var(--color-brand-gold)]">
            <Scissors size={14} className="text-[var(--color-bg-dark)]" />
          </div>
          <span className="text-lg tracking-[0.2em] uppercase font-playfair text-[var(--color-text-primary)]">
            Nobre Cut
          </span>
          <div className="flex items-center gap-1 ml-3 px-2 py-0.5 rounded-sm bg-[var(--color-border-gold-light)] border border-[var(--color-border-gold-strong)]">
            <ShieldCheck size={11} className="text-[var(--color-brand-gold)]" />
            <span className="text-xs font-mono text-[var(--color-brand-gold)]">Admin</span>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity text-[var(--color-text-secondary)]">
          <LogOut size={14} />
          Sair
        </button>
      </nav>

      {/* Tab bar */}
      <div className="flex border-b border-[var(--color-border-gold)] px-8">
        {([
          { id: "earnings",     label: "Ganhos",        icon: <DollarSign size={14} /> },
          { id: "appointments", label: "Agendamentos",   icon: <Calendar size={14} /> },
          { id: "barbers",      label: "Barbeiros",      icon: <Users size={14} /> },
        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 py-4 mr-8 text-sm transition-colors font-mono -mb-px border-b-2
              ${tab === t.id ? "text-[var(--color-brand-gold)] border-[var(--color-brand-gold)]" : "text-[var(--color-text-secondary)] border-transparent"}
            `}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {loading && <p className="text-sm text-[var(--color-text-secondary)] text-center my-10">Carregando dados...</p>}
        {!loading && tab === "earnings" && (
          <EarningsTab
            totalRevenue={totalRevenue}
            subscriberCount={subscriberCount}
            allAppointmentsLength={allAppointments.length}
            chartData={chartData}
            serviceData={serviceData}
            xKey={xKey}
            period={period}
            setPeriod={setPeriod}
          />
        )}

        {!loading && tab === "appointments" && (
          <AppointmentsTab
            allAppointments={allAppointments}
            allBarbers={allBarbers}
            onBlockTime={handleBlockTime}
          />
        )}

        {!loading && tab === "barbers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <div className="mb-8">
              <div className="w-8 h-px mb-3 bg-[var(--color-brand-gold)]" />
              <h1 className="font-playfair text-[var(--color-text-primary)] text-3xl">Equipe</h1>
            </div>
            <div className="rounded-sm py-20 flex flex-col items-center justify-center gap-3 bg-[var(--color-card-dark)] border border-[var(--color-border-gold-light)]">
              <Users size={28} className="text-[#2a2a2a]" />
              <p className="text-sm text-[#3a3a3a] font-mono">Nenhum barbeiro cadastrado</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
