import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Scissors, Star, Clock, ChevronRight, Calendar, LogOut,
  User, Crown, Users, Wrench, ShoppingBag, Lock, Menu, X,
} from "lucide-react";

export interface Barber {
  id: number;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  specialty: string;
  experience: string;
  photo: string;
  exclusive: boolean;
  services: { name: string; duration: string; price: string }[];
}

const GOLD = "#c9a84c";

const BARBERS: Barber[] = [
  {
    id: 1,
    name: "Rafael Moura",
    role: "Master Barber",
    rating: 4.9,
    reviews: 312,
    specialty: "Degradê & Navalhado",
    experience: "12 anos",
    exclusive: false,
    photo: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&h=600&fit=crop&auto=format",
    services: [
      { name: "Corte Clássico",  duration: "45 min", price: "R$ 30" },
      { name: "Degradê Premium", duration: "60 min", price: "R$ 85" },
      { name: "Navalhado",       duration: "30 min", price: "R$ 50" },
      { name: "Corte + Barba",   duration: "90 min", price: "R$ 120" },
    ],
  },
  {
    id: 2,
    name: "Thiago Lemos",
    role: "Senior Barber",
    rating: 4.8,
    reviews: 247,
    specialty: "Barbas & Bigodes",
    experience: "8 anos",
    exclusive: false,
    photo: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=500&h=600&fit=crop&auto=format",
    services: [
      { name: "Barba Completa",     duration: "40 min", price: "R$ 40" },
      { name: "Bigode & Acabamento", duration: "20 min", price: "R$ 35" },
      { name: "Barba + Hidratação", duration: "60 min", price: "R$ 80" },
      { name: "Corte + Barba",      duration: "90 min", price: "R$ 110" },
    ],
  },
  {
    id: 3,
    name: "Bruno Carvalho",
    role: "Barber",
    rating: 4.7,
    reviews: 189,
    specialty: "Cortes Modernos",
    experience: "5 anos",
    exclusive: false,
    photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=600&fit=crop&auto=format",
    services: [
      { name: "Corte Moderno", duration: "50 min", price: "R$ 70" },
      { name: "Undercut",      duration: "55 min", price: "R$ 75" },
      { name: "Texturizado",   duration: "45 min", price: "R$ 65" },
      { name: "Coloração",     duration: "90 min", price: "R$ 60" },
    ],
  },
  {
    id: 4,
    name: "Diego Santana",
    role: "Elite Barber",
    rating: 5.0,
    reviews: 98,
    specialty: "Estilo Executivo",
    experience: "10 anos",
    exclusive: true,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=600&fit=crop&auto=format",
    services: [
      { name: "Corte Executivo",   duration: "60 min", price: "R$ 95" },
      { name: "Barba Modelada",    duration: "45 min", price: "R$ 75" },
      { name: "Pacote Completo",   duration: "120 min", price: "R$ 180" },
      { name: "Hidratação",        duration: "30 min", price: "R$ 55" },
    ],
  },
  {
    id: 5,
    name: "Victor Neves",
    role: "Elite Barber",
    rating: 4.9,
    reviews: 74,
    specialty: "Técnicas Internacionais",
    experience: "7 anos",
    exclusive: true,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop&auto=format",
    services: [
      { name: "Corte Signature",   duration: "70 min", price: "R$ 110" },
      { name: "Degradê Artístico", duration: "80 min", price: "R$ 130" },
      { name: "Barba Premium",     duration: "50 min", price: "R$ 85" },
      { name: "Tratamento VIP",    duration: "90 min", price: "R$ 160" },
    ],
  },
];

const ALL_SERVICES = [
  { icon: "✂️", name: "Corte Clássico",    desc: "Corte tradicional com tesoura e máquina",  price: "A partir de R$ 30" },
  { icon: "🪒", name: "Barba Completa",    desc: "Navalha, hidratação e acabamento",           price: "A partir de R$ 40" },
  { icon: "💆", name: "Tratamentos",       desc: "Hidratação capilar e facial",                price: "A partir de R$ 45" },
  { icon: "🎨", name: "Coloração",         desc: "Tintura e reflexo masculino",                price: "A partir de R$ 60" },
  { icon: "💈", name: "Degradê Premium",   desc: "Degradê com acabamento preciso",             price: "A partir de R$ 85" },
  { icon: "🧴", name: "Hidratação",        desc: "Tratamento profundo para cabelo e barba",    price: "A partir de R$ 55" },
];

const PRODUCTS = [
  {
    name: "Pomada Modeladora Matte",
    brand: "Uppercut Deluxe",
    desc: "Fixação forte, acabamento fosco. Ideal para cabelos curtos e médios.",
    price: "R$ 89,90",
    tag: "Mais Vendido",
    photo: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Cera Capilar Brilhante",
    brand: "American Crew",
    desc: "Controle e brilho com fixação média. Para estilos clássicos.",
    price: "R$ 74,90",
    tag: null,
    photo: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Shampoo Masculino Refrescante",
    brand: "Suavecito",
    desc: "Limpeza profunda com mentol. Remove resíduos de pomada e styling.",
    price: "R$ 49,90",
    tag: null,
    photo: "/ricardo.webp",
  },
  {
    name: "Óleo para Barba",
    brand: "Barba Forte",
    desc: "Hidrata e amacia os fios. Perfume amadeirado duradouro.",
    price: "R$ 59,90",
    tag: "Novidade",
    photo: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Balm para Barba",
    brand: "Dapper Dan",
    desc: "Condiciona e modela a barba com fixação leve e natural.",
    price: "R$ 64,90",
    tag: null,
    photo: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Condicionador Capilar",
    brand: "Paul Mitchell",
    desc: "Nutrição profunda. Deixa o cabelo macio e com brilho natural.",
    price: "R$ 54,90",
    tag: null,
    photo: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop&auto=format",
  },
];

type NavItem = "barbeiros" | "servicos" | "produtos";

interface Props {
  user?: { name: string; email: string } | null;
  subscribedPlan?: string | null;
  onBook: (barber: Barber) => void;
  onLogout: () => void;
  onLogin: () => void;
  onProfile: () => void;
  onPlans: () => void;
}

export function ServicesScreen({ user, subscribedPlan, onBook, onLogout, onLogin, onProfile, onPlans }: Props) {
  const [activeNav, setActiveNav] = useState<NavItem>("barbeiros");
  const [expandedBarber, setExpandedBarber] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState<{name: string, price: string, qty: number}[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [addedProductToast, setAddedProductToast] = useState<{ name: string; photo: string; price: string } | null>(null);
  const [checkoutSuccessModal, setCheckoutSuccessModal] = useState<{ total: string; itemsCount: number } | null>(null);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "NOBRE10") {
      setDiscount(0.10); // 10%
    } else if (coupon.toUpperCase() === "RICARDINHO100") {
      setDiscount(1.0); // 100%
    } else {
      setDiscount(0);
      alert("Cupom inválido! Dica: tente NOBRE10 ou RICARDINHO100");
    }
  };

  const parsePrice = (priceStr: string) => {
    if (!priceStr) return 0;
    // Remove "R$", spaces, convert "89,90" to "89.90"
    const cleaned = priceStr.replace(/[^\d.,]/g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  };

  const addToCart = (product: { name: string; price: string; photo: string }) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.name === product.name);
      if (existing) {
        return prev.map((p) =>
          p.name === product.name ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { name: product.name, price: product.price, qty: 1 }];
    });
    setAddedProductToast({ name: product.name, photo: product.photo, price: product.price });
    setTimeout(() => {
      setAddedProductToast(null);
    }, 3500);
  };

  const handleFinalizePurchase = () => {
    const subtotal = cart.reduce((acc, item) => acc + (parsePrice(item.price) * item.qty), 0);
    const discountValue = subtotal * discount;
    const finalTotal = subtotal - discountValue;
    const itemsCount = cart.reduce((acc, p) => acc + p.qty, 0);

    setCartOpen(false);
    setCheckoutSuccessModal({
      total: `R$ ${finalTotal.toFixed(2).replace(".", ",")}`,
      itemsCount,
    });
    setCart([]);
    setCoupon("");
    setDiscount(0);
  };

  const isSubscriber = !!subscribedPlan;

  const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: "barbeiros", label: "Barbeiros",  icon: <Users size={16} /> },
    { id: "servicos",  label: "Serviços",   icon: <Wrench size={16} /> },
    { id: "produtos",  label: "Produtos",   icon: <ShoppingBag size={16} /> },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: 240, backgroundColor: "#0e0e0e", borderRight: "1px solid rgba(201,168,76,0.12)", flexShrink: 0 }}
      >
        {/* Logo */}
        <button
          onClick={() => { setActiveNav("barbeiros"); setSidebarOpen(false); }}
          className="flex items-center gap-3 px-6 py-6 border-b text-left hover:opacity-80 transition-opacity w-full"
          style={{ borderColor: "rgba(201,168,76,0.12)" }}
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-sm" style={{ backgroundColor: GOLD }}>
            <Scissors size={14} color="#0a0a0a" />
          </div>
          <span className="tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "0.95rem", letterSpacing: "0.18em" }}>
            Nobre Cut
          </span>
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 py-5 flex-1">
          <p className="px-3 mb-2 text-xs uppercase tracking-widest" style={{ color: "#3a3a3a", fontFamily: "'DM Mono', monospace" }}>
            Menu
          </p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-left transition-all"
              style={{
                backgroundColor: activeNav === item.id ? "rgba(201,168,76,0.1)" : "transparent",
                color: activeNav === item.id ? GOLD : "#8a8278",
                borderLeft: activeNav === item.id ? `2px solid ${GOLD}` : "2px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
            <p className="px-3 mb-2 text-xs uppercase tracking-widest" style={{ color: "#3a3a3a", fontFamily: "'DM Mono', monospace" }}>
              Conta
            </p>
            <button
              onClick={onPlans}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm w-full text-left transition-all hover:opacity-80"
              style={{ color: isSubscriber ? GOLD : "#8a8278" }}
            >
              <Crown size={16} />
              {isSubscriber ? "Meu Plano" : "Planos"}
            </button>
            {user && (
              <button
                onClick={onProfile}
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm w-full text-left transition-all hover:opacity-80"
                style={{ color: "#8a8278" }}
              >
                <User size={16} />
                Perfil
              </button>
            )}
          </div>
        </nav>

        {/* User + logout / login */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(201,168,76,0.15)" }}>
                  <User size={13} style={{ color: GOLD }} />
                </div>
                <span className="text-xs truncate" style={{ color: "#8a8278" }}>{user.name}</span>
              </div>
              <button onClick={onLogout} title="Sair" className="hover:opacity-70 transition-opacity ml-2" style={{ color: "#5a5248" }}>
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs uppercase tracking-widest rounded-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "rgba(201,168,76,0.15)", color: GOLD, border: "1px solid rgba(201,168,76,0.3)", fontFamily: "'DM Mono', monospace" }}
            >
              <User size={13} /> Entrar
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b lg:hidden" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: "#8a8278" }}>
            <Menu size={20} />
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4" }}>
            {navItems.find((n) => n.id === activeNav)?.label}
          </span>
          <button onClick={user ? onProfile : onLogin} style={{ color: "#8a8278" }}>
            <User size={18} />
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">

          {/* ── BARBEIROS ── */}
          {activeNav === "barbeiros" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <SectionHeader
                title="Nossos Barbeiros"
                sub="Escolha seu barbeiro e agende seu horário"
              />

              {/* Exclusive notice */}
              {!isSubscriber && (
                <div className="flex items-center gap-3 rounded-sm px-4 py-3 mb-8" style={{ backgroundColor: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
                  <Crown size={14} style={{ color: GOLD, flexShrink: 0 }} />
                  <p className="text-xs" style={{ color: "#8a8278" }}>
                    2 barbeiros são exclusivos para assinantes.{" "}
                    <button onClick={onPlans} style={{ color: GOLD }}>Ver planos →</button>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {BARBERS.map((barber) => {
                  const locked = barber.exclusive && !isSubscriber;
                  return (
                    <motion.div
                      key={barber.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-sm overflow-hidden"
                      style={{
                        backgroundColor: "#141414",
                        border: barber.exclusive
                          ? "1px solid rgba(201,168,76,0.3)"
                          : "1px solid rgba(201,168,76,0.1)",
                        opacity: locked ? 0.7 : 1,
                      }}
                    >
                      {/* Photo */}
                      <div className="relative h-48 overflow-hidden bg-zinc-900">
                        <img
                          src={barber.photo}
                          alt={barber.name}
                          className="w-full h-full object-cover"
                          style={{ filter: locked ? "grayscale(60%)" : "none" }}
                        />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 55%)" }} />

                        {/* Badges */}
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-sm" style={{ backgroundColor: GOLD, color: "#0a0a0a", fontFamily: "'DM Mono', monospace" }}>
                            {barber.role}
                          </span>
                          {barber.exclusive && (
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm" style={{ backgroundColor: "#0a0a0a", color: GOLD, border: `1px solid ${GOLD}`, fontFamily: "'DM Mono', monospace" }}>
                              <Crown size={9} />
                              Exclusivo
                            </span>
                          )}
                        </div>

                        {/* Lock overlay */}
                        {locked && (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                            <div className="flex flex-col items-center gap-1">
                              <Lock size={20} style={{ color: GOLD }} />
                              <span className="text-xs" style={{ color: GOLD, fontFamily: "'DM Mono', monospace" }}>Assinantes</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "1.1rem" }}>
                            {barber.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star size={11} fill={GOLD} color={GOLD} />
                            <span className="text-xs" style={{ color: GOLD, fontFamily: "'DM Mono', monospace" }}>{barber.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs mb-3" style={{ color: "#8a8278" }}>
                          {barber.specialty} · {barber.experience}
                        </p>

                        {/* Expand services */}
                        <button
                          onClick={() => setExpandedBarber(expandedBarber === barber.id ? null : barber.id)}
                          className="text-xs mb-3 hover:opacity-70 transition-opacity"
                          style={{ color: "#5a5248", fontFamily: "'DM Mono', monospace" }}
                          disabled={locked}
                        >
                          {expandedBarber === barber.id ? "▲ fechar" : "▼ ver serviços"}
                        </button>

                        <AnimatePresence>
                          {expandedBarber === barber.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mb-3"
                            >
                              <div className="flex flex-col gap-2 pt-1 pb-2 border-t" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                                {barber.services.map((s) => (
                                  <div key={s.name} className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs" style={{ color: "#d0ccc4" }}>{s.name}</p>
                                      <p className="flex items-center gap-1" style={{ color: "#5a5248" }}>
                                        <Clock size={9} />
                                        <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>{s.duration}</span>
                                      </p>
                                    </div>
                                    <span className="text-xs" style={{ color: GOLD, fontFamily: "'DM Mono', monospace" }}>{s.price}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <button
                          onClick={() => !locked && onBook(barber)}
                          disabled={locked}
                          className="w-full flex items-center justify-center gap-2 py-2 text-xs uppercase tracking-widest transition-all"
                          style={{
                            backgroundColor: locked ? "transparent" : GOLD,
                            color: locked ? "#3a3a3a" : "#0a0a0a",
                            border: locked ? "1px solid #2a2a2a" : "none",
                            fontFamily: "'DM Mono', monospace",
                            cursor: locked ? "not-allowed" : "pointer",
                          }}
                        >
                          {locked ? (<><Lock size={11} /> Requer assinatura</>) : (<><Calendar size={11} /> Agendar <ChevronRight size={11} /></>)}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── SERVIÇOS ── */}
          {activeNav === "servicos" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <SectionHeader title="Serviços" sub="Todos os serviços disponíveis na Nobre Cut" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_SERVICES.map((s) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-sm p-6 flex flex-col gap-3"
                    style={{ backgroundColor: "#141414", border: "1px solid rgba(201,168,76,0.1)" }}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <h3 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4" }}>
                        {s.name}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: "#8a8278" }}>{s.desc}</p>
                    </div>
                    <span className="text-sm mt-auto" style={{ color: GOLD, fontFamily: "'DM Mono', monospace" }}>
                      {s.price}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-10 rounded-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{ backgroundColor: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "1.1rem" }}>
                    Pronto para agendar?
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8a8278" }}>
                    Escolha um barbeiro e marque seu horário.
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav("barbeiros")}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest transition-all hover:opacity-90 flex-shrink-0"
                  style={{ backgroundColor: GOLD, color: "#0a0a0a", fontFamily: "'DM Mono', monospace" }}
                >
                  Ver barbeiros <ChevronRight size={13} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── PRODUTOS ── */}
          {activeNav === "produtos" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="w-8 h-px mb-3" style={{ backgroundColor: GOLD }} />
                  <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "1.8rem" }}>Produtos</h1>
                  <p className="text-sm mt-1" style={{ color: "#8a8278" }}>Produtos populares para cuidado capilar e de barba</p>
                </div>
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative p-3 rounded-full transition-transform hover:scale-105"
                  style={{ backgroundColor: "rgba(201,168,76,0.1)", color: GOLD, border: "1px solid rgba(201,168,76,0.3)" }}
                >
                  <ShoppingBag size={20} />
                  {cart.length > 0 && (
                    <span
                      className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full"
                      style={{ backgroundColor: GOLD, color: "#0a0a0a" }}
                    >
                      {cart.reduce((acc, p) => acc + p.qty, 0)}
                    </span>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {PRODUCTS.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-sm overflow-hidden flex flex-col"
                    style={{ backgroundColor: "#141414", border: "1px solid rgba(201,168,76,0.1)" }}
                  >
                    {/* Product image */}
                    <div className="relative h-44 overflow-hidden bg-zinc-900">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {p.tag && (
                        <div className="absolute top-3 left-3">
                          <span className="text-xs px-2 py-0.5 rounded-sm" style={{ backgroundColor: GOLD, color: "#0a0a0a", fontFamily: "'DM Mono', monospace" }}>
                            {p.tag}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs mb-1" style={{ color: "#5a5248", fontFamily: "'DM Mono', monospace" }}>{p.brand}</p>
                      <h3 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "1rem" }}>
                        {p.name}
                      </h3>
                      <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: "#8a8278" }}>{p.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: GOLD, fontFamily: "'DM Mono', monospace" }}>{p.price}</span>
                        <button
                          onClick={() => addToCart(p)}
                          className="text-xs px-3 py-1.5 rounded-sm transition-all hover:opacity-90"
                          style={{ backgroundColor: "rgba(201,168,76,0.1)", color: GOLD, border: "1px solid rgba(201,168,76,0.25)", fontFamily: "'DM Mono', monospace" }}
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Cart Modal */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 z-10 w-full max-w-sm flex flex-col shadow-2xl"
              style={{ backgroundColor: "#0e0e0e", borderLeft: "1px solid rgba(201,168,76,0.15)" }}
            >
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
                <div className="flex items-center gap-3">
                  <ShoppingBag style={{ color: GOLD }} size={20} />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "1.3rem" }}>Seu Carrinho</h2>
                </div>
                <button onClick={() => setCartOpen(false)} style={{ color: "#8a8278" }} className="hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-60 gap-3">
                    <ShoppingBag size={40} style={{ color: "#5a5248" }} />
                    <p className="text-sm" style={{ color: "#8a8278" }}>Seu carrinho está vazio.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {cart.map((item) => {
                      const itemTotal = parsePrice(item.price) * item.qty;
                      return (
                        <div key={item.name} className="flex justify-between items-start pb-4 border-b" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                          <div className="flex-1 pr-4">
                            <p style={{ color: "#f0ece4", fontSize: "0.95rem", lineHeight: "1.3", marginBottom: "4px" }}>{item.name}</p>
                            <p style={{ color: "#8a8278", fontSize: "0.85rem", fontFamily: "'DM Mono', monospace" }}>
                              {item.qty}x {item.price}
                            </p>
                          </div>
                          <span style={{ color: GOLD, fontFamily: "'DM Mono', monospace", fontSize: "1rem" }}>
                            R$ {itemTotal.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 border-t" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
                  <div className="mb-4">
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        placeholder="Cupom de desconto" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="flex-1 bg-transparent border rounded-sm px-3 py-2 text-xs outline-none focus:border-[#c9a84c]"
                        style={{ borderColor: "rgba(201,168,76,0.2)", color: "#f0ece4", fontFamily: "'DM Mono', monospace" }}
                      />
                      <button 
                        onClick={applyCoupon}
                        className="px-4 py-2 text-xs rounded-sm transition-all hover:opacity-90"
                        style={{ backgroundColor: "rgba(201,168,76,0.1)", color: GOLD, border: "1px solid rgba(201,168,76,0.25)", fontFamily: "'DM Mono', monospace" }}
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const subtotal = cart.reduce((acc, item) => acc + (parsePrice(item.price) * item.qty), 0);
                    const discountValue = subtotal * discount;
                    const finalTotal = subtotal - discountValue;
                    
                    return (
                      <>
                        {discount > 0 && (
                          <div className="flex justify-between mb-2 items-center">
                            <span style={{ color: "#8a8278", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px" }}>Desconto</span>
                            <span style={{ color: "#10b981", fontFamily: "'DM Mono', monospace", fontSize: "0.9rem" }}>
                              - R$ {discountValue.toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between mb-6 items-center">
                          <span style={{ color: "#8a8278", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px" }}>Total a Pagar</span>
                          <span style={{ color: GOLD, fontFamily: "'Playfair Display', serif", fontSize: "1.6rem" }}>
                            R$ {finalTotal.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                  
                  <button
                    onClick={handleFinalizePurchase}
                    className="w-full py-3.5 text-xs uppercase tracking-widest transition-all rounded-sm hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ backgroundColor: GOLD, color: "#0a0a0a", fontFamily: "'DM Mono', monospace", fontWeight: "bold" }}
                  >
                    Finalizar Compra <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pop-up / Toast: Produto Adicionado ao Carrinho */}
      <AnimatePresence>
        {addedProductToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-4 p-4 rounded-sm shadow-2xl"
            style={{
              backgroundColor: "#141414",
              border: "1px solid rgba(201,168,76,0.4)",
              backdropFilter: "blur(8px)",
              maxWidth: "360px",
            }}
          >
            <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 bg-zinc-900 border" style={{ borderColor: "rgba(201,168,76,0.2)" }}>
              <img src={addedProductToast.photo} alt={addedProductToast.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#10b981" }} />
                <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: GOLD, fontFamily: "'DM Mono', monospace" }}>
                  Adicionado ao Carrinho!
                </p>
              </div>
              <p className="text-xs truncate font-medium" style={{ color: "#f0ece4" }}>{addedProductToast.name}</p>
              <p className="text-xs font-mono" style={{ color: "#8a8278" }}>{addedProductToast.price}</p>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="text-xs px-2.5 py-1.5 rounded-sm uppercase tracking-wider font-mono hover:opacity-80 transition-opacity"
              style={{ backgroundColor: GOLD, color: "#0a0a0a" }}
            >
              Ver
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal / Pop-up: Compra Finalizada com Sucesso */}
      <AnimatePresence>
        {checkoutSuccessModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
              onClick={() => setCheckoutSuccessModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto z-50 max-w-md h-fit p-8 rounded-sm text-center shadow-2xl flex flex-col items-center"
              style={{ backgroundColor: "#121212", border: "1px solid rgba(201,168,76,0.3)" }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: GOLD }}>
                <ShoppingBag size={28} color="#0a0a0a" />
              </div>
              <h2 className="text-2xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4" }}>
                Pedido Confirmado!
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#8a8278" }}>
                Sua compra de <strong style={{ color: "#f0ece4" }}>{checkoutSuccessModal.itemsCount} {checkoutSuccessModal.itemsCount === 1 ? "item" : "itens"}</strong> foi realizada com sucesso no valor total de{" "}
                <strong style={{ color: GOLD, fontFamily: "'DM Mono', monospace" }}>{checkoutSuccessModal.total}</strong>.
              </p>
              <p className="text-xs mb-8 p-3 rounded-sm w-full" style={{ backgroundColor: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", color: "#c0b8ac" }}>
                Você receberá um e-mail de confirmação com os detalhes da entrega.
              </p>
              <button
                onClick={() => setCheckoutSuccessModal(null)}
                className="w-full py-3.5 text-xs uppercase tracking-widest rounded-sm transition-all hover:opacity-90 font-mono font-bold"
                style={{ backgroundColor: GOLD, color: "#0a0a0a" }}
              >
                Concluir
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8">
      <div className="w-8 h-px mb-3" style={{ backgroundColor: GOLD }} />
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "1.8rem" }}>
        {title}
      </h1>
      <p className="text-sm mt-1" style={{ color: "#8a8278" }}>{sub}</p>
    </div>
  );
}
