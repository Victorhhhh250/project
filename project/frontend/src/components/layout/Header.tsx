import { useLocation } from 'react-router-dom';
import { Bell, Search, ChevronDown, Menu, Sparkles } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAppStore } from '@/stores/useAppStore';

const pageTitles: Record<string, { title: string; subtitle: string; emoji: string }> = {
  [ROUTES.dashboard]: { title: 'Dashboard',  subtitle: 'Visão geral da plataforma',        emoji: '📊' },
  [ROUTES.alunos]:    { title: 'Alunos',      subtitle: 'Gerencie alunos e matrículas',      emoji: '👥' },
  [ROUTES.agenda]:    { title: 'Agenda',       subtitle: 'Aulas e compromissos agendados',    emoji: '📅' },
};

/* Glass token */
const glass = {
  background:           'rgba(255,255,255,0.72)',
  backdropFilter:       'blur(22px) saturate(180%)',
  WebkitBackdropFilter: 'blur(22px) saturate(180%)',
  borderBottom:         '1px solid rgba(226,232,240,0.65)',
  boxShadow:            '0 2px 12px rgba(15,23,42,0.05)',
} as React.CSSProperties;

export function Header() {
  const location = useLocation();
  const { setSidebarOpen } = useAppStore();
  const page = pageTitles[location.pathname] ?? { title: 'Plataforma', subtitle: '', emoji: '🏠' };

  return (
    <header
      style={glass}
      className="h-[60px] shrink-0 flex items-center gap-3 px-4 sm:px-5"
    >
      {/* ── Mobile hamburger ─── */}
      <button
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
        className={[
          'lg:hidden flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
          'text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#0f172a]/[0.05]',
          'transition-colors duration-200 border-none bg-transparent cursor-pointer',
        ].join(' ')}
      >
        <Menu size={17} />
      </button>

      {/* ── Page identity ─────── */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563eb]/[0.07] shrink-0 text-base select-none">
          {page.emoji}
        </div>
        <div className="min-w-0">
          <h1 className="text-[0.9rem] font-bold text-[#0f172a] leading-none truncate">
            {page.title}
          </h1>
          <p className="text-[#94a3b8] text-[0.68rem] mt-[3px] hidden sm:block truncate">
            {page.subtitle}
          </p>
        </div>
      </div>

      {/* ── Right actions ─────── */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Search */}
        <div className="relative hidden md:flex items-center group">
          <Search
            size={12}
            className="absolute left-3 text-[#94a3b8] group-focus-within:text-[#2563eb] transition-colors pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar..."
            className={[
              'pl-[30px] pr-[52px] py-[7px] text-[0.78rem] rounded-lg w-44',
              'bg-[#0f172a]/[0.04] border border-[#e2e8f0]',
              'text-[#0f172a] placeholder-[#94a3b8]',
              'focus:outline-none focus:ring-2 focus:ring-[#2563eb]/15',
              'focus:border-[#2563eb] focus:bg-white focus:w-52',
              'transition-all duration-200',
            ].join(' ')}
          />
          {/* Shortcut badge */}
          <span className="absolute right-2.5 flex items-center gap-0.5 pointer-events-none">
            <kbd className="text-[0.55rem] font-semibold text-[#94a3b8] bg-[#f1f5f9] border border-[#e2e8f0] rounded px-[5px] py-[2px] leading-none">
              /
            </kbd>
          </span>
        </div>

        {/* AI Sparkle button */}
        <button
          title="Assistente IA"
          className={[
            'hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg',
            'text-[0.75rem] font-semibold text-[#2563eb]',
            'bg-[#2563eb]/[0.07] hover:bg-[#2563eb]/[0.12]',
            'border border-[#2563eb]/20 hover:border-[#2563eb]/35',
            'transition-all duration-200 cursor-pointer',
          ].join(' ')}
        >
          <Sparkles size={12} />
          <span>IA</span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[#e2e8f0] hidden sm:block" />

        {/* Notifications */}
        <button
          className={[
            'relative w-8 h-8 rounded-lg flex items-center justify-center',
            'text-[#64748b] hover:text-[#0f172a] hover:bg-[#0f172a]/[0.05]',
            'transition-colors duration-200 border-none bg-transparent cursor-pointer',
          ].join(' ')}
        >
          <Bell size={15} />
          {/* Badge */}
          <span className={[
            'absolute top-1.5 right-1.5 min-w-[16px] h-[16px] rounded-full',
            'bg-[#2563eb] text-white text-[0.52rem] font-bold',
            'flex items-center justify-center leading-none px-[3px]',
          ].join(' ')}>
            3
          </span>
        </button>

        {/* User menu */}
        <button
          className={[
            'flex items-center gap-2 h-8 pl-0.5 pr-2 rounded-lg',
            'hover:bg-[#0f172a]/[0.05] transition-colors duration-200',
            'border-none bg-transparent cursor-pointer',
          ].join(' ')}
        >
          <div className="w-[26px] h-[26px] rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-[0.58rem] font-bold shrink-0">
            AD
          </div>
          <span className="text-[0.78rem] font-semibold text-[#334155] hidden sm:block">
            Admin
          </span>
          <ChevronDown size={12} className="text-[#94a3b8] hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
