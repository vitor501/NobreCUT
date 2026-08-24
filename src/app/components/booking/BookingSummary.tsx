import React from "react";
import { User, Scissors, Calendar, Clock } from "lucide-react";

interface Props {
  userName: string;
  barberName: string;
  selectedService: string | null;
  selectedDay: number | null;
  selectedTime: string | null;
  currentMonth: number;
  currentYear: number;
  onConfirm: () => void;
  loading?: boolean;
}

export function BookingSummary({
  userName,
  barberName,
  selectedService,
  selectedDay,
  selectedTime,
  currentMonth,
  currentYear,
  onConfirm,
  loading = false,
}: Props) {
  const isComplete = selectedDay && selectedTime && selectedService;

  return (
    <div className="rounded-sm p-6 bg-[var(--color-card-dark)] border border-[var(--color-border-gold)]">
      <p className="text-xs uppercase tracking-widest mb-4 font-mono text-[var(--color-text-secondary)]">Resumo</p>
      <div className="flex flex-col gap-3 mb-6">
        <Row icon={<User size={13} />} label="Cliente" value={userName} />
        <Row icon={<Scissors size={13} />} label="Barbeiro" value={barberName} />
        <Row
          icon={<Calendar size={13} />}
          label="Serviço"
          value={selectedService ?? "—"}
          highlight={!selectedService}
        />
        <Row
          icon={<Calendar size={13} />}
          label="Data"
          value={
            selectedDay
              ? `${String(selectedDay).padStart(2, "0")}/${String(currentMonth + 1).padStart(2, "0")}/${currentYear}`
              : "—"
          }
          highlight={!selectedDay}
        />
        <Row
          icon={<Clock size={13} />}
          label="Horário"
          value={selectedTime ?? "—"}
          highlight={!selectedTime}
        />
      </div>

      <button
        onClick={onConfirm}
        disabled={!isComplete || loading}
        className={`w-full py-3 text-sm uppercase tracking-widest transition-all font-mono
          ${isComplete && !loading ? "bg-[var(--color-brand-gold)] text-[var(--color-bg-dark)] hover:opacity-90 cursor-pointer" : "bg-[#1e1e1e] text-[#3a3a3a] cursor-not-allowed"}
        `}
      >
        {loading ? "Confirmando..." : "Confirmar Agendamento"}
      </button>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
        {icon}
        <span className="text-xs font-mono">{label}</span>
      </div>
      <span className={`text-xs font-mono ${highlight ? "text-[#3a3a3a]" : "text-[var(--color-text-primary)]"}`}>
        {value}
      </span>
    </div>
  );
}
