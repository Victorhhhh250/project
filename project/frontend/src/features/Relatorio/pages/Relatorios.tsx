import { useState } from 'react';
import {
  Download,
  BarChart2,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const retencionData = [
  { month: 'Jan', retencao: 91.2 },
  { month: 'Fev', retencao: 92.5 },
  { month: 'Mar', retencao: 90.8 },
  { month: 'Abr', retencao: 93.1 },
  { month: 'Mai', retencao: 94.0 },
  { month: 'Jun', retencao: 94.2 },
  { month: 'Jul', retencao: 95.1 },
];

const matriculasData = [
  { month: 'Jan', novas: 14, cancelamentos: 6 },
  { month: 'Fev', novas: 18, cancelamentos: 4 },
  { month: 'Mar', novas: 22, cancelamentos: 7 },
  { month: 'Abr', novas: 19, cancelamentos: 5 },
  { month: 'Mai', novas: 25, cancelamentos: 3 },
  { month: 'Jun', novas: 28, cancelamentos: 4 },
  { month: 'Jul', novas: 12, cancelamentos: 2 },
];

const planDistribution = [
  { name: 'Basic',      value: 92,  color: '#94a3b8' },
  { name: 'Pro',        value: 118, color: '#2563eb' },
  { name: 'Enterprise', value: 38,  color: '#0f172a' },
];

const topInstructors = [
  { name: 'Carlos Eduardo', aulas: 42, alunos: 38, nota: 4.9 },
  { name: 'Juliana Torres',  aulas: 36, alunos: 31, nota: 4.8 },
  { name: 'Maria Clara',     aulas: 34, alunos: 29, nota: 4.9 },
  { name: 'Fernanda Lima',   aulas: 28, alunos: 24, nota: 4.7 },
  { name: 'Roberto Alves',   aulas: 22, alunos: 19, nota: 4.6 },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string; color?: string }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700/50 text-xs space-y-1">
      <p className="font-medium text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.name?.includes('%') ? `${p.value}%` : p.value}
        </p>
      ))}
    </div>
  );
}

const REPORT_TYPES = [
  { id: 'geral',       label: 'Visão Geral',   icon: BarChart2 },
  { id: 'alunos',      label: 'Alunos',        icon: Users },
  { id: 'financeiro',  label: 'Financeiro',    icon: DollarSign },
  { id: 'instrutores', label: 'Instrutores',   icon: TrendingUp },
];

const PERIODS = ['Últimos 7 dias', 'Este mês', 'Últimos 3 meses', 'Este ano'];

export default function Relatorios() {
  const [activeReport, setActiveReport] = useState('geral');
  const [period, setPeriod] = useState('Este mês');

  return (
    <div className="space-y-6 text-slate-800">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 animate-fade-slide">
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Relatórios</h1>
            <span className="page-tag">
              <Sparkles className="w-3 h-3 text-blue-500" /> Análise
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 animate-fade-slide delay-100">
            Métricas e indicadores de performance da plataforma
          </p>
        </div>
        <div className="flex items-center gap-3 animate-fade-slide delay-200">
          <div className="relative">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}
              className="input-field pl-3 pr-8 py-2 appearance-none cursor-pointer text-slate-700 text-xs">
              {PERIODS.map((p) => <option key={p}>{p}</option>)}
            </select>
            <Calendar size={13} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>
          <button type="button" className="btn-outline" onClick={() => alert('Exportando relatório...')}>
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 animate-fade-slide delay-100">
        {REPORT_TYPES.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setActiveReport(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
              activeReport === id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Taxa de Retenção',  value: '95.1%',  change: '+0.9%',  up: true  },
          { label: 'Novas Matrículas',  value: '12',     change: '+4',     up: true  },
          { label: 'Receita (Mês)',     value: 'R$ 11,2k', change: '+12%', up: true  },
          { label: 'Ticket Médio',      value: 'R$ 247', change: '-R$ 8',  up: false },
        ].map((stat, i) => (
          <div key={i} className="panel-card-sm animate-card-enter flex flex-col justify-between" style={{ animationDelay: `${i * 0.07}s` }}>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-2 mb-3">{stat.value}</p>
            <div className={stat.up ? 'trend-up' : 'trend-down'}>
              {stat.up ? <ArrowUpRight size={11} strokeWidth={2.5} /> : <ArrowDownRight size={11} strokeWidth={2.5} />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 panel-card animate-fade-slide" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Novas Matrículas vs. Cancelamentos</h3>
              <p className="text-slate-400 text-[13px] mt-0.5">Fluxo mensal de alunos</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500 shrink-0" /> Novas</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-400 shrink-0" /> Cancelamentos</span>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matriculasData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="novas"          name="Novas"          fill="#2563eb" radius={[5, 5, 0, 0]} />
                <Bar dataKey="cancelamentos"  name="Cancelamentos"  fill="#fca5a5" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel-card animate-fade-slide" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-base font-semibold text-slate-800 mb-1">Distribuição por Plano</h3>
          <p className="text-slate-400 text-[13px] mb-4">Assinaturas ativas</p>
          <div className="relative flex items-center justify-center h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={82} paddingAngle={3} dataKey="value" stroke="none">
                  {planDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-800">248</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">alunos</span>
            </div>
          </div>
          <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
            {planDistribution.map((plan) => {
              const pct = ((plan.value / 248) * 100).toFixed(0);
              return (
                <div key={plan.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: plan.color }} />
                      {plan.name}
                    </span>
                    <span className="text-slate-500">{plan.value} <span className="text-slate-300">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: plan.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Retenção + Instrutores */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="panel-card animate-fade-slide" style={{ animationDelay: '0.5s' }}>
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-800">Taxa de Retenção</h3>
            <p className="text-slate-400 text-[13px] mt-0.5">Evolução mensal em %</p>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retencionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRetencao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[85, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value) => [`${value ?? 0}%`, 'Retenção']} />
                <Area type="monotone" dataKey="retencao" name="Retenção" stroke="#10b981" strokeWidth={2.5} fill="url(#colorRetencao)" activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel-card animate-fade-slide" style={{ animationDelay: '0.55s' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Top Instrutores</h3>
              <p className="text-slate-400 text-[13px] mt-0.5">Por volume de aulas no período</p>
            </div>
            <button type="button" className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer">
              <FileText size={13} /> Relatório completo
            </button>
          </div>
          <div className="space-y-3">
            {topInstructors.map((inst, i) => (
              <div key={inst.name} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50/70 transition-colors">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{inst.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{inst.aulas} aulas · {inst.alunos} alunos</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                  ★ {inst.nota}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
