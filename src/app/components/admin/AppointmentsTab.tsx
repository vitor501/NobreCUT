import React, { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

interface Props {
  allAppointments: any[];
  allBarbers: any[];
  onBlockTime: (e: React.FormEvent<HTMLFormElement>) => Promise<boolean>;
}

export function AppointmentsTab({ allAppointments, allBarbers, onBlockTime }: Props) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const ok = await onBlockTime(e);
    if (ok) {
      setSuccess(true);
      form.reset();
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <div className="mb-8">
        <div className="w-8 h-px mb-3 bg-[var(--color-brand-gold)]" />
        <h1 className="font-playfair text-[var(--color-text-primary)] text-3xl">Gerenciar Agendamentos</h1>
        <p className="text-sm mt-1 mb-8 text-[var(--color-text-secondary)]">Bloqueie horários ou acompanhe as reservas.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form de Bloqueio */}
        <div className="rounded-sm p-6 bg-[var(--color-card-dark)] border border-[var(--color-border-gold-light)] flex flex-col justify-center">
          {success ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[var(--color-brand-gold)]">
                <Check size={24} className="text-[var(--color-bg-dark)]" />
              </div>
              <h3 className="font-playfair text-[var(--color-text-primary)] text-xl mb-2">Bloqueio Realizado</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mb-6">O horário foi bloqueado e não aparecerá para os clientes.</p>
              <button onClick={() => setSuccess(false)} className="px-6 py-2 text-xs uppercase tracking-widest transition-all bg-[var(--color-border-gold-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-gold-strong)] font-mono rounded-sm">
                Novo Bloqueio
              </button>
            </motion.div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-widest mb-4 font-mono text-[var(--color-text-secondary)]">Bloquear Horário</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <button type="submit" disabled={loading} className={`w-full py-2.5 text-xs uppercase tracking-widest transition-all mt-2 font-mono ${loading ? "bg-[#1e1e1e] text-[#3a3a3a] cursor-not-allowed" : "bg-[var(--color-brand-gold)] text-[var(--color-bg-dark)] hover:opacity-90"}`}>
                  {loading ? "Bloqueando..." : "Confirmar Bloqueio"}
                </button>
              </form>
            </>
          )}
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
