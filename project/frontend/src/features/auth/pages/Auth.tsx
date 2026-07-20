import React, { useState, useEffect, useRef, useId } from "react";
import { Link } from "react-router-dom";


type FormMode = "signin" | "signup";

interface PasswordStrength {
  score: number;
  text: string;
  color: string;
  glow: string;
}

interface PwdRequirements {
  length: boolean;
  casing: boolean;
  number: boolean;
  special: boolean;
}

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

/* ==========================================================================
   COMPONENTES DE ÍCONES (SVGs VETORIAIS OTIMIZADOS)
   ========================================================================== */
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const AlertIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckIcon = ({ met }: { met: boolean }) => (
  <svg className="w-3.5 h-3.5 transition-all duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" strokeWidth="2" className={`transition-all duration-300 ${met ? "fill-[#10b981] stroke-[#10b981]" : "fill-transparent stroke-[#94a3b8] checkbox-dash-array"}`} />
    <path d="M8 12L11 15L16 9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-all duration-300 ${met ? "stroke-white" : "stroke-transparent"}`} />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

/* ==========================================================================
   COMPONENTE DE AUTENTICAÇÃO PRINCIPAL
   ========================================================================== */
function Auth() {
  const [mode, setMode] = useState<FormMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [shakingFields, setShakingFields] = useState<{ [k: string]: boolean }>({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  const [pwdStrength, setPwdStrength] = useState<PasswordStrength>({
    score: 0,
    text: "Muito curta",
    color: "#64748b",
    glow: "rgba(100, 116, 139, 0.15)"
  });

  const [pwdReqs, setPwdReqs] = useState<PwdRequirements>({
    length: false,
    casing: false,
    number: false,
    special: false
  });

  const timeoutsRef = useRef<number[]>([]);
  const uid = useId();
  const emailErrorId = `${uid}-email-error`;
  const passwordErrorId = `${uid}-password-error`;
  const nameErrorId = `${uid}-name-error`;

  const isSignin = mode === "signin";
  const isLoading = formState === "loading";
  const isSuccess = formState === "success";

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (!password) {
      setPwdStrength({ score: 0, text: "", color: "#e2e8f0", glow: "rgba(37, 99, 235, 0.08)" });
      setPwdReqs({ length: false, casing: false, number: false, special: false });
      return;
    }

    const reqs = {
      length: password.length >= 8,
      casing: /[A-Z]/.test(password) && /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    setPwdReqs(reqs);
    const score = Object.values(reqs).filter(Boolean).length;

    switch (score) {
      case 1:
        setPwdStrength({ score: 1, text: "Muito Fraca", color: "#ef4444", glow: "rgba(239, 68, 68, 0.15)" });
        break;
      case 2:
        setPwdStrength({ score: 2, text: "Fraca", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.15)" });
        break;
      case 3:
        setPwdStrength({ score: 3, text: "Boa", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.15)" });
        break;
      case 4:
        setPwdStrength({ score: 4, text: "Excelente", color: "#10b981", glow: "rgba(16, 185, 129, 0.15)" });
        break;
      default:
        setPwdStrength({ score: 0, text: "Curta demais", color: "#64748b", glow: "rgba(100, 116, 139, 0.15)" });
    }

    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: password.length >= 8 ? undefined : "Use ao menos 8 caracteres." }));
    }
  }, [password, touched.password]);

  useEffect(() => {
    setErrors({});
    setTouched({});
  }, [mode]);

  const triggerShake = (field: string) => {
    setShakingFields((prev) => ({ ...prev, [field]: true }));
    const tId = window.setTimeout(() => {
      setShakingFields((prev) => ({ ...prev, [field]: false }));
      timeoutsRef.current = timeoutsRef.current.filter((id) => id !== tId);
    }, 500);
    timeoutsRef.current.push(tId);
  };

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Informe um e-mail válido.";

  const validatePassword = (value: string) =>
    value.length >= 8 ? undefined : "Use ao menos 8 caracteres.";

  const validateName = (value: string) =>
    value.trim().length > 2 ? undefined : "Informe seu nome completo.";

  const handleBlur = (field: "name" | "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "name" && !isSignin) {
      setErrors((prev) => ({ ...prev, name: validateName(name) }));
    }
    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    }
    if (field === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = !isSignin ? validateName(name) : undefined;

    setErrors({ email: emailError, password: passwordError, name: nameError });
    setTouched({ name: true, email: true, password: true });

    if (nameError) triggerShake("name");
    if (emailError) triggerShake("email");
    if (passwordError) triggerShake("password");

    if (emailError || passwordError || nameError) return;

    setFormState("loading");

    const tId1 = window.setTimeout(() => {
      setFormState("success");
      const tId2 = window.setTimeout(() => {
        if (isSignin) {
          console.log("Realizando Login:", { email, password, rememberMe });
        } else {
          console.log("Realizando Cadastro:", { name, email, password });
        }
        setFormState("idle");
      }, 1500);
      timeoutsRef.current.push(tId2);
    }, 1500);
    timeoutsRef.current.push(tId1);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#030712] grid grid-cols-[1.1fr_0.9fr] max-[1024px]:grid-cols-[1fr_1fr] max-[840px]:block max-[840px]:relative">
      
      {/* SEÇÃO ESQUERDA: Painel Hero */}
      <section className="relative w-full h-full p-16 max-[1024px]:p-10 flex flex-col justify-between overflow-hidden bg-[#030712] max-[840px]:absolute max-[840px]:top-0 max-[840px]:left-0 max-[840px]:h-full max-[840px]:p-8 max-[840px]:justify-start max-[840px]:items-center max-[840px]:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.2),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(30,58,138,0.2),transparent_50%),#030712] z-10">
        <div className="absolute w-[450px] h-[450px] bg-[#2563eb] rounded-full filter blur-[140px] opacity-25 top-[-100px] left-[-100px] pointer-events-none animate-orb-float max-[840px]:filter max-[840px]:blur-[80px] max-[840px]:opacity-15 z-0" />
        <div className="absolute w-[550px] h-[550px] bg-[#1e3a8a] rounded-full filter blur-[140px] opacity-25 bottom-[-150px] right-[-100px] pointer-events-none animate-orb-float [animation-delay:-5s] max-[840px]:filter max-[840px]:blur-[80px] max-[840px]:opacity-15 z-0" />

        <span className="text-[#ffffff66] tracking-[0.35em] text-xs font-semibold relative z-10 max-[840px]:hidden">
          ATLHON SALES
        </span>

        <div className="group/hero w-full max-w-lg mt-0 max-[840px]:mt-8 text-left max-[840px]:text-center relative z-10">
          <h1 className="text-white font-bold text-6xl max-[1024px]:text-4xl max-[840px]:text-3xl leading-[1.1] tracking-tight my-6 max-[840px]:my-3">
            Toda Sua <br />
            <em className="hero-gradient-text hero-elastic-text">
              Gestão Centralizada
            </em>
          </h1>
          <p className="text-[#ffffff8c] text-base max-[840px]:text-sm leading-relaxed max-w-[500px] max-[840px]:mx-auto max-[480px]:hidden">
            A Elite de seus atletas começa por aqui. Aumente a eficiência de sua equipe e melhore a gestão de seus alunos com nosso sistema de CRM.
          </p>
        </div>

        <div className="w-full flex justify-between items-center text-[#ffffff4d] text-[0.7rem] tracking-[0.12em] font-medium relative z-10 max-[840px]:hidden">
          <span>WORKSPACE PRIVADO</span>
          <span>ALTA EFICIÊNCIA • GESTÃO MELHORADA</span>
        </div>
      </section>

      {/* SEÇÃO DIREITA: Módulo Interativo do Formulário */}
      <section className="relative w-full h-full flex items-center justify-center bg-[#f8fafc] p-8 overflow-hidden max-[840px]:absolute max-[840px]:bottom-0 max-[840px]:left-0 max-[840px]:h-[65%] max-[480px]:h-[75%] max-[840px]:bg-transparent max-[840px]:p-6 max-[480px]:p-0 max-[840px]:items-end z-20">
        
        <div className="w-full max-w-[420px] max-[840px]:max-w-[460px] max-[840px]:rounded-b-none max-[840px]:rounded-t-[24px] max-[480px]:rounded-t-[20px] max-h-[calc(100vh-4rem)] max-[840px]:max-h-full overflow-y-auto bg-white rounded-2xl p-10 max-[840px]:p-8 max-[480px]:p-6 border border-[#e2e8f0] max-[840px]:border-white/25 text-[#0f172a] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] max-[840px]:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] max-[840px]:backdrop-blur-[16px] max-[840px]:bg-white/95 transition-transform duration-200 animate-card-enter scrollbar-fine">
          
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold text-sm bg-[#0f172a]" aria-hidden="true">A</div>
              <div className="flex flex-col">
                <small className="text-[#94a3b8] tracking-[0.15em] uppercase text-[0.65rem] font-bold">Atlhon Sales</small>
                <span className="text-[10px] font-semibold text-blue-600 tracking-wide uppercase">CRM Suite</span>
              </div>
            </div>
            
            <Link to="/" className="flex items-center gap-1.5 text-[#475569] hover:text-[#2563eb] text-xs font-semibold transition-colors duration-200 group/back">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform transition-transform duration-200 group-hover/back:-translate-x-0.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Voltar
            </Link>
          </div>

          <div className="flex gap-1 mb-7 bg-[#f1f5f9] rounded-lg p-1" role="tablist" aria-label="Alternar entre entrar e criar conta">
            <button
              type="button"
              role="tab"
              aria-selected={isSignin}
              className={`flex-1 rounded-md py-2.5 text-xs font-semibold text-center transition-all duration-200 active:scale-[0.97] border-none bg-transparent cursor-pointer ${isSignin ? "bg-white text-[#0f172a] shadow-[0_1px_3px_rgba(15,23,42,0.08)]" : "text-[#475569] hover:text-[#0f172a]"}`}
              onClick={() => { setMode("signin"); setShowPassword(false); setFormState("idle"); }}
            >
              Entrar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isSignin}
              className={`flex-1 rounded-md py-2.5 text-xs font-semibold text-center transition-all duration-200 active:scale-[0.97] border-none bg-transparent cursor-pointer ${!isSignin ? "bg-white text-[#0f172a] shadow-[0_1px_3px_rgba(15,23,42,0.08)]" : "text-[#475569] hover:text-[#0f172a]"}`}
              onClick={() => { setMode("signup"); setShowPassword(false); setFormState("idle"); }}
            >
              Criar conta
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl max-[840px]:text-xl font-bold tracking-tight text-[#0f172a] m-0 animate-fade-slide">
              {isSignin ? "Bem-vindo Novamente!" : "Comece do Zero"}
            </h2>
            <h3 className="mt-1 text-[#475569] text-sm font-normal animate-fade-slide [animation-delay:0.03s]">
              {isSignin ? "Retome de onde parou." : "Gerencie seus Alunos."}
            </h3>
          </div>

          <button className="group/google w-full flex items-center justify-center gap-2 mb-5 py-3 px-5 rounded-lg bg-white text-[#0f172a] border border-[#e2e8f0] font-semibold text-sm transition-all duration-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-[#f8fafc] hover:border-[#0f172a]/15 hover:shadow-[0_2px_4px_rgba(15,23,42,0.06)] hover:-translate-y-px active:scale-[0.985] cursor-pointer" type="button">
            <span className="flex items-center" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </span>
            <span>Entrar com o Google</span>
            <svg className="w-0 opacity-0 -translate-x-1.5 transition-all duration-200 group-hover/google:w-[15px] group-hover/google:opacity-100 group-hover/google:translate-x-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <div className="flex items-center gap-4 mb-5 text-[#94a3b8] text-[0.65rem] font-bold tracking-[0.1em] before:content-[''] before:flex-1 before:h-px before:bg-[#0f172a]/5 after:content-[''] after:flex-1 after:h-px after:bg-[#0f172a]/5">
            <span>OU POR E-MAIL</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            
            {/* CORREÇÃO DO BUG: O container do Grid agora ganha overflow-visible assim que a animação termina */}
            <div className={`grid transition-[grid-template-rows,margin-bottom] duration-300 ease-in-out ${!isSignin ? "grid-rows-[1fr] mb-4 overflow-visible" : "grid-rows-[0fr] mb-0 overflow-hidden"}`}>
              <div className={`min-h-0 transition-opacity duration-200 [grid-row:1/2] [grid-column:1/2] relative z-10 ${!isSignin ? "opacity-100 delay-[80ms]" : "opacity-0 pointer-events-none"}`}>
                <div className="flex flex-col">
                  <label htmlFor="name" className="block text-[0.7rem] font-semibold text-[#475569] mb-1.5 uppercase tracking-[0.05em]">Nome Completo</label>
                  <div className={`group/input relative flex items-center w-full z-10 ${shakingFields.name ? "animate-elastic-shake" : ""}`}>
                    <span className="absolute left-3.5 text-[#94a3b8] group-focus-within/input:text-[#2563eb] flex items-center pointer-events-none transition-colors duration-200 z-20" aria-hidden="true"><UserIcon /></span>
                    
                    {/* Alterado de transition-all para transições cirúrgicas manuais, destruindo o bug do placeholder sumindo/indo para trás */}
                    <input
                      id="name"
                      type="text"
                      placeholder="Ex: João Silva"
                      required={!isSignin}
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => handleBlur("name")}
                      aria-invalid={!!(errors.name && touched.name)}
                      aria-describedby={errors.name && touched.name ? nameErrorId : undefined}
                      className={`w-full py-3 px-10 rounded-lg bg-white border text-sm font-medium transition-[border-color,box-shadow,background-color] duration-200 placeholder-[#94a3b8] focus:outline-none focus:bg-white focus:ring-2 relative z-10 ${errors.name && touched.name ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-[rgba(239,68,68,0.12)]" : "border-[#e2e8f0] focus:border-[#3b82f6] focus:ring-[rgba(37,99,235,0.15)]"}`}
                    />
                    {name && !isSignin && (
                      <button type="button" className="absolute right-3.5 bg-none border-none text-[#94a3b8] hover:text-[#0f172a] active:scale-90 flex items-center justify-center transition-colors duration-200 cursor-pointer p-0 z-20" onClick={() => setName("")} aria-label="Limpar nome">
                        <XIcon />
                      </button>
                    )}
                  </div>
                  {errors.name && touched.name && (
                    <span className="flex items-center gap-1 mt-1.5 text-[#ef4444] text-[0.72rem] font-semibold animate-fade-slide" id={nameErrorId} role="alert">
                      <AlertIcon /> {errors.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Campo: Endereço de E-mail */}
            <div className="flex flex-col mb-4 relative z-0">
              <label htmlFor="email" className="block text-[0.7rem] font-semibold text-[#475569] mb-1.5 uppercase tracking-[0.05em]">Endereço de E-mail</label>
              <div className={`group/input relative flex items-center w-full ${shakingFields.email ? "animate-elastic-shake" : ""}`}>
                <span className="absolute left-3.5 text-[#94a3b8] group-focus-within/input:text-[#2563eb] flex items-center pointer-events-none transition-colors duration-200 z-20" aria-hidden="true"><MailIcon /></span>
                <input
                  id="email"
                  type="email"
                  placeholder="nome@empresa.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  aria-invalid={!!(errors.email && touched.email)}
                  aria-describedby={errors.email && touched.email ? emailErrorId : undefined}
                  className={`w-full py-3 px-10 rounded-lg bg-white border text-sm font-medium transition-[border-color,box-shadow,background-color] duration-200 placeholder-[#94a3b8] focus:outline-none focus:bg-white focus:ring-2 relative z-10 ${errors.email && touched.email ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-[rgba(239,68,68,0.12)]" : "border-[#e2e8f0] focus:border-[#3b82f6] focus:ring-[rgba(37,99,235,0.15)]"}`}
                />
                {email && (
                  <button type="button" className="absolute right-3.5 bg-none border-none text-[#94a3b8] hover:text-[#0f172a] active:scale-90 flex items-center justify-center transition-colors duration-200 cursor-pointer p-0 z-20" onClick={() => setEmail("")} aria-label="Limpar e-mail">
                    <XIcon />
                  </button>
                )}
              </div>
              {errors.email && touched.email && (
                <span className="flex items-center gap-1 mt-1.5 text-[#ef4444] text-[0.72rem] font-semibold animate-fade-slide" id={emailErrorId} role="alert">
                  <AlertIcon /> {errors.email}
                </span>
              )}
            </div>

            {/* Campo: Senha */}
            <div className="flex flex-col mb-4 relative z-0">
              <label htmlFor="password" className="block text-[0.7rem] font-semibold text-[#475569] mb-1.5 uppercase tracking-[0.05em]">Senha</label>
              <div
                className={`group/input relative flex items-center w-full ${shakingFields.password ? "animate-elastic-shake" : ""}`}
                style={{
                  "--dynamic-focus-color": pwdStrength.color,
                  "--dynamic-glow-color": pwdStrength.glow
                } as React.CSSProperties}
              >
                <span className="absolute left-3.5 text-[#94a3b8] group-focus-within/input:text-[var(--dynamic-focus-color,#2563eb)] flex items-center pointer-events-none transition-colors duration-200 z-20" aria-hidden="true"><LockIcon /></span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mín. 8 Caracteres"
                  required
                  autoComplete={isSignin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={!!(errors.password && touched.password)}
                  aria-describedby={errors.password && touched.password ? passwordErrorId : undefined}
                  className={`w-full py-3 px-10 rounded-lg bg-white border text-sm font-medium placeholder-[#94a3b8] focus:ring-2 input-dynamic-reactive relative z-10 ${
                    errors.password && touched.password 
                      ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-[rgba(239,68,68,0.12)]" 
                      : "border-[#e2e8f0]"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3.5 bg-none border-none text-[#94a3b8] hover:text-[#0f172a] active:scale-90 flex items-center justify-center transition-colors duration-200 cursor-pointer p-0 z-20"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              {isSignin && errors.password && touched.password && (
                <span className="flex items-center gap-1 mt-1.5 text-[#ef4444] text-[0.72rem] font-semibold animate-fade-slide" id={passwordErrorId} role="alert">
                  <AlertIcon /> {errors.password}
                </span>
              )}

              {/* Checklist e Força da Senha */}
              <div className={`grid transition-[grid-template-rows,margin-top] duration-300 ease-in-out overflow-hidden ${(!isSignin && password) ? "grid-rows-[1fr] mt-2.5" : "grid-rows-[0fr] mt-0"}`} aria-live="polite">
                <div className={`min-h-0 transition-opacity duration-200 flex flex-col gap-2 [grid-row:1/2] [grid-column:1/2] ${(!isSignin && password) ? "opacity-100 delay-[80ms]" : "opacity-0"}`}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[0.72rem] font-semibold tracking-wide transition-colors duration-350" style={{ color: pwdStrength.color }}>
                      Segurança: {pwdStrength.text}
                    </span>
                    <div className="flex gap-1 h-1 w-1/2">
                      <div className={`flex-1 h-full rounded-full bg-[#e2e8f0] transition-all duration-350 ${pwdStrength.score >= 1 ? "scale-y-[1.15]" : ""}`} style={{ backgroundColor: pwdStrength.score >= 1 ? pwdStrength.color : undefined }} />
                      <div className={`flex-1 h-full rounded-full bg-[#e2e8f0] transition-all duration-350 ${pwdStrength.score >= 2 ? "scale-y-[1.15]" : ""}`} style={{ backgroundColor: pwdStrength.score >= 2 ? pwdStrength.color : undefined }} />
                      <div className={`flex-1 h-full rounded-full bg-[#e2e8f0] transition-all duration-350 ${pwdStrength.score >= 3 ? "scale-y-[1.15]" : ""}`} style={{ backgroundColor: pwdStrength.score >= 3 ? pwdStrength.color : undefined }} />
                      <div className={`flex-1 h-full rounded-full bg-[#e2e8f0] transition-all duration-350 ${pwdStrength.score >= 4 ? "scale-y-[1.15]" : ""}`} style={{ backgroundColor: pwdStrength.score >= 4 ? pwdStrength.color : undefined }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-x-3 gap-y-2 pt-2.5 border-t border-[#0f172a]/5">
                    <div className={`text-[0.62rem] font-semibold flex items-center gap-1.5 transition-colors duration-200 ${pwdReqs.length ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>
                      <CheckIcon met={pwdReqs.length} /> 8+ Caracteres
                    </div>
                    <div className={`text-[0.62rem] font-semibold flex items-center gap-1.5 transition-colors duration-200 ${pwdReqs.casing ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>
                      <CheckIcon met={pwdReqs.casing} /> Maiúsculas/minúsculas
                    </div>
                    <div className={`text-[0.62rem] font-semibold flex items-center gap-1.5 transition-colors duration-200 ${pwdReqs.number ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>
                      <CheckIcon met={pwdReqs.number} /> Pelo menos 1 número
                    </div>
                    <div className={`text-[0.62rem] font-semibold flex items-center gap-1.5 transition-colors duration-200 ${pwdReqs.special ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>
                      <CheckIcon met={pwdReqs.special} /> Caractere especial
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configurações Adicionais e Links Corrigidos com Rotas Reais */}
            {isSignin && (
              <div className="flex items-center justify-between mt-1 mb-5 text-xs min-[840px]:text-sm relative z-0">
                <label className="flex items-center gap-2 text-[#475569] font-medium cursor-pointer select-none group/check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-[15px] h-[15px] accent-[#2563eb] rounded border-slate-300 cursor-pointer transition-transform duration-150 group-active/check:scale-95"
                  />
                  Lembrar-me
                </label>
                <Link to="/forgot-password" className="text-[#475569] font-bold no-underline transition-colors duration-200 hover:text-[#2563eb] hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
            )}

            {/* Botão de Envio */}
            <button
              className={`group/signin w-full mt-2 py-3.5 px-5 rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5 relative overflow-hidden transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer z-10 ${
                isSuccess 
                  ? "bg-[#10b981] text-white pointer-events-none" 
                  : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.985]"
              }`}
              type="submit"
              disabled={isLoading || isSuccess}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spinner-rotate absolute top-1/2 left-1/2 -mt-3 -ml-3 w-6 h-6 z-10" viewBox="0 0 50 50">
                  <circle className="stroke-white [stroke-linecap:round] animate-spinner-dash" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
              ) : isSuccess ? (
                <>
                  <svg className="animate-pop-in" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Concluído</span>
                </>
              ) : (
                <>
                  <span>{isSignin ? "Entrar na plataforma" : "Cadastrar gratuitamente"}</span>
                  <svg className="translate-x-0 transition-transform duration-200 group-hover/signin:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Links de Termos Operacionais Finais */}
          <small className="block mt-5 text-[#94a3b8] leading-normal text-xs text-center relative z-0">
            Ao continuar, você concorda com nossos{" "}
            <Link to="/terms" className="text-[#475569] font-medium underline hover:text-[#2563eb] transition-colors">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link to="/privacy" className="text-[#475569] font-medium underline hover:text-[#2563eb] transition-colors">
              Política de Privacidade
            </Link>.
          </small>
        </div>
      </section>
    </main>
  );
}

export default Auth;