import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAdmin() {
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [allBarbers, setAllBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch all appointments for admin view
        const { data: appts } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (appts && isMounted) setAllAppointments(appts);
        
        // Fetch profiles that have role admin/barber or just list profiles
        const { data: barbers } = await supabase
          .from('barbers')
          .select('*');
          
        if (barbers && isMounted) setAllBarbers(barbers);
      } catch (err) {
        console.error("Erro ao carregar dados do admin:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const blockTime = async (barber_id: number, date: string, time: string | null) => {
    const { error } = await supabase.from('blocked_times').insert({
      barber_id: barber_id,
      date: date,
      time: time ? time : null
    });
    
    if (error) {
      throw error;
    }
  };

  return {
    allAppointments,
    allBarbers,
    loading,
    blockTime
  };
}
