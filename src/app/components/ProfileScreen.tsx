import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  Scissors, LogOut, Calendar, Clock, ChevronLeft,
  User, Star, Award, Camera, Edit3, Check, X,
  Instagram, Twitter, Facebook, Globe,
} from "lucide-react";
import type { Appointment } from "./BookingScreen";

interface Props {
  user: { name: string; email: string; id?: string };
  appointments: Appointment[];
  onBack: () => void;
  onLogout: () => void;
}

const GOLD = "#c9a84c";

import { supabase } from "../../lib/supabase";

export function ProfileScreen({ user, appointments, onBack, onLogout }: Props) {
  const [photo, setPhoto]       = useState<string | null>(null);
  const [bio, setBio]           = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState("");
  const [socials, setSocials]   = useState({ instagram: "", twitter: "", facebook: "", website: "" });
  const [editingSocials, setEditingSocials] = useState(false);
  const [draftSocials, setDraftSocials]     = useState(socials);

  const fileRef = useRef<HTMLInputElement>(null);

  // Load profile data
  React.useEffect(() => {
    if (user.id) {
      supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
        if (data) {
          setBio(data.bio || "");
          setSocials({
            instagram: data.instagram || "",
            twitter: data.twitter || "",
            facebook: data.facebook || "",
            website: data.website || ""
          });
          setPhoto(data.photo_url || null);
        }
      });
    }
  }, [user.id]);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user.id) return;
    
    // Preview local
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);

    // TODO: Upload to Supabase Storage if you have the bucket created
    // const { data, error } = await supabase.storage.from('avatars').upload(`${user.id}/${file.name}`, file, { upsert: true });
    // if (data) {
    //   const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
    //   await supabase.from('profiles').update({ photo_url: publicUrl }).eq('id', user.id);
    // }
  };

  const saveBio = async () => { 
    setBio(draftBio); 
    setEditingBio(false);
    if (user.id) {
      await supabase.from('profiles').update({ bio: draftBio }).eq('id', user.id);
    }
  };
  
  const saveSocials = async () => { 
    setSocials(draftSocials); 
    setEditingSocials(false);
    if (user.id) {
      await supabase.from('profiles').update({
        instagram: draftSocials.instagram,
        twitter: draftSocials.twitter,
        facebook: draftSocials.facebook,
        website: draftSocials.website,
      }).eq('id', user.id);
    }
  };

  const totalSpent = appointments.reduce((acc, a) => {
    const val = parseFloat(a.price.replace("R$ ", "").replace(",", ".")) || 0;
    return acc + val;
  }, 0);

  const getMostFrequent = (arr: string[]): string | null => {
    if (!arr.length) return null;
    const count: Record<string, number> = {};
    arr.forEach((v) => { count[v] = (count[v] ?? 0) + 1; });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
  };

  const socialIcons: { key: keyof typeof socials; icon: React.ReactNode; label: string; placeholder: string }[] = [
    { key: "instagram", icon: <Instagram size={14} />, label: "Instagram",  placeholder: "@seu_usuario" },
    { key: "twitter",   icon: <Twitter size={14} />,   label: "X / Twitter", placeholder: "@seu_usuario" },
    { key: "facebook",  icon: <Facebook size={14} />,  label: "Facebook",   placeholder: "facebook.com/voce" },
    { key: "website",   icon: <Globe size={14} />,     label: "Website",    placeholder: "seusite.com" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-sm" style={{ backgroundColor: GOLD }}>
            <Scissors size={14} color="#0a0a0a" />
          </div>
          <span className="text-lg tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", letterSpacing: "0.2em" }}>
            Nobre Cut
          </span>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity" style={{ color: "#8a8278" }}>
          <LogOut size={14} />
          Sair
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 mb-8 hover:opacity-70 transition-opacity" style={{ color: "#8a8278" }}>
          <ChevronLeft size={16} />
          <span className="text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>Voltar</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — profile card */}
          <div className="lg:col-span-1 flex flex-col gap-5">

            {/* Photo + name */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-sm p-6 flex flex-col items-center text-center"
              style={{ backgroundColor: "#141414", border: "1px solid rgba(201,168,76,0.15)" }}
            >
              {/* Avatar */}
              <div className="relative mb-4">
                <div
                  className="w-24 h-24 rounded-sm overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: "rgba(201,168,76,0.1)", border: `2px solid rgba(201,168,76,0.3)` }}
                >
                  {photo
                    ? <img src={photo} alt="Foto" className="w-full h-full object-cover" />
                    : <User size={36} style={{ color: GOLD }} />
                  }
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-sm flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{ backgroundColor: GOLD }}
                >
                  <Camera size={13} color="#0a0a0a" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </div>

              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "1.3rem" }}>
                {user.name}
              </h2>
              <p className="text-xs mt-1 mb-4" style={{ color: "#8a8278" }}>{user.email}</p>

              {/* Bio */}
              {editingBio ? (
                <div className="w-full">
                  <textarea
                    value={draftBio}
                    onChange={(e) => setDraftBio(e.target.value)}
                    placeholder="Escreva uma breve descrição sobre você..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-sm text-xs resize-none outline-none"
                    style={{ backgroundColor: "#1e1e1e", color: "#f0ece4", border: "1px solid rgba(201,168,76,0.3)", fontFamily: "'Inter', sans-serif" }}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={saveBio} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-sm text-xs transition-all hover:opacity-90"
                      style={{ backgroundColor: GOLD, color: "#0a0a0a", fontFamily: "'DM Mono', monospace" }}>
                      <Check size={11} /> Salvar
                    </button>
                    <button onClick={() => setEditingBio(false)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-sm text-xs"
                      style={{ backgroundColor: "#1e1e1e", color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>
                      <X size={11} /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full text-center">
                  {bio
                    ? <p className="text-xs leading-relaxed mb-2" style={{ color: "#8a8278" }}>{bio}</p>
                    : <p className="text-xs italic mb-2" style={{ color: "#3a3a3a" }}>Sem descrição ainda</p>
                  }
                  <button
                    onClick={() => { setDraftBio(bio); setEditingBio(true); }}
                    className="flex items-center gap-1 mx-auto text-xs hover:opacity-70 transition-opacity"
                    style={{ color: "#5a5248", fontFamily: "'DM Mono', monospace" }}
                  >
                    <Edit3 size={10} /> {bio ? "editar bio" : "adicionar bio"}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-sm p-5"
              style={{ backgroundColor: "#141414", border: "1px solid rgba(201,168,76,0.1)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-widest" style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>
                  Redes Sociais
                </p>
                <button
                  onClick={() => { setDraftSocials(socials); setEditingSocials(!editingSocials); }}
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: GOLD }}
                >
                  <Edit3 size={13} />
                </button>
              </div>

              {editingSocials ? (
                <div className="flex flex-col gap-3">
                  {socialIcons.map(({ key, icon, label, placeholder }) => (
                    <div key={key}>
                      <label className="flex items-center gap-1.5 mb-1 text-xs" style={{ color: "#5a5248" }}>
                        {icon} {label}
                      </label>
                      <input
                        value={draftSocials[key]}
                        onChange={(e) => setDraftSocials((s) => ({ ...s, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 rounded-sm text-xs outline-none"
                        style={{ backgroundColor: "#1e1e1e", color: "#f0ece4", border: "1px solid rgba(201,168,76,0.15)" }}
                        onFocus={(e) => (e.target.style.borderColor = GOLD)}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.15)")}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 mt-1">
                    <button onClick={saveSocials} className="flex-1 py-1.5 rounded-sm text-xs hover:opacity-90 transition-all"
                      style={{ backgroundColor: GOLD, color: "#0a0a0a", fontFamily: "'DM Mono', monospace" }}>
                      Salvar
                    </button>
                    <button onClick={() => setEditingSocials(false)} className="flex-1 py-1.5 rounded-sm text-xs"
                      style={{ backgroundColor: "#1e1e1e", color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {socialIcons.map(({ key, icon, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span style={{ color: socials[key] ? GOLD : "#2a2a2a" }}>{icon}</span>
                      <span className="text-xs truncate" style={{ color: socials[key] ? "#f0ece4" : "#3a3a3a" }}>
                        {socials[key] || label + " não informado"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="rounded-sm p-5 grid grid-cols-3 gap-3"
              style={{ backgroundColor: "#141414", border: "1px solid rgba(201,168,76,0.1)" }}
            >
              <StatTile icon={<Scissors size={13} />} label="Cortes"     value={String(appointments.length)} />
              <StatTile icon={<Award size={13} />}    label="Investido"  value={`R$${totalSpent.toFixed(0)}`} />
              <StatTile icon={<Star size={13} />}     label="Favorito"   value={getMostFrequent(appointments.map((a) => a.barberName))?.split(" ")[0] ?? "—"} />
            </motion.div>
          </div>

          {/* RIGHT — history */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px" style={{ backgroundColor: GOLD }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontSize: "1.3rem" }}>
                  Histórico de Agendamentos
                </h2>
              </div>

              {appointments.length === 0 ? (
                <div className="rounded-sm py-16 flex flex-col items-center justify-center gap-3"
                  style={{ backgroundColor: "#141414", border: "1px solid rgba(201,168,76,0.08)" }}>
                  <Scissors size={28} style={{ color: "#2a2a2a" }} />
                  <p className="text-sm" style={{ color: "#3a3a3a", fontFamily: "'DM Mono', monospace" }}>
                    Nenhum agendamento ainda
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {[...appointments].reverse().map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 rounded-sm px-5 py-4"
                      style={{ backgroundColor: "#141414", border: "1px solid rgba(201,168,76,0.08)" }}
                    >
                      <div className="w-9 h-9 rounded-sm overflow-hidden flex-shrink-0 bg-zinc-800">
                        <img src={a.barberPhoto} alt={a.barberName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ color: "#f0ece4" }}>{a.service}</p>
                        <p className="text-xs" style={{ color: "#8a8278" }}>com {a.barberName}</p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Calendar size={10} style={{ color: "#5a5248" }} />
                          <span className="text-xs" style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>{a.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={10} style={{ color: "#5a5248" }} />
                          <span className="text-xs" style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>{a.time}</span>
                        </div>
                      </div>
                      <span className="text-sm flex-shrink-0 ml-2" style={{ color: GOLD, fontFamily: "'DM Mono', monospace" }}>
                        {a.price}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <div style={{ color: GOLD }}>{icon}</div>
      <span className="text-sm" style={{ color: "#f0ece4", fontFamily: "'DM Mono', monospace" }}>{value}</span>
      <span className="text-xs" style={{ color: "#8a8278" }}>{label}</span>
    </div>
  );
}
