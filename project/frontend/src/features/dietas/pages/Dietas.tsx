import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Sparkles,
  Download,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Flame,
  Beef,
  Wheat,
  Droplets,
} from 'lucide-react';

type DietGoal = 'Emagrecimento' | 'Hipertrofia' | 'Manutenção' | 'Saúde';
type DietStatus = 'Ativa' | 'Pausada' | 'Concluída';

interface DietPlan {
  id: number;
  name: string;
  student: string;
  studentAvatar: string;
  color: string;
  goal: DietGoal;
  status: DietStatus;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  startDate: string;
  nutritionist: string;
  adherence: number;
}

const goalConfig: Record<DietGoal, { style: string; icon: React.ElementType }> = {
  Emagrecimento: { style: 'bg-rose-50 text-rose-700 border-rose-200/60',       icon: Flame },
  Hipertrofia:   { style: 'bg-blue-50 text-blue-700 border-blue-200/60',        icon: Beef },
  Manutenção:    { style: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', icon: Leaf },
  Saúde:         { style: 'bg-purple-50 text-purple-700 border-purple-200/60',   icon: Droplets },
};

const statusBadge: Record<DietStatus, { style: string; dot: string }> = {
  Ativa:     { style: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500 animate-pulse' },
  Pausada:   { style: 'bg-amber-50 text-amber-700 border-amber-200/60',       dot: 'bg-amber-500' },
  Concluída: { style: 'bg-slate-100 text-slate-500 border-slate-200',          dot: 'bg-slate-400' },
};

const mockDiets: DietPlan[] = [
  { id: 1,  name: 'Plano Low Carb Intensivo', student: 'Ana Souza',       studentAvatar: 'AS', color: '#3b82f6', goal: 'Emagrecimento', status: 'Ativa',     calories: 1600, protein: 140, carbs: 80,  fat: 60,  startDate: '01 Jul 2026', nutritionist: 'Dra. Renata',   adherence: 88 },
  { id: 2,  name: 'Plano Hipertrofia Fase 2',  student: 'Bruno Lima',      studentAvatar: 'BL', color: '#8b5cf6', goal: 'Hipertrofia',   status: 'Ativa',     calories: 3200, protein: 200, carbs: 350, fat: 80,  startDate: '10 Jun 2026', nutritionist: 'Dr. Felipe',    adherence: 92 },
  { id: 3,  name: 'Dieta Mediterrânea',        student: 'Carla Mendes',    studentAvatar: 'CM', color: '#10b981', goal: 'Saúde',         status: 'Ativa',     calories: 2100, protein: 100, carbs: 240, fat: 75,  startDate: '15 Mai 2026', nutritionist: 'Dra. Renata',   adherence: 95 },
  { id: 4,  name: 'Cutting Avançado',          student: 'Diego Rocha',     studentAvatar: 'DR', color: '#f59e0b', goal: 'Emagrecimento', status: 'Pausada',   calories: 1800, protein: 160, carbs: 120, fat: 55,  startDate: '20 Jun 2026', nutritionist: 'Dr. Felipe',    adherence: 71 },
  { id: 5,  name: 'Manutenção Pós-Dieta',      student: 'Elisa Ferreira',  studentAvatar: 'EF', color: '#ef4444', goal: 'Manutenção',    status: 'Ativa',     calories: 2000, protein: 120, carbs: 200, fat: 70,  startDate: '01 Jun 2026', nutritionist: 'Dra. Renata',   adherence: 84 },
  { id: 6,  name: 'Plano Vegetariano Fit',     student: 'Felipe Santos',   studentAvatar: 'FS', color: '#06b6d4', goal: 'Saúde',         status: 'Concluída', calories: 1900, protein: 90,  carbs: 220, fat: 65,  startDate: '01 Abr 2026', nutritionist: 'Dra. Carla',    adherence: 98 },
  { id: 7,  name: 'Bulk Limpo 3000kcal',       student: 'Gabriela Costa',  studentAvatar: 'GC', color: '#ec4899', goal: 'Hipertrofia',   status: 'Ativa',     calories: 3000, protein: 180, carbs: 320, fat: 90,  startDate: '05 Jul 2026', nutritionist: 'Dr. Felipe',    adherence: 79 },
  { id: 8,  name: 'Protocolo Cetogênico',      student: 'Henrique Alves',  studentAvatar: 'HA', color: '#2563eb', goal: 'Emagrecimento', status: 'Ativa',     calories: 1700, protein: 150, carbs: 40,  fat: 110, startDate: '20 Jun 2026', nutritionist: 'Dr. Miguel',    adherence: 68 },
];

interface MacroBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}

function MacroBar({ label, value, max, color, unit = 'g' }: MacroBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className="text-slate-700 font-semibold">{value}{unit}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function Dietas() {
  const [search, setSearch]       = useState('');
  const [filterGoal, setFilterGoal]     = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [menuOpen, setMenuOpen]   = useState<number | null>(null);
  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage = 6;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status') ?? 'Todos';
    if (status !== filterStatus) {
      setFilterStatus(status);
      setCurrentPage(1);
    }
  }, [location.search]);

  const filtered = useMemo(() => {
    return mockDiets.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch  = d.name.toLowerCase().includes(q) || d.student.toLowerCase().includes(q) || d.nutritionist.toLowerCase().includes(q);
      const matchGoal    = filterGoal === 'Todos'   || d.goal   === filterGoal;
      const matchStatus  = filterStatus === 'Todos' || d.status === filterStatus;
      return matchSearch && matchGoal && matchStatus;
    });
  }, [search, filterGoal, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const counts = {
    total:     mockDiets.length,
    ativas:    mockDiets.filter((d) => d.status === 'Ativa').length,
    pausadas:  mockDiets.filter((d) => d.status === 'Pausada').length,
    concluidas: mockDiets.filter((d) => d.status === 'Concluída').length,
  };

  const avgAdherence = Math.round(mockDiets.filter((d) => d.status === 'Ativa').reduce((s, d) => s + d.adherence, 0) / counts.ativas);

  return (
    <div className="space-y-6 text-slate-800">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 animate-fade-slide">
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Planos Alimentares</h1>
            <span className="page-tag">
              <Sparkles className="w-3 h-3 text-blue-500" /> {counts.ativas} ativos
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 animate-fade-slide delay-100">
            Gerencie dietas, metas nutricionais e adesão dos alunos
          </p>
        </div>
        <div className="flex items-center gap-3 animate-fade-slide delay-200">
          <button type="button" className="btn-outline" onClick={() => alert('Exportando planos...')}>
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button type="button" className="btn-primary" onClick={() => alert('Novo plano alimentar')}>
            <Plus className="w-4 h-4" />
            <span>Novo Plano</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Planos Ativos',    value: counts.ativas,      icon: Leaf,     color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
          { label: 'Pausados',         value: counts.pausadas,     icon: Flame,    color: 'text-amber-500',   bg: 'bg-amber-50/50' },
          { label: 'Concluídos',       value: counts.concluidas,   icon: Wheat,    color: 'text-slate-500',   bg: 'bg-slate-100' },
          { label: 'Adesão Média',     value: `${avgAdherence}%`,  icon: Beef,     color: 'text-blue-500',    bg: 'bg-blue-50/50' },
        ].map((stat, i) => (
          <div key={i} className="panel-card-sm animate-card-enter flex items-center justify-between" style={{ animationDelay: `${i * 0.07}s` }}>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden animate-fade-slide" style={{ borderRadius: 24, animationDelay: '0.3s' }}>

        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-white/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="tab-bar">
              {(['Todos', 'Ativa', 'Pausada', 'Concluída'] as const).map((s) => (
                <button key={s} type="button" onClick={() => {
                  setFilterStatus(s); setCurrentPage(1);
                  if (s === 'Todos') {
                    navigate(ROUTES.dietas, { replace: true });
                  } else {
                    navigate(`${ROUTES.dietas}?status=${encodeURIComponent(s)}`, { replace: true });
                  }
                }}
                  className={`tab-item ${filterStatus === s ? 'tab-item-active' : ''}`}>{s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar aluno ou plano..." className="input-field pl-8 py-1.5 pr-3" />
            </div>
            <div className="relative">
              <select value={filterGoal} onChange={(e) => { setFilterGoal(e.target.value); setCurrentPage(1); }}
                className="input-field pl-3 pr-7 py-1.5 appearance-none cursor-pointer">
                <option value="Todos">Todos os Objetivos</option>
                <option value="Emagrecimento">Emagrecimento</option>
                <option value="Hipertrofia">Hipertrofia</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Saúde">Saúde</option>
              </select>
              <Filter size={12} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 min-h-[360px]">
          {paginated.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <Leaf size={32} className="text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">Nenhum plano encontrado</p>
              <p className="text-xs text-slate-400 mt-1">Ajuste os filtros ou crie um novo plano.</p>
            </div>
          ) : paginated.map((diet, idx) => {
            const goal   = goalConfig[diet.goal];
            const status = statusBadge[diet.status];
            const GoalIcon = goal.icon;
            return (
              <div key={diet.id}
                className="border border-slate-100/90 rounded-2xl p-5 hover:border-slate-200 hover:shadow-sm transition-all duration-200 flex flex-col gap-4 animate-fade-slide"
                style={{ animationDelay: `${idx * 0.05}s` }}>

                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: diet.color }}>
                      {diet.studentAvatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{diet.student}</p>
                      <p className="text-[11px] text-slate-400 truncate">{diet.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 relative">
                    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-semibold rounded-full ${status.style}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {diet.status}
                    </span>
                    <button type="button" className="btn-icon" onClick={() => setMenuOpen(menuOpen === diet.id ? null : diet.id)}>
                      <MoreHorizontal size={14} />
                    </button>
                    {menuOpen === diet.id && (
                      <div className="dropdown-menu absolute right-0 top-8 w-40 z-30">
                        <button type="button" onClick={() => { alert(`Ver plano de ${diet.student}`); setMenuOpen(null); }} className="dropdown-item">
                          <Eye size={13} className="text-slate-400" /> Ver detalhes
                        </button>
                        <button type="button" onClick={() => { alert(`Editar plano`); setMenuOpen(null); }} className="dropdown-item">
                          <Edit3 size={13} className="text-slate-400" /> Editar
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button type="button" onClick={() => { alert(`Plano excluído`); setMenuOpen(null); }} className="dropdown-item-danger">
                          <Trash2 size={13} className="text-rose-500" /> Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Goal Badge + Calorias */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold rounded-lg ${goal.style}`}>
                    <GoalIcon size={11} />
                    {diet.goal}
                  </span>
                  <div className="flex items-center gap-1 text-slate-700">
                    <Flame size={13} className="text-orange-400" />
                    <span className="text-xs font-bold">{diet.calories.toLocaleString('pt-BR')}</span>
                    <span className="text-[11px] text-slate-400">kcal/dia</span>
                  </div>
                </div>

                {/* Macros */}
                <div className="space-y-2.5">
                  <MacroBar label="Proteína" value={diet.protein} max={250} color="#3b82f6" />
                  <MacroBar label="Carboidratos" value={diet.carbs}   max={400} color="#f59e0b" />
                  <MacroBar label="Gorduras"     value={diet.fat}     max={150} color="#f43f5e" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400">Adesão: <span className={`font-bold ${diet.adherence >= 85 ? 'text-emerald-600' : diet.adherence >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>{diet.adherence}%</span></span>
                  <span className="text-slate-400">{diet.nutritionist}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-3">
          <p className="text-xs text-slate-500">
            Mostrando <span className="font-semibold text-slate-700">{paginated.length}</span> de{' '}
            <span className="font-semibold text-slate-700">{filtered.length}</span> planos
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
