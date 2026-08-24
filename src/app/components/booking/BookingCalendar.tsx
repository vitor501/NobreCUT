import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentMonth: number;
  currentYear: number;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function BookingCalendar({
  currentMonth,
  currentYear,
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth
}: Props) {
  const today = new Date();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const isPast = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    d.setHours(23, 59, 59);
    return d < today;
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-widest mb-4 font-mono text-[var(--color-text-secondary)]">Escolha a Data</p>
      <div className="rounded-sm p-5 bg-[var(--color-card-dark)] border border-[var(--color-border-gold-light)]">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={onPrevMonth} className="p-1 hover:opacity-70 transition-opacity text-[var(--color-text-secondary)]">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-playfair text-[var(--color-text-primary)]">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
          <button onClick={onNextMonth} className="p-1 hover:opacity-70 transition-opacity text-[var(--color-text-secondary)]">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
            <div key={i} className="text-center text-xs py-1 font-mono text-[var(--color-text-secondary)]">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const past = isPast(day);
            const isSelected = selectedDay === day;
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <button
                key={day}
                disabled={past}
                onClick={() => !past && onSelectDay(day)}
                className={`aspect-square flex items-center justify-center rounded-sm text-xs transition-all font-mono
                  ${isSelected ? "bg-[var(--color-brand-gold)] text-[var(--color-bg-dark)]" : ""}
                  ${!isSelected && past ? "text-[#3a3a3a] cursor-not-allowed" : ""}
                  ${!isSelected && !past && isToday ? "text-[var(--color-brand-gold)] border border-[var(--color-border-gold-strong)]" : ""}
                  ${!isSelected && !past && !isToday ? "text-[var(--color-text-primary)] hover:bg-[var(--color-border-gold-light)] border border-transparent" : ""}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
