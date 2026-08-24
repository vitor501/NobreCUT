import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { UserRole } from '../app/components/AuthScreen'; // Import type from AuthScreen

interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      // Se for o email do admin, força o role de admin, caso contrário, cliente.
      const isAdmin = email === 'admin@nobrecut.com';

      if (data) {
        setUserProfile({
          name: data.name || email.split('@')[0],
          email: email,
          role: isAdmin ? 'admin' : 'client',
          phone: data.phone,
        });
      } else {
         setUserProfile({
          name: email.split('@')[0],
          email: email,
          role: isAdmin ? 'admin' : 'client',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { session, userProfile, loading };
}
