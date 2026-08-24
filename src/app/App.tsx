import { useState, useEffect } from "react";
import { AuthScreen, type UserRole } from "./components/AuthScreen";
import { ServicesScreen, type Barber } from "./components/ServicesScreen";
import { BookingScreen, type Appointment } from "./components/BookingScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { PlansScreen } from "./components/PlansScreen";
import { AdminScreen } from "./components/AdminScreen";
import { useSession } from "../lib/useSession";
import { supabase } from "../lib/supabase";

type Screen = "auth" | "services" | "booking" | "profile" | "plans" | "admin";

interface User {
  name: string;
  email: string;
  role: UserRole;
}

export default function App() {
  const { session, userProfile, loading } = useSession();
  
  const [screen, setScreen] = useState<Screen>("auth");
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  
  // Data from Supabase
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [subscribedPlan, setSubscribedPlan] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Sync screen with auth state
  useEffect(() => {
    if (!loading) {
      if (session && userProfile) {
        setScreen(userProfile.role === "admin" ? "admin" : "services");
        fetchUserData(session.user.id);
        if (userProfile.role === "admin") {
          fetchAdminData();
        }
      } else {
        setScreen("auth");
      }
    }
  }, [session, userProfile, loading]);

  const fetchUserData = async (userId: string) => {
    // Fetch subscriptions
    const { data: subData } = await supabase
      .from("subscriptions")
      .select("plan_id")
      .eq("user_id", userId)
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1);
      
    if (subData && subData.length > 0) {
      setSubscribedPlan(subData[0].plan_id);
    }

    // Fetch appointments
    const { data: appData } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
      
    if (appData) {
      setAppointments(appData.map(a => ({
        barberName: a.barber_name,
        barberPhoto: a.barber_photo,
        service: a.service,
        date: a.date,
        time: a.time,
        price: a.price
      })));
    }
  };

  const fetchAdminData = async () => {
    const { count } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("active", true);
      
    setSubscriberCount(count || 0);
  };

  const handleBook = (barber: Barber) => {
    setSelectedBarber(barber);
    setScreen("booking");
  };

  const handleConfirm = async (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment]);
    // It's also inserted in BookingScreen directly now, but keeping local state updated
  };

  const handleSubscribe = (planId: string) => {
    setSubscribedPlan(planId);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // state is cleared by useSession reactivity
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-[#c9a84c]">Carregando...</div>;
  }

  if (screen === "auth") return <AuthScreen />;

  if (screen === "admin") return <AdminScreen subscriberCount={subscriberCount} onLogout={handleLogout} />;

  if (screen === "services" && userProfile)
    return (
      <ServicesScreen
        user={userProfile}
        subscribedPlan={subscribedPlan}
        onBook={handleBook}
        onLogout={handleLogout}
        onProfile={() => setScreen("profile")}
        onPlans={() => setScreen("plans")}
      />
    );

  if (screen === "booking" && userProfile && selectedBarber)
    return (
      <BookingScreen
        user={userProfile}
        barber={selectedBarber}
        onBack={() => setScreen("services")}
        onLogout={handleLogout}
        onConfirm={handleConfirm}
      />
    );

  if (screen === "profile" && userProfile)
    return (
      <ProfileScreen
        user={userProfile}
        appointments={appointments}
        onBack={() => setScreen("services")}
        onLogout={handleLogout}
      />
    );

  if (screen === "plans" && userProfile)
    return (
      <PlansScreen
        user={userProfile}
        subscribedPlan={subscribedPlan}
        onSubscribe={handleSubscribe}
        onBack={() => setScreen("services")}
        onLogout={handleLogout}
      />
    );

  return null;
}
