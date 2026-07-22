import { useState, useMemo, useRef, useEffect } from 'react';
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
  Dumbbell,
  Flame,
  Zap,
  Activity,
  Clock,
  Calendar,
  Users,
  Trophy,
  CheckCircle2,
} from 'lucide-react';

/* ── Tipagens ── */
type WorkoutGoal = 'Hipertrofia' | 'Emagrecimento' | 'Força' | 'Condicionamento';
type WorkoutStatus = 'Ativo' | 'Pausado' | 'Concluído';
type WorkoutLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

interface WorkoutPlan {
  id: number;
  name: string;
  split: string; // Ex: ABC, Push/Pull/Legs
  student: string;
  studentAvatar: string;
  color: string;
  goal: WorkoutGoal;
  level: WorkoutLevel;
  status: WorkoutStatus;
  exercisesCount: number;
  durationMin: number;
  frequencyDays: number; // ex: 4x por semana
  personal: string;
  adherence: number; // Porcentagem de conclusão
  lastUpdate: string;
}

/* ── Mapeamento de Estilos e Ícones ── */
const goalConfig: Record<WorkoutGoal, { style: string; icon: React.ElementType }> = {
  Hipertrofia:     { style: 'bg-blue-50 text-blue-700 border-blue-200/60', icon: Dumbbell },
  Emagrecimento:   { style: 'bg-rose-50 text-rose-700 border-rose-200/60', icon: Flame },
  Força:           { style: 'bg-purple-50 text-purple-700 border-purple-200/60', icon: Zap },
  Condicionamento: { style: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', icon: Activity },
};

const statusBadge: Record<WorkoutStatus, { style: string; dot: string }> = {
  Ativo:     { style: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500 animate-pulse-glow' },
  Pausado:   { style: 'bg-amber-50 text-amber-700 border-amber-200/60', dot: 'bg-amber-500' },
  Concluído: { style: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
};

const levelBadge: Record<WorkoutLevel, string> = {
  Iniciante: 'bg-slate-100 text-slate-600 border-slate-200',
  Intermediário: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  Avançado: 'bg-violet-50 text-violet-700 border-violet-200/60',
};

/* ── Dados Fictícios de Demonstração ── */
const mockWorkouts: WorkoutPlan[] = [
  { id: 1, name: 'Hipertrofia ABC - Bloco 2', split: 'ABC (Peito/Costas/Pernas)', student: 'Ana Souza', studentAvatar: 'AS', color: '#3b82f6', goal: 'Hipertrofia', level: 'Intermediário', status: 'Ativo', exercisesCount: 18, durationMin: 60, frequencyDays: 5, personal: 'Carlos Eduardo', adherence: 94, lastUpdate: '18 Jul 2026' },
  { id: 2, name: 'Cutting & Definição', split: 'Push / Pull / Legs', student: 'Bruno Lima', studentAvatar: 'BL', color: '#8b5cf6', goal: 'Emagrecimento', level: 'Avançado', status: 'Ativo', exercisesCount: 22, durationMin: 50, frequencyDays: 6, personal: 'Roberto Alves', adherence: 88, lastUpdate: '16 Jul 2026' },
  { id: 3, name: 'Adaptativo Geral', split: 'Fullbody 3x', student: 'Carla Mendes', studentAvatar: 'CM', color: '#10b981', goal: 'Condicionamento', level: 'Iniciante', status: 'Ativo', exercisesCount: 12, durationMin: 45, frequencyDays: 3, personal: 'Maria Clara', adherence: 100, lastUpdate: '14 Jul 2026' },
  { id: 4, name: 'Ganho de Força Bruta', split: 'Upper / Lower', student: 'Diego Rocha', studentAvatar: 'DR', color: '#f59e0b', goal: 'Força', level: 'Avançado', status: 'Pausado', exercisesCount: 16, durationMin: 75, frequencyDays: 4, personal: 'Carlos Eduardo', adherence: 65, lastUpdate: '12 Jul 2026' },
  { id: 5, name: 'Reabilitação e Mobilidade', split: 'ABC Suave', student: 'Elisa Ferreira', studentAvatar: 'EF', color: '#ef4444', goal: 'Condicionamento', level: 'Iniciante', status: 'Ativo', exercisesCount: 10, durationMin: 40, frequencyDays: 3, personal: 'Juliana Torres', adherence: 82, lastUpdate: '10 Jul 2026' },
  { id: 6, name: 'Bulk Máximo 500kg', split: 'ABCD Foco Pernas', student: 'Felipe Santos', studentAvatar: 'FS', color: '#06b6d4', goal: 'Hipertrofia', level: 'Avançado', status: 'Concluído', exercisesCount: 24, durationMin: 70, frequencyDays: 5, personal: 'Roberto Alves', adherence: 96, lastUpdate: '05 Jul 2026' },
  { id: 7, name: 'Cardio & Resistência', split: 'HIIT + Core', student: 'Gabriela Costa', studentAvatar: 'GC', color: '#ec4899', goal: 'Emagrecimento', level: 'Intermediário', status: 'Ativo', exercisesCount: 14, durationMin: 45, frequencyDays: 4, personal: 'Maria Clara', adherence: 91, lastUpdate: '02 Jul 2026' },
  { id: 8, name: 'Powerlifting Base', split: 'Focus Squat/Bench/Deadlift', student: 'Henrique Alves', studentAvatar: 'HA', color: '#2563eb', goal: 'Força', level: 'Avançado', status: 'Ativo', exercisesCount: 15, durationMin: 80, frequencyDays: 4, personal: 'Carlos Eduardo', adherence: 78, lastUpdate: '28 Jun 2026' },
];

export default function Treinos() {
  const [search, setSearch] = useState('');
  const [filterGoal, setFilterGoal] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterLevel, setFilterLevel] = useState('Todos');
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Sync filterStatus with ?status= query param so sidebar links activate correct tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status') ?? 'Todos';
    if (status !== filterStatus) {
      setFilterStatus(status);
      setCurrentPage(1);
    }
  }, [location.search]);

  /* Fechar menu ao clicar fora */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Filtro de Treinos */
  const filtered = useMemo(() => {
    return mockWorkouts.filter((w) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        w.name.toLowerCase().includes(q) ||
        w.student.toLowerCase().includes(q) ||
        w.personal.toLowerCase().includes(q) ||
        w.split.toLowerCase().includes(q);

      const matchGoal   = filterGoal === 'Todos' || w.goal === filterGoal;
      const matchStatus = filterStatus === 'Todos' || w.status === filterStatus;
      const matchLevel  = filterLevel === 'Todos' || w.level === filterLevel;

      return matchSearch && matchGoal && matchStatus && matchLevel;
    });
  }, [search, filterGoal, filterStatus, filterLevel]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const counts = useMemo(() => {
    return {
      total: mockWorkouts.length,
      ativos: mockWorkouts.filter((w) => w.status === 'Ativo').length,
      pausados: mockWorkouts.filter((w) => w.status === 'Pausado').length,
      concluidos: mockWorkouts.filter((w) => w.status === 'Concluído').length,
    };
  }, []);

  const avgAdherence = useMemo(() => {
    const activeList = mockWorkouts.filter((w) => w.status === 'Ativo');
    if (!activeList.length) return 0;
    return Math.round(activeList.reduce((s, w) => s + w.adherence, 0) / activeList.length);
  }, []);

  return (
    <div className="space-y-6 text-slate-800">

      {/* ── HEADER DA PÁGINA & AÇÕES ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 animate-fade-slide">
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
              Fichas de Treino
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Sparkles className="w-3 h-3 text-blue-500" /> {counts.ativos} Fichas Ativas
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 animate-fade-slide" style={{ animationDelay: '0.1s' }}>
            Monte prescontos de treinos, monitore volume, divisão e frequência dos alunos
          </p>
        </div>

        <div className="flex items-center gap-3 animate-fade-slide" style={{ animationDelay: '0.2s' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => alert('Exportando fichas de treino...')}
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exportar PDF</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => alert('Abrir construtor de Novo Treino')}
          >
            <Plus className="w-4 h-4" />
            <span>Novo Treino</span>
          </button>
        </div>
      </div>

      {/* ── KPI STATS OVERVIEW ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="panel-card-sm animate-card-enter flex items-center justify-between" style={{ animationDelay: '0.05s' }}>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Treinos Ativos</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{counts.ativos}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Dumbbell size={20} />
          </div>
        </div>

        <div className="panel-card-sm animate-card-enter flex items-center justify-between" style={{ animationDelay: '0.1s' }}>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pausados</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{counts.pausados}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="panel-card-sm animate-card-enter flex items-center justify-between" style={{ animationDelay: '0.15s' }}>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Concluídos</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{counts.concluidos}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="panel-card-sm animate-card-enter flex items-center justify-between" style={{ animationDelay: '0.2s' }}>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Adesão Média</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{avgAdherence}%</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Trophy size={20} />
          </div>
        </div>
      </div>

      {/* ── CARD PRINCIPAL COM GRID DE FICHAS ── */}
      <div className="bg-white rounded-[24px] border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden animate-fade-slide" style={{ animationDelay: '0.3s' }}>

        {/* Toolbar de Filtros */}
        <div className="p-5 border-b border-slate-100 bg-white/50 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tabs por Status */}
          <div className="flex bg-slate-100/80 p-1 rounded-xl text-xs font-medium w-full md:w-auto overflow-x-auto">
            {(['Todos', 'Ativo', 'Pausado', 'Concluído'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setFilterStatus(s);
                  setCurrentPage(1);
                  // update URL so sidebar links and deep links reflect current filter
                  if (s === 'Todos') {
                    navigate(ROUTES.treinos, { replace: true });
                  } else {
                    navigate(`${ROUTES.treinos}?status=${encodeURIComponent(s)}`, { replace: true });
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === s
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Busca e Selects */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Input de Busca */}
            <div className="relative flex-1 md:w-60 min-w-[200px]">
              <Search size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar treino, aluno ou personal..."
                className="w-full pl-9 pr-8 py-1.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Select por Objetivo */}
            <div className="relative">
              <select
                value={filterGoal}
                onChange={(e) => {
                  setFilterGoal(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-3 pr-8 py-1.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="Todos">Todos Objetivos</option>
                <option value="Hipertrofia">Hipertrofia</option>
                <option value="Emagrecimento">Emagrecimento</option>
                <option value="Força">Força</option>
                <option value="Condicionamento">Condicionamento</option>
              </select>
              <Filter size={12} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>

            {/* Select por Nível */}
            <div className="relative">
              <select
                value={filterLevel}
                onChange={(e) => {
                  setFilterLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-3 pr-8 py-1.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="Todos">Todos Níveis</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
              <Filter size={12} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* ── GRID DE CARDS DE TREINOS ── */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 min-h-[380px]">
          {paginated.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <Dumbbell size={32} className="text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">Nenhuma ficha de treino encontrada</p>
              <p className="text-xs text-slate-400 mt-1">Ajuste os filtros de busca ou adicione um novo treino.</p>
            </div>
          ) : (
            paginated.map((workout, idx) => {
              const goal = goalConfig[workout.goal];
              const status = statusBadge[workout.status];
              const GoalIcon = goal.icon;

              return (
                <div
                  key={workout.id}
                  className="border border-slate-100/90 rounded-2xl p-5 hover:border-slate-200/90 hover:shadow-sm transition-all duration-200 flex flex-col justify-between gap-4 bg-white animate-fade-slide"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Card Header: Aluno e Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                        style={{ backgroundColor: workout.color }}
                      >
                        {workout.studentAvatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{workout.student}</p>
                        <h3 className="text-sm font-semibold text-blue-600 truncate mt-0.5">{workout.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 relative">
                      <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-semibold rounded-full ${status.style}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {workout.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => setMenuOpen(menuOpen === workout.id ? null : workout.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpen === workout.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-8 z-30 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-1.5 w-40 text-left animate-pop-in"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Ver treino de ${workout.student}`);
                              setMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Eye size={14} className="text-slate-400" /> Ver ficha
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Editar ficha de ${workout.student}`);
                              setMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Edit3 size={14} className="text-slate-400" /> Editar
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Treino excluído`);
                              setMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-medium"
                          >
                            <Trash2 size={14} className="text-rose-500" /> Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divisão / Split Tag */}
                  <div className="bg-slate-50/80 border border-slate-100 px-3 py-2 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Divisão</p>
                    <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">{workout.split}</p>
                  </div>

                  {/* Badges de Objetivo e Nível */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold rounded-lg ${goal.style}`}>
                      <GoalIcon size={12} />
                      {workout.goal}
                    </span>

                    <span className={`inline-block border px-2 py-0.5 text-[10px] font-medium rounded-md ${levelBadge[workout.level]}`}>
                      {workout.level}
                    </span>
                  </div>

                  {/* Estatísticas Rápidas (Exercícios, Duração, Frequência) */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Exercícios</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{workout.exercisesCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Duração</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{workout.durationMin} min</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Frequência</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{workout.frequencyDays}x/sem</p>
                    </div>
                  </div>

                  {/* Barra de Progresso de Adesão */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Adesão do Aluno</span>
                      <span className={`font-bold ${workout.adherence >= 85 ? 'text-emerald-600' : workout.adherence >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {workout.adherence}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          workout.adherence >= 85 ? 'bg-emerald-500' : workout.adherence >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${workout.adherence}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer do Card (Personal e Data) */}
                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-slate-400" />
                      {workout.personal}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      {workout.lastUpdate}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── PAGINAÇÃO ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-3">
          <p className="text-xs text-slate-500">
            Mostrando <span className="font-semibold text-slate-700">{paginated.length}</span> de{' '}
            <span className="font-semibold text-slate-700">{filtered.length}</span> fichas
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs font-semibold text-slate-700 px-2">
              Página {currentPage} de {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}