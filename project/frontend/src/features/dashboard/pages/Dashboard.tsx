import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Clock,
  Plus,
  CreditCard,
  UserPlus,
  XCircle,
  RefreshCcw,
  Calendar,
  Download,
  Search,
  MoreHorizontal,
  Sparkles,
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
} from 'recharts';
import { ROUTES } from '@/constants/routes';

/* ── Tipagens Estritas do TypeScript ── */
type StatusType = 'Ativo' | 'Pendente' | 'Inativo';
type PlanType = 'Basic' | 'Pro' | 'Enterprise';

interface Student {
  id: number;
  name: string;
  email: string;
  plan: PlanType;
  status: StatusType;
  date: string;
  avatar: string;
}

interface ActivityItem {
  id: number;
  text: string;
  time: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

/* ── Mapeamento de Status e Planos ── */
const statusBadge: Record<StatusType, { label: string; style: string; dot: string }> = {
  Ativo: {
    label: 'Ativo',
    style: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
    dot: 'bg-emerald-500 animate-pulse-glow',
  },
  Pendente: {
    label: 'Pendente',
    style: 'bg-amber-50 text-amber-600 border-amber-200/60',
    dot: 'bg-amber-500',
  },
  Inativo: {
    label: 'Inativo',
    style: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
  },
};

const planBadge: Record<PlanType, string> = {
  Basic: 'text-slate-500 bg-slate-50 border-slate-200',
  Pro: 'text-blue-600 bg-blue-50/50 border-blue-100/50',
  Enterprise: 'text-indigo-600 bg-indigo-50/50 border-indigo-100/50',
};

/* ── Dados de Exemplo ── */
const stats = [
  { label: 'Total de Alunos', value: '248', change: '+12', changeLabel: 'vs. mês anterior', up: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50/50' },
  { label: 'Alunos Ativos', value: '186', change: '+8', changeLabel: 'vs. mês anterior', up: true, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
  { label: 'Receita Mensal', value: 'R$ 24.8k', change: '+6.2%', changeLabel: 'vs. mês anterior', up: true, icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-50/50' },
  { label: 'Taxa de Retenção', value: '94.2%', change: '-1.3%', changeLabel: 'vs. mês anterior', up: false, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50/50' },
];

const recentStudentsData: Student[] = [
  { id: 1, name: 'Ana Souza', email: 'ana.souza@email.com', plan: 'Pro', status: 'Ativo', date: '18 Jul 2026', avatar: 'AS' },
  { id: 2, name: 'Bruno Lima', email: 'bruno.lima@email.com', plan: 'Basic', status: 'Ativo', date: '16 Jul 2026', avatar: 'BL' },
  { id: 3, name: 'Carla Mendes', email: 'carla.m@email.com', plan: 'Enterprise', status: 'Ativo', date: '14 Jul 2026', avatar: 'CM' },
  { id: 4, name: 'Diego Rocha', email: 'diego.r@email.com', plan: 'Basic', status: 'Pendente', date: '12 Jul 2026', avatar: 'DR' },
  { id: 5, name: 'Elisa Ferreira', email: 'elisa.f@email.com', plan: 'Pro', status: 'Ativo', date: '10 Jul 2026', avatar: 'EF' },
];

const activities: ActivityItem[] = [
  { id: 1, text: 'Ana Souza realizou uma nova matrícula no plano Pro.', time: 'Há 2 horas', icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-50/50' },
  { id: 2, text: 'Pagamento de R$ 299,00 processado para Bruno Lima.', time: 'Há 4 horas', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
  { id: 3, text: 'A aula "Personal Training 09h" foi cancelada.', time: 'Há 6 horas', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50/50' },
  { id: 4, text: 'Renovação automática do plano Pro de Bruno Lima.', time: 'Ontem, 14:30', icon: RefreshCcw, color: 'text-indigo-500', bg: 'bg-indigo-50/50' },
  { id: 5, text: 'Novo agendamento criado para Yoga em 21/07.', time: 'Ontem, 09:15', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50/50' },
];

const revenueData = [
  { month: 'Jan', receita: 18500 },
  { month: 'Fev', receita: 19200 },
  { month: 'Mar', receita: 20400 },
  { month: 'Abr', receita: 21800 },
  { month: 'Mai', receita: 22900 },
  { month: 'Jun', receita: 24800 },
];

const planDistribution = [
  { name: 'Basic', value: 92, color: '#94a3b8' },
  { name: 'Pro', value: 118, color: '#2563eb' },
  { name: 'Enterprise', value: 38, color: '#0f172a' },
];

/* ── Tooltip Customizado Recharts ── */
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const rawValue = payload[0]?.value;
    const formattedValue = typeof rawValue === 'number' ? rawValue.toLocaleString('pt-BR') : '0';
    return (
      <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700/50 text-xs space-y-1 animate-pop-in">
        <p className="font-medium text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-white">R$ {formattedValue}</p>
      </div>
    );
  }
  return null;
};

/* ── Componente Principal ── */
export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<'6M' | '30D' | '1Y'>('6M');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentTab, setStudentTab] = useState<'Todos' | 'Ativo' | 'Pendente'>('Todos');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const filteredStudents = useMemo(() => {
    return recentStudentsData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesTab = studentTab === 'Todos' || student.status === studentTab;
      return matchesSearch && matchesTab;
    });
  }, [studentSearch, studentTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]/50 selection:bg-blue-100 text-slate-800">
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">

        {/* ── HEADER & ACTIONS ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 animate-fade-slide">
              <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Visão Geral</h1>
              <span className="page-tag">
                <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" /> Ao vivo
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 capitalize animate-fade-slide delay-100">
              {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-3 animate-fade-slide delay-200">
            <div className="hidden md:flex btn-outline items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-xs">{formattedTime}</span>
            </div>

            <button className="btn-outline" onClick={() => alert('Exportando relatório...')}>
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button className="btn-primary" onClick={() => alert('Abrir modal de nova matrícula')}>
              <Plus className="w-4 h-4" />
              <span>Nova Matrícula</span>
            </button>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="panel-card animate-card-enter flex flex-col justify-between"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[13px] font-medium text-slate-500">{stat.label}</span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon size={18} strokeWidth={2} />
                </div>
              </div>

              <div>
                <p className="text-3xl font-semibold text-slate-800 tracking-tight">{stat.value}</p>
              </div>

              <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-slate-100/60">
                <div className={stat.up ? 'trend-up' : 'trend-down'}>
                  {stat.up
                    ? <ArrowUpRight size={13} strokeWidth={2.5} />
                    : <ArrowDownRight size={13} strokeWidth={2.5} />}
                  {stat.change}
                </div>
                <span className="text-[11px] font-medium text-slate-400">{stat.changeLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── CHARTS SECTION ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Gráfico de Evolução de Receita */}
          <div
            className="xl:col-span-2 panel-card animate-fade-slide flex flex-col justify-between"
            style={{ animationDelay: '0.35s' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Evolução de Receita</h3>
                <p className="text-slate-400 text-[13px] mt-1">Desempenho financeiro em tempo real</p>
              </div>

              <div className="tab-bar self-start sm:self-auto">
                {(['30D', '6M', '1Y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`tab-item ${selectedRange === range ? 'tab-item-active' : ''}`}
                  >
                    {range === '30D' ? '30 dias' : range === '6M' ? '6 meses' : '1 ano'}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={12} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorReceita)"
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                    activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribuição por Plano */}
          <div
            className="panel-card animate-fade-slide flex flex-col justify-between"
            style={{ animationDelay: '0.45s' }}
          >
            <div>
              <h3 className="text-base font-semibold text-slate-800">Distribuição por Plano</h3>
              <p className="text-slate-400 text-[13px] mt-1">Total de assinaturas ativas</p>
            </div>

            <div className="relative flex items-center justify-center my-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-85 transition-opacity cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                <span className="text-2xl font-semibold text-slate-800 tracking-tight animate-pop-in">248</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Alunos</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100/60">
              {planDistribution.map((plan) => {
                const percentage = ((plan.value / 248) * 100).toFixed(0);
                return (
                  <div key={plan.name} className="space-y-1 text-[13px]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-600 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: plan.color }} />
                        {plan.name}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {plan.value} <span className="text-slate-300 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: plan.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── BOTTOM SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Tabela de Matrículas Recentes */}
          <div
            className="lg:col-span-2 panel-card !p-0 overflow-hidden flex flex-col justify-between animate-fade-slide"
            style={{ animationDelay: '0.55s' }}
          >
            <div className="p-6 border-b border-slate-100 space-y-4 bg-white/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-800">Matrículas Recentes</h3>
                <Link
                  to={ROUTES.alunos}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-800 font-medium text-[13px] transition-colors group"
                >
                  Ver todos
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar aluno ou e-mail..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="input-field pl-9 pr-3 py-1.5"
                  />
                </div>

                <div className="tab-bar w-full sm:w-auto">
                  {(['Todos', 'Ativo', 'Pendente'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStudentTab(tab)}
                      className={`tab-item flex-1 sm:flex-initial ${studentTab === tab ? 'tab-item-active' : ''}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-50 flex-1 min-h-[280px]">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => {
                  const status = statusBadge[student.status];
                  return (
                    <div
                      key={student.id}
                      className="px-7 py-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors group cursor-pointer animate-fade-slide"
                      style={{ animationDelay: `${0.05 * idx}s` }}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-medium text-xs flex-shrink-0 group-hover:border-blue-200 group-hover:bg-blue-50/50 group-hover:text-blue-600 transition-colors">
                          {student.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-slate-800 truncate">{student.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{student.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`hidden sm:inline-block border px-2.5 py-1 text-[11px] font-medium rounded-lg ${planBadge[student.plan]}`}>
                          {student.plan}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-[11px] font-medium rounded-full ${status.style}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                        <button className="btn-icon">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs animate-fade-slide">
                  Nenhum aluno encontrado para os filtros selecionados.
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div
            className="panel-card animate-fade-slide flex flex-col justify-between"
            style={{ animationDelay: '0.65s' }}
          >
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-8">Atividade Recente</h3>

              <div className="relative pl-2">
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-100" />

                <div className="space-y-8 relative">
                  {activities.map((act) => (
                    <div key={act.id} className="flex gap-5 group cursor-default">
                      <div className={`w-8 h-8 rounded-full border-[3px] border-white flex items-center justify-center flex-shrink-0 z-10 ${act.bg} ${act.color} shadow-sm`}>
                        <act.icon size={13} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 pt-1.5">
                        <p className="text-[13px] text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                          {act.text}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn-outline w-full mt-6 py-2 justify-center text-xs font-semibold">
              Ver histórico completo
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
