import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Scissors, Phone, Mail, User, ShieldCheck } from "lucide-react";

export type UserRole = "client" | "admin";

interface AuthScreenProps {
  onLogin?: (user: { name: string; email: string; role: UserRole }) => void; // Optional now
}

type LoginMethod = "email" | "phone";

const ADMIN_EMAIL = "admin@nobrecut.com";
const ADMIN_PASSWORD = "admin123";

const INPUT_BASE = "w-full px-4 py-3 rounded-sm text-sm outline-none transition-all";
const INPUT_STYLE: React.CSSProperties = {
  backgroundColor: "#1e1e1e",
  color: "#f0ece4",
  border: "1px solid rgba(201,168,76,0.15)",
};
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.target.style.borderColor = "#c9a84c");
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.target.style.borderColor = "rgba(201,168,76,0.15)");

import { supabase } from "../../lib/supabase";

export function AuthScreen({ onLogin }: AuthScreenProps = {}) {
  const [role, setRole] = useState<UserRole>("client");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const switchRole = (r: UserRole) => {
    setRole(r);
    setMode("login");
    setLoginMethod("email");
    setError("");
    setForm({ name: "", email: "", phone: "", password: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (role === "admin") {
        if (!form.email || !form.password) { setError("Preencha e-mail e senha."); return; }
        // Em produção, você removeria esse check hardcoded e deixaria o Supabase gerenciar a senha do admin
        if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
            const { error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });
            if (error) throw error;
        } else {
             setError("Credenciais de administrador inválidas.");
             return;
        }
        return;
      }

      if (mode === "register") {
        if (!form.name) { setError("Informe seu nome completo."); return; }
        if (!form.email) { setError("Informe seu e-mail."); return; }
        if (!form.phone) { setError("Informe seu telefone."); return; }
        if (!form.password) { setError("Crie uma senha."); return; }
        
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });
        
        if (error) throw error;

        // Create profile
        if (data.user) {
           await supabase.from('profiles').insert({
               id: data.user.id,
               name: form.name,
               phone: form.phone
           });
        }
        
        return;
      }

      // Login Mode
      if (loginMethod === "email") {
        if (!form.email || !form.password) { setError("Preencha e-mail e senha."); return; }
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
      } else {
        setError("Login via telefone não configurado neste exemplo. Use e-mail.");
        return;
      }
    } catch (err: any) {
        setError(err.message || "Ocorreu um erro na autenticação.");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&h=1200&fit=crop&auto=format"
          alt="Barbearia sofisticada"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.3) 100%)" }} />
        <div className="relative z-10 flex flex-col justify-end p-16">
          <div className="w-12 h-px mb-6" style={{ backgroundColor: "#c9a84c" }} />
          <p className="text-5xl leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4" }}>
            Arte & <br />Precisão
          </p>
          <p style={{ color: "#8a8278", fontSize: "0.95rem" }}>Cada corte conta uma história.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-md w-full mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 flex items-center justify-center rounded-sm" style={{ backgroundColor: "#c9a84c" }}>
              <Scissors size={18} color="#0a0a0a" />
            </div>
            <span className="text-xl tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ece4", letterSpacing: "0.2em" }}>
              Nobre Cut
            </span>
          </div>

          {/* Role selector */}
          <div className="flex rounded-sm overflow-hidden mb-8" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
            <RoleTab active={role === "client"} icon={<User size={14} />} label="Cliente" onClick={() => switchRole("client")} />
            <RoleTab active={role === "admin"} icon={<ShieldCheck size={14} />} label="Administrador" onClick={() => switchRole("admin")} gold />
          </div>

          {/* Admin hint */}
          <AnimatePresence>
            {role === "admin" && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="rounded-sm px-4 py-3 flex items-start gap-3 overflow-hidden"
                style={{ backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}
              >
                <ShieldCheck size={15} style={{ color: "#c9a84c", marginTop: 1, flexShrink: 0 }} />
                <div className="text-xs leading-relaxed" style={{ color: "#8a8278" }}>
                  <p>Acesso restrito à equipe Nobre Cut.</p>
                  <p className="mt-1">
                    <span style={{ color: "#5a5248" }}>E-mail: </span>
                    <span style={{ color: "#c9a84c", fontFamily: "'DM Mono', monospace" }}>{ADMIN_EMAIL}</span>
                  </p>
                  <p>
                    <span style={{ color: "#5a5248" }}>Senha: </span>
                    <span style={{ color: "#c9a84c", fontFamily: "'DM Mono', monospace" }}>{ADMIN_PASSWORD}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mode tabs — client only */}
          {role === "client" && (
            <div className="flex mb-8 border-b" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setMode(tab); setError(""); setLoginMethod("email"); }}
                  className="pb-4 mr-8 text-sm uppercase tracking-widest transition-colors"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color: mode === tab ? "#c9a84c" : "#8a8278",
                    borderBottom: mode === tab ? "2px solid #c9a84c" : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  {tab === "login" ? "Entrar" : "Cadastrar"}
                </button>
              ))}
            </div>
          )}

          {role === "admin" && (
            <p className="mb-5 text-xs uppercase tracking-widest" style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>
              Acesso Administrativo
            </p>
          )}

          <motion.form
            key={role + mode + loginMethod}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Login method toggle */}
            {role === "client" && mode === "login" && (
              <div className="flex rounded-sm overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.15)" }}>
                {(["email", "phone"] as const).map((m) => (
                  <button
                    key={m} type="button"
                    onClick={() => { setLoginMethod(m); setError(""); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-widest transition-all"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      backgroundColor: loginMethod === m ? "#c9a84c" : "transparent",
                      color: loginMethod === m ? "#0a0a0a" : "#8a8278",
                    }}
                  >
                    {m === "email" ? <Mail size={13} /> : <Phone size={13} />}
                    {m === "email" ? "E-mail" : "Telefone"}
                  </button>
                ))}
              </div>
            )}

            {/* Register: name */}
            {role === "client" && mode === "register" && (
              <AuthField
                label="Nome Completo" type="text" value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="Seu nome"
              />
            )}

            {/* Email */}
            {(role === "admin" ||
              (role === "client" && mode === "register") ||
              (role === "client" && mode === "login" && loginMethod === "email")) && (
              <AuthField
                label="E-mail" type="email" value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                placeholder="seu@email.com"
              />
            )}

            {/* Phone — login */}
            {role === "client" && mode === "login" && loginMethod === "phone" && (
              <AuthField
                label="Telefone" type="tel" value={form.phone}
                inputMode="numeric"
                onKeyDown={(e) => {
                  if (!/[\d\b]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(v) => {
                  const digits = v.replace(/\D/g, '').slice(0, 11);
                  let formatted = digits;
                  if (digits.length > 2 && digits.length <= 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                  else if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                  setForm((f) => ({ ...f, phone: formatted }));
                }}
                placeholder="(11) 99999-9999"
              />
            )}

            {/* Phone — register */}
            {role === "client" && mode === "register" && (
              <AuthField
                label="Telefone" type="tel" value={form.phone}
                inputMode="numeric"
                onKeyDown={(e) => {
                  if (!/[\d\b]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(v) => {
                  const digits = v.replace(/\D/g, '').slice(0, 11);
                  let formatted = digits;
                  if (digits.length > 2 && digits.length <= 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                  else if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                  setForm((f) => ({ ...f, phone: formatted }));
                }}
                placeholder="(11) 99999-9999"
              />
            )}

            {/* Password */}
            <AuthField
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(v) => setForm((f) => ({ ...f, password: v }))}
              placeholder="••••••••"
              extra={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#8a8278" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {error && <p className="text-sm" style={{ color: "#c0392b" }}>{error}</p>}

            <button
              type="submit"
              className="w-full py-3 mt-1 text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: role === "admin" ? "#f0ece4" : "#c9a84c",
                color: "#0a0a0a",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.15em",
              }}
            >
              {role === "admin" ? "Acessar Painel" : mode === "login" ? "Entrar" : "Criar Conta"}
            </button>

            {role === "client" && mode === "login" && (
              <p className="text-center text-xs" style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}>
                Não tem conta?{" "}
                <button type="button" onClick={() => setMode("register")} style={{ color: "#c9a84c" }}>
                  Cadastre-se
                </button>
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
}

/* ── Componentes auxiliares definidos FORA do AuthScreen ── */

function AuthField({ label, type, value, onChange, placeholder, extra, inputMode, onKeyDown }: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  extra?: React.ReactNode;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label
        className="block mb-2 text-xs uppercase tracking-widest"
        style={{ color: "#8a8278", fontFamily: "'DM Mono', monospace" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={INPUT_BASE}
          style={{ ...INPUT_STYLE, paddingRight: extra ? "3rem" : undefined }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputMode={inputMode}
          onKeyDown={onKeyDown}
        />
        {extra}
      </div>
    </div>
  );
}

function RoleTab({ active, icon, label, onClick, gold }: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  gold?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest transition-all"
      style={{
        fontFamily: "'DM Mono', monospace",
        backgroundColor: active ? (gold ? "#c9a84c" : "#f0ece4") : "transparent",
        color: active ? "#0a0a0a" : "#8a8278",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
