import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Scissors, Check, Calendar, Clock, User } from "lucide-react";
import type { Barber } from "./ServicesScreen";
import { BookingCalendar } from "./booking/BookingCalendar";
import { BookingSummary } from "./booking/BookingSummary";
import { useBooking } from "../../hooks/useBooking";

export interface Appointment {
  barberName: string;
  barberPhoto: string;
  service: string;
  date: string;
  time: string;
  price: string;
}

interface Props {
  user: { name: string; email: string; id?: string };
  barber: Barber;
  onBack: () => void;
  onLogout: () => void;
  onConfirm: (appointment: Appointment) => void;
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function BookingScreen({ user, barber, onBack, onLogout, onConfirm }: Props) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const { unavailableTimes, loading, confirmAppointment } = useBooking(barber.name, selectedDay, currentMonth, currentYear);
  const [isConfirming, setIsConfirming] = useState(false);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const handleConfirm = async () => {
    if (selectedDay && selectedTime && selectedService) {
      setIsConfirming(true);
      const price = barber.services.find(s => s.name === selectedService)?.price ?? "";
      
      const apptData = {
        barberName: barber.name,
        barberPhoto: barber.photo,
        service: selectedService,
        date: `${String(selectedDay).padStart(2, "0")}/${String(currentMonth + 1).padStart(2, "0")}/${currentYear}`,
        time: selectedTime,
        price,
      };

      try {
        await confirmAppointment(apptData, barber.id);
        onConfirm(apptData);
        setConfirmed(true);
      } catch (err) {
        alert("Ocorreu um erro ao confirmar o agendamento.");
      } finally {
        setIsConfirming(false);
      }
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 bg-[var(--color-bg-dark)] font-inter">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 bg-[var(--color-brand-gold)]">
            <Check size={28} className="text-[var(--color-bg-dark)]" />
          </div>
          <h2 className="mb-3 font-playfair text-[var(--color-text-primary)] text-3xl">
            Agendado!
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Seu horário foi confirmado. Até lá!
          </p>
          <div className="rounded-sm p-6 mb-8 text-left bg-[var(--color-card-dark)] border border-[var(--color-border-gold-strong)]">
            <div className="flex flex-col gap-3">
              <Row icon={<User size={14} />} label="Barbeiro" value={barber.name} />
              <Row icon={<Scissors size={14} />} label="Serviço" value={selectedService!} />
              <Row
                icon={<Calendar size={14} />}
                label="Data"
                value={`${String(selectedDay).padStart(2, "0")} de ${MONTH_NAMES[currentMonth]} de ${currentYear}`}
              />
              <Row icon={<Clock size={14} />} label="Horário" value={selectedTime!} />
            </div>
          </div>
          <button
            onClick={() => { setConfirmed(false); onBack(); }}
            className="w-full py-3 text-sm uppercase tracking-widest transition-all hover:opacity-90 bg-[var(--color-brand-gold)] text-[var(--color-bg-dark)] font-mono"
          >
            Voltar ao Início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] font-inter">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[var(--color-border-gold)]">
        <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 flex items-center justify-center rounded-sm bg-[var(--color-brand-gold)]">
            <Scissors size={14} className="text-[var(--color-bg-dark)]" />
          </div>
          <span className="text-lg tracking-[0.2em] uppercase font-playfair text-[var(--color-text-primary)]">
            Nobre Cut
          </span>
        </button>
        <button onClick={onLogout} className="text-sm transition-colors hover:opacity-70 text-[var(--color-text-secondary)]">
          Sair
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 mb-10 transition-colors hover:opacity-70 text-[var(--color-text-secondary)]">
          <ChevronLeft size={16} />
          <span className="text-sm font-mono">Voltar</span>
        </button>

        {/* Barber info */}
        <div className="flex items-center gap-5 mb-12">
          <div className="w-14 h-14 rounded-sm overflow-hidden bg-zinc-800">
            <img src={barber.photo} alt={barber.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-playfair text-[var(--color-text-primary)] text-2xl">
              {barber.name}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {barber.role} · {barber.specialty}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Service + Calendar */}
          <div>
            {/* Service select */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest mb-4 font-mono text-[var(--color-text-secondary)]">Escolha o Serviço</p>
              <div className="flex flex-col gap-2">
                {barber.services.map((s) => {
                  const isSelected = selectedService === s.name;
                  return (
                    <button
                      key={s.name}
                      onClick={() => setSelectedService(s.name)}
                      className={`flex items-center justify-between px-4 py-3 rounded-sm text-left transition-all border
                        ${isSelected ? "bg-[var(--color-border-gold-light)] border-[var(--color-brand-gold)]" : "bg-[var(--color-card-dark)] border-[var(--color-border-gold-light)]"}
                      `}
                    >
                      <div>
                        <span className="text-sm text-[var(--color-text-primary)]">{s.name}</span>
                        <div className="flex items-center gap-1 mt-0.5 text-[var(--color-text-secondary)]">
                          <Clock size={10} />
                          <span className="text-xs font-mono">
                            {s.duration}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-[var(--color-brand-gold)] font-mono">
                        {s.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calendar */}
            <BookingCalendar
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onPrevMonth={prevMonth}
              onNextMonth={nextMonth}
            />
          </div>

          {/* Right — Time slots + Summary */}
          <div>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest mb-4 font-mono text-[var(--color-text-secondary)]">Escolha o Horário</p>
              {selectedDay ? (
                <div className="grid grid-cols-3 gap-2">
                  {loading && <p className="text-xs col-span-3 text-[var(--color-text-secondary)] text-center my-4">Verificando horários...</p>}
                  {!loading && TIME_SLOTS.map((t) => {
                    const unavail = unavailableTimes.includes(t);
                    const isSelected = selectedTime === t;
                    return (
                      <button
                        key={t}
                        disabled={unavail}
                        onClick={() => !unavail && setSelectedTime(t)}
                        className={`py-2.5 rounded-sm text-xs transition-all font-mono border
                          ${isSelected ? "bg-[var(--color-brand-gold)] text-[var(--color-bg-dark)] border-[var(--color-brand-gold)]" : ""}
                          ${unavail ? "bg-[#0f0f0f] text-[#2a2a2a] border-[var(--color-border-gold-light)] cursor-not-allowed line-through" : ""}
                          ${!isSelected && !unavail ? "bg-[var(--color-card-dark)] text-[var(--color-text-primary)] border-[var(--color-border-gold-light)] hover:bg-[var(--color-border-gold-light)]" : ""}
                        `}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center rounded-sm bg-[var(--color-card-dark)] border border-[var(--color-border-gold-light)]">
                  <p className="text-sm text-[#3a3a3a]">
                    Selecione uma data primeiro
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            <BookingSummary
              userName={user.name}
              barberName={barber.name}
              selectedService={selectedService}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              currentMonth={currentMonth}
              currentYear={currentYear}
              onConfirm={handleConfirm}
              loading={isConfirming}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string; }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
        {icon}
        <span className="text-xs font-mono">{label}</span>
      </div>
      <span className="text-xs font-mono text-[var(--color-text-primary)]">
        {value}
      </span>
    </div>
  );
}
