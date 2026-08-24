import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useBooking(barberName: string, selectedDay: number | null, currentMonth: number, currentYear: number) {
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDay) {
      setUnavailableTimes([]);
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const dateStr = `${String(selectedDay).padStart(2, "0")}/${String(currentMonth + 1).padStart(2, "0")}/${currentYear}`;
        
        const { data: appointments } = await supabase
          .from('appointments')
          .select('time')
          .eq('barber_name', barberName)
          .eq('date', dateStr);
          
        const { data: blocked } = await supabase
          .from('blocked_times')
          .select('time')
          .eq('date', dateStr);
          
        let unavail: string[] = [];
        if (appointments) {
          unavail = [...unavail, ...appointments.map(a => a.time)];
        }
        
        const TIME_SLOTS = [
          "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
          "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
          "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
        ];

        if (blocked) {
          const hasFullDayBlock = blocked.some(b => !b.time);
          if (hasFullDayBlock) {
            unavail = [...TIME_SLOTS];
          } else {
            unavail = [...unavail, ...blocked.map(b => b.time as string).filter(Boolean)];
          }
        }
        setUnavailableTimes(unavail);
      } catch (err) {
        console.error("Erro ao checar disponibilidade:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailability();
  }, [selectedDay, currentMonth, currentYear, barberName]);

  const confirmAppointment = async (appointmentData: any, barberId: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Usuário não autenticado");

    const { error } = await supabase.from('appointments').insert({
      user_id: session.user.id,
      barber_id: barberId,
      barber_name: appointmentData.barberName,
      barber_photo: appointmentData.barberPhoto,
      service: appointmentData.service,
      date: appointmentData.date,
      time: appointmentData.time,
      price: appointmentData.price,
    });
    
    if (error) throw error;
  };

  return {
    unavailableTimes,
    loading,
    confirmAppointment
  };
}
