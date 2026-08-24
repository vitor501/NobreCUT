import React from "react";
import { motion } from "motion/react";

interface Props {
  allAppointments: any[];
  allBarbers: any[];
  onBlockTime: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AppointmentsTab({ allAppointments, allBarbers, onBlockTime }: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <div className="mb-8">
        <div className="w-8 h-px mb-3 bg-[var(--color-brand-gold)]" />
        <h1 className="font-playfair text-[var(--color-text-primary)] text-3xl">Gerenciar Agendamentos</h1>
        <p className="text-sm mt-1 mb-8 text-[var(--color-text-secondary)]">Bloqueie horários ou acompanhe as reservas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form de Bloqueio */}
        <div className="rounded-sm p-6 bg-[var(--color-card-dark)] border border-[var(--color-border-gold-light)]">
          <p className="text-xs uppercase tracking-widest mb-4 font-mono text-[var(--color-text-secondary)]">Bloquear Horário</p>
          <form onSubmit={onBlockTime} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Barbeiro</label>
              <select name="barber_id" required className="w-full bg-[var(--color-bg-dark)] text-sm p-2 rounded-sm border border-[var(--color-border-gold-light)] text-[var(--color-text-primary)]">
                <option value="">Selecione...</option>
                {allBarbers.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Data (DD/MM/YYYY)</label>
              <input type="text" name="date" required placeholder="Ex: 25/08/2026" className="w-full bg-[var(--color-bg-dark)] text-sm p-2 rounded-sm border border-[var(--color-border-gold-light)] text-[var(--color-text-primary)]" />
            </div>
            <div>
              <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Hora (Vazio = Dia todo)</label>
              <input type="text" name="time" placeholder="Ex: 14:00" className="w-full bg-[var(--color-bg-dark)] text-sm p-2 rounded-sm border border-[var(--color-border-gold-light)] text-[var(--color-text-primary)]" />
            </div>
            <button type="submit" className="w-full py-2.5 text-xs uppercase tracking-widest transition-all mt-2 bg-[var(--color-brand-gold)] text-[var(--color-bg-dark)] font-mono hover:opacity-90">
              Confirmar Bloqueio
            </button>
          </form>
        </div>

        {/* Lista de Últimos Agendamentos */}
        <div className="rounded-sm p-6 bg-[var(--color-card-dark)] border border-[var(--color-border-gold-light)]">
          <p className="text-xs uppercase tracking-widest mb-4 font-mono text-[var(--color-text-secondary)]">Últimos Agendamentos</p>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
            {allAppointments.length === 0 ? (
              <div className="flex items-center justify-center mt-4">
                <p className="text-xs font-mono text-[#3a3a3a]">Nenhum agendamento ainda</p>
              </div>
            ) : (
              allAppointments.map((app, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[var(--color-border-gold-light)]">
                  <div>
                    <p className="text-sm text-[var(--color-text-primary)]">{app.barber_name} - {app.service}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{app.date} às {app.time}</p>
                  </div>
                  <span className="text-xs font-mono text-[var(--color-brand-gold)]">{app.price}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
