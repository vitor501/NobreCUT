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
  
  const [screen, setScreen] = useState<Screen>("services");
  const [authRole, setAuthRole] = useState<UserRole>("client");
  const [allowRoleSwitch, setAllowRoleSwitch] = useState<boolean>(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  
  // Data from Supabase
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [subscribedPlan, setSubscribedPlan] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Sync screen with auth state when logging in/out
  useEffect(() => {
    if (!loading) {
      if (session && userProfile) {
        if (userProfile.role === "admin") {
          setScreen("admin");
          fetchAdminData();
        } else {
          // If logged in as client and was on auth or admin, go to services or continue booking
          if (screen === "auth" || screen === "admin") {
            setScreen(selectedBarber ? "booking" : "services");
          }
        }
        fetchUserData(session.user.id);
      } else {
        // When logged out, reset to services home screen
        if (screen === "admin" || screen === "profile") {
          setScreen("services");
        }
      }
    }
  }, [session, userProfile, loading]);

  // Listener for secret Admin access via 'Tab' key press on home page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && !session) {
        // Toggle/Trigger admin login mode
        setAuthRole("admin");
        setAllowRoleSwitch(true);
        setScreen("auth");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [session]);

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
    if (!session) {
      // Require login before proceeding to booking
      setAuthRole("client");
      setAllowRoleSwitch(false);
      setScreen("auth");
    } else {
      setScreen("booking");
    }
  };

  const handleConfirm = async (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  const handleSubscribe = (planId: string) => {
    if (!session) {
      setAuthRole("client");
      setAllowRoleSwitch(false);
      setScreen("auth");
      return;
    }
    setSubscribedPlan(planId);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen("services");
  };

  const openClientLogin = () => {
    setAuthRole("client");
    setAllowRoleSwitch(false);
    setScreen("auth");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-[#c9a84c]">Carregando...</div>;
  }

  if (screen === "auth") {
    return (
      <AuthScreen
        initialRole={authRole}
        allowRoleSwitch={allowRoleSwitch}
        onCancel={() => setScreen("services")}
      />
    );
  }

  if (screen === "admin" && userProfile?.role === "admin") {
    return <AdminScreen subscriberCount={subscriberCount} onLogout={handleLogout} />;
  }

  if (screen === "booking" && userProfile && selectedBarber) {
    return (
      <BookingScreen
        user={userProfile}
        barber={selectedBarber}
        onBack={() => setScreen("services")}
        onLogout={handleLogout}
        onConfirm={handleConfirm}
      />
    );
  }

  if (screen === "profile" && userProfile) {
    return (
      <ProfileScreen
        user={userProfile}
        appointments={appointments}
        onBack={() => setScreen("services")}
        onLogout={handleLogout}
      />
    );
  }

  if (screen === "plans") {
    return (
      <PlansScreen
        user={userProfile || { name: "Visitante", email: "" }}
        subscribedPlan={subscribedPlan}
        onSubscribe={handleSubscribe}
        onBack={() => setScreen("services")}
        onLogout={handleLogout}
      />
    );
  }

  // Default / Home screen: ServicesScreen for everyone (guests and logged-in users)
  return (
    <ServicesScreen
      user={userProfile}
      subscribedPlan={subscribedPlan}
      onBook={handleBook}
      onLogout={handleLogout}
      onLogin={openClientLogin}
      onProfile={() => setScreen("profile")}
      onPlans={() => setScreen("plans")}
    />
  );
}
