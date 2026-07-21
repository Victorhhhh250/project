import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Calendar,
  Clock,
  Plus,
  CreditCard,
  UserPlus,
  XCircle,
  RefreshCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/* ── Estilos Centralizados no JS (Design System Refinado) ── */
const STYLES = {
  card: "bg-white rounded-[24px] border border-slate-100/80 p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-500",
  btnPrimary: "flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer",
  btnOutline: "flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors",
  trendUp: "flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-emerald-50/80 text-emerald-600",
  trendDown: "flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-red-50/80 text-red-600",
};

const statusStyle: Record<string, string> = {
  Ativo: 'bg-emerald-50 text-emerald-600 px-3 py-1.5 text-[11px] font-medium rounded-full',
  Pendente: 'bg-amber-50 text-amber-600 px-3 py-1.5 text-[11px] font-medium rounded-full',
  Inativo: 'bg-slate-100 text-slate-500 px-3 py-1.5 text-[11px] font-medium rounded-full',
};

const planStyle: Record<string, string> = {
  Basic: 'text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 text-[11px] font-medium rounded-lg',
  Pro: 'text-blue-600 bg-blue-50/50 border border-blue-100/50 px-2.5 py-1 text-[11px] font-medium rounded-lg',
  Enterprise: 'text-indigo-600 bg-indigo-50/50 border border-indigo-100/50 px-2.5 py-1 text-[11px] font-medium rounded-lg',
};

/* ── Dados ─────────────────────────────────── */
const stats = [
  { label: 'Total de Alunos', value: '248', change: '+12', changeLabel: 'vs. mês anterior', up: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50/50' },
  { label: 'Alunos Ativos', value: '186', change: '+8', changeLabel: 'vs. mês anterior', up: true, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
  { label: 'Receita Mensal', value: 'R$ 24.8k', change: '+6.2%', changeLabel: 'vs. mês anterior', up: true, icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-50/50' },
  { label: 'Taxa de Retenção', value: '94.2%', change: '-1.3%', changeLabel: 'vs. mês anterior', up: false, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50/50' },
];

const recentStudents = [
  { name: 'Ana Souza', plan: 'Pro', status: 'Ativo', date: '18 Jul 2026', avatar: 'AS' },
  { name: 'Bruno Lima', plan: 'Basic', status: 'Ativo', date: '16 Jul 2026', avatar: 'BL' },
  { name: 'Carla Mendes', plan: 'Enterprise', status: 'Ativo', date: '14 Jul 2026', avatar: 'CM' },
  { name: 'Diego Rocha', plan: 'Basic', status: 'Pendente', date: '12 Jul 2026', avatar: 'DR' },
  { name: 'Elisa Ferreira', plan: 'Pro', status: 'Ativo', date: '10 Jul 2026', avatar: 'EF' },
];

const activities = [
  { text: 'Ana Souza realizou uma nova matrícula no plano Pro.', time: 'Há 2 horas', icon: UserPlus, color: 'text-slate-400', bg: 'bg-slate-50' },
  { text: 'Pagamento de R$ 299,00 processado para Bruno Lima.', time: 'Há 4 horas', icon: CreditCard, color: 'text-slate-400', bg: 'bg-slate-50' },
  { text: 'A aula "Personal Training 09h" foi cancelada.', time: 'Há 6 horas', icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-50' },
  { text: 'Renovação automática do plano Pro de Bruno Lima.', time: 'Ontem, 14:30', icon: RefreshCcw, color: 'text-slate-400', bg: 'bg-slate-50' },
  { text: 'Novo agendamento criado para Yoga em 21/07.', time: 'Ontem, 09:15', icon: Calendar, color: 'text-slate-400', bg: 'bg-slate-50' },
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
  { name: 'Pro', value: 118, color: '#3b82f6' },
  { name: 'Enterprise', value: 38, color: '#0f172a' },
];

/* ── Componente Principal ────────────────────────────── */
export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <div className="min-h-screen bg-[#F8FAFC]/50 selection:bg-blue-100">
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
        
        {/* Greeting & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight animate-fade-slide">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-slate-500 mt-1 capitalize animate-fade-slide" style={{ animationDelay: '0.1s' }}>
              {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-4 animate-fade-slide" style={{ animationDelay: '0.2s' }}>
            <div className={`hidden md:flex ${STYLES.btnOutline}`}>
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{formattedTime}</span>
            </div>

            <button
              className={STYLES.btnPrimary}
              onClick={() => alert('Abrir modal de nova matrícula')}
            >
              <Plus className="w-4 h-4" />
              Nova Matrícula
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`${STYLES.card} animate-card-enter flex flex-col justify-between`} 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-6">
                <p className="text-[13px] font-medium text-slate-500">{stat.label}</p>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon size={18} strokeWidth={2} />
                </div>
              </div>

              <div>
                <p className="text-3xl font-semibold text-slate-800 tracking-tight">{stat.value}</p>
              </div>

              <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-slate-100/60">
                <div className={stat.up ? STYLES.trendUp : STYLES.trendDown}>
                  {stat.up ? <ArrowUpRight size={13} strokeWidth={2.5} /> : <ArrowDownRight size={13} strokeWidth={2.5} />}
                  {stat.change}
                </div>
                <span className="text-[11px] font-medium text-slate-400">{stat.changeLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Revenue Line Chart */}
          <div className={`xl:col-span-2 ${STYLES.card} animate-fade-slide flex flex-col`} style={{ animationDelay: '0.4s' }}>
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Evolução de Receita</h3>
                <p className="text-slate-400 text-[13px] mt-1">Desempenho financeiro dos últimos 6 meses</p>
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={12} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value / 1000}k`} />
                  <Tooltip
                    cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '16px', 
                      border: '1px solid #f1f5f9', 
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', 
                      fontSize: '12px', 
                      color: '#334155',
                      padding: '12px 16px'
                    }}
                    itemStyle={{ color: '#0f172a', fontWeight: 600, paddingBottom: '4px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="receita" 
                    name="Receita" 
                    stroke="#0f172a" 
                    strokeWidth={2.5} 
                    dot={false}
                    activeDot={{ r: 5, fill: '#0f172a', stroke: '#fff', strokeWidth: 3 }} 
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className={`${STYLES.card} animate-fade-slide flex flex-col`} style={{ animationDelay: '0.5s' }}>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800">Distribuição por Plano</h3>
              <p className="text-slate-400 text-[13px] mt-1">Total de assinaturas ativas</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative min-h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={planDistribution} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={75} 
                    outerRadius={100} 
                    paddingAngle={2} 
                    dataKey="value" 
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={1500}
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-90 transition-opacity cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '12px', 
                      border: '1px solid #f1f5f9', 
                      boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                      fontSize: '12px',
                      fontWeight: 500,
                      padding: '8px 12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                <span className="text-2xl font-semibold text-slate-800 tracking-tight">248</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Alunos</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-3 pt-6 border-t border-slate-100/60">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: plan.color }} />
                    <span className="font-medium text-slate-600">{plan.name}</span>
                  </div>
                  <span className="text-slate-500">{plan.value} <span className="text-slate-300 ml-1">({((plan.value / 248) * 100).toFixed(0)}%)</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Recent Students */}
          <div className={`${STYLES.card} !p-0 overflow-hidden flex flex-col animate-fade-slide`} style={{ animationDelay: '0.6s' }}>
            <div className="px-7 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Matrículas Recentes</h3>
              </div>
              <Link to={ROUTES.alunos} className="flex items-center gap-1 text-slate-400 hover:text-slate-800 font-medium text-[13px] transition-colors group">
                Ver todos
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="divide-y divide-slate-50 flex-1">
              {recentStudents.map((student, i) => (
                <div key={i} className="px-7 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-medium text-xs flex-shrink-0">
                    {student.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-800 truncate">{student.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{student.date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={planStyle[student.plan]}>{student.plan}</span>
                    <span className={statusStyle[student.status]}>{student.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className={`${STYLES.card} animate-fade-slide`} style={{ animationDelay: '0.7s' }}>
            <h3 className="text-base font-semibold text-slate-800 mb-8">Atividade Recente</h3>
            
            <div className="relative pl-2">
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-100" />
              
              <div className="space-y-8 relative">
                {activities.map((activity, i) => (
                  <div key={i} className="flex gap-5 group cursor-default">
                    <div className={`w-8 h-8 rounded-full border-[3px] border-white flex items-center justify-center flex-shrink-0 z-10 ${activity.bg} ${activity.color} shadow-sm`}>
                      <activity.icon size={13} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className="text-[13px] text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">{activity.text}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{activity.time}</p>
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