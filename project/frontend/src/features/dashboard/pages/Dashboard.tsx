import { Users, TrendingUp, DollarSign, Activity, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

/* ── Data ─────────────────────────────────────────── */
const stats = [
  {
    label: 'Total de Alunos', value: '248', change: '+12', changeLabel: 'este mês',
    up: true, icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-[#2563eb]',
    border: 'bg-[#2563eb]', bar: '#2563eb', progress: 75,
  },
  {
    label: 'Alunos Ativos', value: '186', change: '+8', changeLabel: 'este mês',
    up: true, icon: Activity, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
    border: 'bg-emerald-500', bar: '#10b981', progress: 62,
  },
  {
    label: 'Receita Mensal', value: 'R$ 24.8k', change: '+6,2%', changeLabel: 'vs. anterior',
    up: true, icon: DollarSign, iconBg: 'bg-violet-50', iconColor: 'text-violet-600',
    border: 'bg-violet-500', bar: '#8b5cf6', progress: 88,
  },
  {
    label: 'Taxa de Retenção', value: '94%', change: '-1,3%', changeLabel: 'vs. anterior',
    up: false, icon: TrendingUp, iconBg: 'bg-amber-50', iconColor: 'text-amber-600',
    border: 'bg-amber-400', bar: '#f59e0b', progress: 94,
  },
];

const recentStudents = [
  { name: 'Ana Souza',     plan: 'Pro',        status: 'Ativo',    date: '18 Jul 2026', avatar: 'AS', color: '#3b82f6' },
  { name: 'Bruno Lima',    plan: 'Basic',      status: 'Ativo',    date: '16 Jul 2026', avatar: 'BL', color: '#8b5cf6' },
  { name: 'Carla Mendes',  plan: 'Enterprise', status: 'Ativo',    date: '14 Jul 2026', avatar: 'CM', color: '#10b981' },
  { name: 'Diego Rocha',   plan: 'Basic',      status: 'Pendente', date: '12 Jul 2026', avatar: 'DR', color: '#f59e0b' },
  { name: 'Elisa Ferreira',plan: 'Pro',        status: 'Ativo',    date: '10 Jul 2026', avatar: 'EF', color: '#ef4444' },
];

const activities = [
  { text: 'Nova matrícula: Ana Souza — Plano Pro',      time: 'há 2h',  dot: 'bg-[#2563eb]' },
  { text: 'Pagamento recebido: R$ 299,00 — Bruno Lima', time: 'há 4h',  dot: 'bg-emerald-500' },
  { text: 'Aula cancelada: Personal Training 09h',       time: 'há 6h',  dot: 'bg-red-400' },
  { text: 'Renovação: Bruno Lima — Plano Pro',          time: 'ontem',  dot: 'bg-violet-500' },
  { text: 'Novo agendamento: Yoga — 21/07',             time: 'ontem',  dot: 'bg-amber-400' },
];

const statusStyle: Record<string, string> = {
  Ativo:    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Pendente: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Inativo:  'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
};

const planStyle: Record<string, { cls: string; dot: string }> = {
  Basic:      { cls: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-400' },
  Pro:        { cls: 'bg-blue-50 text-[#1d4ed8]',     dot: 'bg-[#2563eb]' },
  Enterprise: { cls: 'bg-violet-50 text-violet-700',  dot: 'bg-violet-500' },
};

/* ── Component ─────────────────────────────────────── */
export default function Dashboard() {
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-5">

      {/* ── Hero banner (Auth left-panel language) ── */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #1e293b 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
      >
        {/* Orbs */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: '#2563eb', filter: 'blur(70px)', opacity: 0.15 }} />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: '#1e3a8a', filter: 'blur(60px)', opacity: 0.18 }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white/40 text-[0.62rem] font-bold tracking-[0.2em] uppercase">Atlhon CRM Suite</span>
            </div>
            <h2 className="text-white text-[1.4rem] font-bold tracking-tight leading-none">
              Bom dia, Admin 👋
            </h2>
            <p className="text-white/40 text-[0.78rem] mt-1.5 capitalize">{today} · Plataforma operando normalmente</p>
          </div>

          {/* Right — quick numbers */}
          <div className="hidden sm:flex items-center gap-5 shrink-0">
            <div className="text-right">
              <p className="text-white text-[1.5rem] font-bold leading-none tracking-tight">248</p>
              <p className="text-white/38 text-[0.68rem] mt-1 font-medium">Total Alunos</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-right">
              <p className="text-white text-[1.5rem] font-bold leading-none tracking-tight">R$ 24.8k</p>
              <p className="text-white/38 text-[0.68rem] mt-1 font-medium">Receita Mensal</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-right">
              <p className="text-emerald-400 text-[1.5rem] font-bold leading-none tracking-tight">94%</p>
              <p className="text-white/38 text-[0.68rem] mt-1 font-medium">Retenção</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, changeLabel, up, icon: Icon, iconBg, iconColor, border, bar, progress }) => (
          <div
            key={label}
            className="relative bg-white rounded-xl border border-[#e2e8f0] p-5 overflow-hidden hover:shadow-md hover:shadow-black/[0.05] hover:-translate-y-px transition-all duration-200 cursor-default"
          >
            {/* Left accent border */}
            <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl ${border}`} />

            <div className="flex items-start justify-between mb-4">
              <p className="text-[0.7rem] font-bold text-[#94a3b8] uppercase tracking-wider leading-none">{label}</p>
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} ${iconColor} shrink-0`}>
                <Icon size={16} />
              </span>
            </div>

            <p className="text-[2rem] font-bold text-[#0f172a] leading-none tracking-tight mb-3">{value}</p>

            {/* Progress bar */}
            <div className="h-[3px] bg-[#f1f5f9] rounded-full overflow-hidden mb-3">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: bar }} />
            </div>

            <div className={`flex items-center gap-1 text-[0.72rem] font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
              {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              <span>{change}</span>
              <span className="text-[#94a3b8] font-normal">{changeLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
            <div>
              <p className="text-[0.88rem] font-bold text-[#0f172a]">Matrículas Recentes</p>
              <p className="text-[0.7rem] text-[#94a3b8] mt-0.5">Últimas 5 matrículas na plataforma</p>
            </div>
            <Link
              to={ROUTES.alunos}
              className="flex items-center gap-1 text-[0.75rem] text-[#2563eb] font-semibold hover:text-[#1d4ed8] transition-colors no-underline"
            >
              Ver todos <ChevronRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-[#f8fafc]">
            {recentStudents.map(({ name, plan, status, date, avatar, color }) => (
              <div key={name} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#fafbfc] transition-colors group cursor-pointer">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.6rem] font-bold shrink-0"
                  style={{ background: color }}
                >
                  {avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.83rem] font-semibold text-[#0f172a] truncate">{name}</p>
                  <p className="text-[#94a3b8] text-[0.7rem]">{date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`flex items-center gap-1 text-[0.65rem] font-bold px-2 py-[3px] rounded-md ${planStyle[plan].cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${planStyle[plan].dot}`} />
                    {plan}
                  </span>
                  <span className={`text-[0.65rem] font-semibold px-2 py-[3px] rounded-full ${statusStyle[status]}`}>{status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <p className="text-[0.88rem] font-bold text-[#0f172a]">Atividade Recente</p>
            <p className="text-[0.7rem] text-[#94a3b8] mt-0.5">Últimas ações na plataforma</p>
          </div>
          <div className="px-5 py-4">
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[#f1f5f9]" />
              <div className="space-y-4">
                {activities.map(({ text, time, dot }) => (
                  <div key={text} className="flex gap-3 pl-[18px] relative">
                    <span className={`absolute left-0 w-[11px] h-[11px] rounded-full mt-0.5 shrink-0 ${dot} ring-[3px] ring-white`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.78rem] font-medium text-[#334155] leading-snug">{text}</p>
                      <p className="text-[0.68rem] text-[#94a3b8] mt-0.5">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
