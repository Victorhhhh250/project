import { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Download,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Receipt,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

type TransactionStatus = 'Pago' | 'Pendente' | 'Atrasado' | 'Cancelado';
type TransactionType = 'Receita' | 'Despesa';

interface Transaction {
  id: number;
  description: string;
  student: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
  method: string;
}

const statusBadge: Record<TransactionStatus, { style: string; dot: string }> = {
  Pago:      { style: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500' },
  Pendente:  { style: 'bg-amber-50 text-amber-700 border-amber-200/60',       dot: 'bg-amber-500 animate-pulse' },
  Atrasado:  { style: 'bg-rose-50 text-rose-700 border-rose-200/60',          dot: 'bg-rose-500 animate-pulse' },
  Cancelado: { style: 'bg-slate-100 text-slate-500 border-slate-200',          dot: 'bg-slate-400' },
};

const mockTransactions: Transaction[] = [
  { id: 1,  description: 'Plano Pro — Mensal',      student: 'Ana Souza',      amount: 299,  type: 'Receita',  status: 'Pago',      date: '20 Jul 2026', method: 'Cartão' },
  { id: 2,  description: 'Plano Basic — Mensal',    student: 'Bruno Lima',     amount: 149,  type: 'Receita',  status: 'Pago',      date: '19 Jul 2026', method: 'PIX' },
  { id: 3,  description: 'Plano Enterprise — Anual',student: 'Carla Mendes',   amount: 4788, type: 'Receita',  status: 'Pago',      date: '18 Jul 2026', method: 'Boleto' },
  { id: 4,  description: 'Plano Basic — Mensal',    student: 'Diego Rocha',    amount: 149,  type: 'Receita',  status: 'Pendente',  date: '17 Jul 2026', method: 'Boleto' },
  { id: 5,  description: 'Plano Pro — Mensal',      student: 'Elisa Ferreira', amount: 299,  type: 'Receita',  status: 'Pago',      date: '16 Jul 2026', method: 'Cartão' },
  { id: 6,  description: 'Taxa de Matrícula',       student: 'Felipe Santos',  amount: 80,   type: 'Receita',  status: 'Atrasado',  date: '10 Jul 2026', method: 'Boleto' },
  { id: 7,  description: 'Plano Pro — Mensal',      student: 'Gabriela Costa', amount: 299,  type: 'Receita',  status: 'Pago',      date: '09 Jul 2026', method: 'Cartão' },
  { id: 8,  description: 'Aluguel — Studio',        student: '—',              amount: 3500, type: 'Despesa',  status: 'Pago',      date: '05 Jul 2026', method: 'Transferência' },
  { id: 9,  description: 'Equipamentos',            student: '—',              amount: 850,  type: 'Despesa',  status: 'Pago',      date: '03 Jul 2026', method: 'Cartão' },
  { id: 10, description: 'Plano Enterprise — Anual',student: 'Henrique Alves', amount: 4788, type: 'Receita',  status: 'Cancelado', date: '01 Jul 2026', method: 'Boleto' },
];

const revenueData = [
  { month: 'Jan', receita: 18500, despesas: 7200 },
  { month: 'Fev', receita: 19200, despesas: 6800 },
  { month: 'Mar', receita: 20400, despesas: 7500 },
  { month: 'Abr', receita: 21800, despesas: 8100 },
  { month: 'Mai', receita: 22900, despesas: 7900 },
  { month: 'Jun', receita: 24800, despesas: 8400 },
  { month: 'Jul', receita: 11200, despesas: 4350 },
];

const inadimplenciaData = [
  { month: 'Jan', taxa: 4.2 },
  { month: 'Fev', taxa: 3.8 },
  { month: 'Mar', taxa: 5.1 },
  { month: 'Abr', taxa: 3.3 },
  { month: 'Mai', taxa: 2.9 },
  { month: 'Jun', taxa: 3.6 },
  { month: 'Jul', taxa: 2.1 },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string; color?: string }>;
  label?: string;
}

function RevenueTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700/50 text-xs space-y-1">
      <p className="font-medium text-slate-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: R$ {(p.value ?? 0).toLocaleString('pt-BR')}
        </p>
      ))}
    </div>
  );
}

export default function Financeiro() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'Todos' | TransactionType>('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = useMemo(() => {
    return mockTransactions.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch = t.description.toLowerCase().includes(q) || t.student.toLowerCase().includes(q);
      const matchType   = filterType === 'Todos' || t.type === filterType;
      const matchStatus = filterStatus === 'Todos' || t.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [search, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalReceita  = mockTransactions.filter((t) => t.type === 'Receita' && t.status === 'Pago').reduce((s, t) => s + t.amount, 0);
  const totalDespesas = mockTransactions.filter((t) => t.type === 'Despesa' && t.status === 'Pago').reduce((s, t) => s + t.amount, 0);
  const lucro         = totalReceita - totalDespesas;
  const inadimplentes = mockTransactions.filter((t) => t.status === 'Atrasado' || t.status === 'Pendente').length;

  const fmt = (n: number) =>
    n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

  return (
    <div className="space-y-6 text-slate-800">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 animate-fade-slide">
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Financeiro</h1>
            <span className="page-tag">
              <Sparkles className="w-3 h-3 text-blue-500" /> Jul 2026
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 animate-fade-slide delay-100">
            Controle de receitas, despesas e inadimplência
          </p>
        </div>
        <div className="flex items-center gap-3 animate-fade-slide delay-200">
          <button type="button" className="btn-outline" onClick={() => alert('Exportando relatório financeiro...')}>
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button type="button" className="btn-primary" onClick={() => alert('Novo lançamento')}>
            <Plus className="w-4 h-4" />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Receita do Mês',  value: fmt(totalReceita),  change: '+6.2%', up: true,  icon: DollarSign,   color: 'text-blue-500',    bg: 'bg-blue-50/50' },
          { label: 'Despesas',        value: fmt(totalDespesas), change: '-2.1%', up: false, icon: TrendingDown, color: 'text-rose-500',    bg: 'bg-rose-50/50' },
          { label: 'Lucro Líquido',   value: fmt(lucro),         change: '+8.4%', up: true,  icon: TrendingUp,   color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
          { label: 'Inadimplentes',   value: `${inadimplentes}`, change: '-1 vs anterior', up: true, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50/50' },
        ].map((stat, i) => (
          <div key={i} className="panel-card animate-card-enter flex flex-col justify-between" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="flex justify-between items-start mb-5">
              <span className="text-[13px] font-medium text-slate-500">{stat.label}</span>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={18} strokeWidth={2} />
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-800 tracking-tight">{stat.value}</p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100/60">
              <div className={stat.up ? 'trend-up' : 'trend-down'}>
                {stat.up ? <ArrowUpRight size={12} strokeWidth={2.5} /> : <ArrowDownRight size={12} strokeWidth={2.5} />}
                {stat.change}
              </div>
              <span className="text-[11px] text-slate-400">vs. mês anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 panel-card animate-fade-slide" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Receita vs. Despesas</h3>
              <p className="text-slate-400 text-[13px] mt-0.5">Comparativo mensal em 2026</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500 shrink-0" /> Receita</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-400 shrink-0" /> Despesas</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip content={<RevenueTooltip />} />
                <Bar dataKey="receita" name="Receita"  fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="despesas" name="Despesas" fill="#fca5a5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel-card animate-fade-slide" style={{ animationDelay: '0.4s' }}>
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-800">Taxa de Inadimplência</h3>
            <p className="text-slate-400 text-[13px] mt-0.5">Percentual mensal</p>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inadimplenciaData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value) => [`${value ?? 0}%`, 'Inadimplência']} />
                <Line type="monotone" dataKey="taxa" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            {[
              { label: 'Valor em atraso',  value: 'R$ 389', color: 'text-rose-600' },
              { label: 'Cobranças ativas', value: '4',      color: 'text-amber-600' },
              { label: 'Recuperado (mês)', value: 'R$ 610', color: 'text-emerald-600' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-xs">
                <span className="text-slate-500">{item.label}</span>
                <span className={`font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden animate-fade-slide" style={{ borderRadius: 24, animationDelay: '0.5s' }}>
        <div className="p-5 border-b border-slate-100 bg-white/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="tab-bar">
              {(['Todos', 'Receita', 'Despesa'] as const).map((t) => (
                <button key={t} type="button" onClick={() => { setFilterType(t); setCurrentPage(1); }}
                  className={`tab-item ${filterType === t ? 'tab-item-active' : ''}`}>{t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar lançamento..." className="input-field pl-8 py-1.5 pr-3" />
            </div>
            <div className="relative">
              <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="input-field pl-3 pr-7 py-1.5 appearance-none cursor-pointer">
                <option value="Todos">Todos os Status</option>
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
                <option value="Atrasado">Atrasado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
              <Filter size={12} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[320px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Descrição</th>
                <th className="px-6 py-3.5 hidden md:table-cell">Aluno / Origem</th>
                <th className="px-6 py-3.5 hidden md:table-cell">Método</th>
                <th className="px-6 py-3.5">Valor</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 hidden lg:table-cell">Data</th>
                <th className="px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Receipt size={30} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-600">Nenhum lançamento encontrado</p>
                    <p className="text-xs text-slate-400 mt-1">Ajuste seus filtros para ver mais resultados.</p>
                  </td>
                </tr>
              ) : paginated.map((t, idx) => {
                const badge = statusBadge[t.status];
                return (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors group animate-fade-slide" style={{ animationDelay: `${idx * 0.04}s` }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${t.type === 'Receita' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-500'}`}>
                          {t.type === 'Receita' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        </div>
                        <span className="text-xs font-medium text-slate-800 truncate max-w-[160px]">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-xs text-slate-500">{t.student}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg">{t.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${t.type === 'Receita' ? 'text-slate-800' : 'text-rose-600'}`}>
                        {t.type === 'Despesa' ? '- ' : ''}{fmt(t.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-[11px] font-medium rounded-full ${badge.style}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-xs text-slate-500">{t.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button type="button" className="btn-icon" onClick={() => alert(`Detalhes: ${t.description}`)}>
                        <Eye size={15} />
                      </button>
                      <button type="button" className="btn-icon" onClick={() => alert('Opções')}>
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-3">
          <p className="text-xs text-slate-500">
            Mostrando <span className="font-semibold text-slate-700">{paginated.length}</span> de{' '}
            <span className="font-semibold text-slate-700">{filtered.length}</span> lançamentos
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
              className="btn-icon border border-slate-200/80 bg-white disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold text-slate-700 px-2">Página {currentPage} de {totalPages}</span>
            <button type="button" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
              className="btn-icon border border-slate-200/80 bg-white disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
