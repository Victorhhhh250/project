import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar,
  LogOut, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '@/app/auth';
import { useAppStore } from '@/stores/useAppStore';
import { ROUTES } from '@/constants/routes';

const NAV = [
  { label: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Alunos',    path: ROUTES.alunos,    icon: Users },
  { label: 'Agenda',    path: ROUTES.agenda,    icon: Calendar },
];

/* Glass token — shared by sidebar */
const glass = {
  background:           'rgba(255,255,255,0.72)',
  backdropFilter:       'blur(22px) saturate(180%)',
  WebkitBackdropFilter: 'blur(22px) saturate(180%)',
  borderRight:          '1px solid rgba(226,232,240,0.65)',
  boxShadow:            '4px 0 28px rgba(15,23,42,0.06)',
} as React.CSSProperties;

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const {
    sidebarOpen, setSidebarOpen,
    sidebarCollapsed, setSidebarCollapsed,
  } = useAppStore();

  /* Close drawer when route changes */
  useEffect(() => { setSidebarOpen(false); }, [location.pathname, setSidebarOpen]);

  const col = sidebarCollapsed;

  /* ─────────────────────────────────────────────── */
  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden
        onClick={() => setSidebarOpen(false)}
        className={[
          'fixed inset-0 z-40 lg:hidden',
          'bg-black/40 backdrop-blur-[3px]',
          'transition-opacity duration-300',
          sidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* ── Sidebar shell ──────────────────────────── */}
      <aside
        style={glass}
        className={[
          /* stacking */
          'fixed inset-y-0 left-0 z-50 flex flex-col shrink-0',
          'lg:relative lg:inset-auto lg:z-auto',
          /* width — mobile always 220 px, desktop toggles */
          'w-[220px]',
          col ? 'lg:w-[62px]' : 'lg:w-[220px]',
          /* motion */
          'transition-[width,transform] duration-300 ease-[cubic-bezier(.4,0,.2,1)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          /* clip */
          'overflow-hidden',
        ].join(' ')}
      >

        {/* ── Logo ──────────────────────────────────── */}
        <div className="flex items-center gap-[10px] h-[60px] px-4 shrink-0 border-b border-[#e2e8f0]/70">
          {/* Brand mark */}
          <div className="w-[28px] h-[28px] rounded-[8px] bg-[#2563eb] flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/25">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>

          {/* Wordmark — fades out when collapsed */}
          <div className={[
            'overflow-hidden leading-none',
            'transition-[opacity,max-width] duration-300',
            col ? 'lg:max-w-0 lg:opacity-0' : 'max-w-[160px] opacity-100',
          ].join(' ')}>
            <p className="text-[0.83rem] font-bold text-[#0f172a] whitespace-nowrap tracking-tight">
              Atlhon Sales
            </p>
            <p className="text-[0.6rem] font-semibold text-[#2563eb] whitespace-nowrap mt-[3px]"
              style={{ letterSpacing: '0.04em' }}>
              Sales CRM
            </p>
          </div>
        </div>

        {/* ── Navigation ────────────────────────────── */}
        <nav className="flex-1 flex flex-col px-[9px] py-3 overflow-y-auto overflow-x-hidden">

          {/* Nav items */}
          <ul className="flex-1 space-y-[2px]" role="list">
            {NAV.map(({ label, path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    title={col ? label : undefined}
                    className={[
                      'group flex items-center rounded-[9px] border-l-2 outline-none select-none',
                      'transition-all duration-200 ease-out',
                      /* layout: collapsed centers icon on desktop */
                      col
                        ? 'lg:justify-center lg:px-0 lg:py-[10px] gap-[9px] px-3 py-[9px]'
                        : 'gap-[9px] px-3 py-[9px]',
                      /* colour */
                      active
                        ? 'border-[#2563eb] bg-[#2563eb]/[0.07] text-[#1e40af]'
                        : 'border-transparent text-[#64748b] hover:bg-[#0f172a]/[0.04] hover:text-[#1e293b]',
                    ].join(' ')}
                  >
                    <Icon
                      size={15}
                      className="shrink-0 transition-colors duration-200"
                      style={{ color: active ? '#2563eb' : undefined }}
                    />
                    <span className={[
                      'text-[0.82rem] font-medium whitespace-nowrap',
                      'transition-all duration-300 overflow-hidden',
                      col ? 'lg:max-w-0 lg:opacity-0' : 'max-w-full opacity-100',
                      !active ? 'group-hover:translate-x-px' : '',
                    ].filter(Boolean).join(' ')}>
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Collapse toggle — always visible at bottom of nav ── */}
          <div className="mt-3 pt-2.5 border-t border-[#e2e8f0]/60">
            <button
              onClick={() => setSidebarCollapsed(!col)}
              title={col ? 'Expandir' : 'Recolher'}
              className={[
                'w-full flex items-center rounded-[9px]',
                'text-[#94a3b8] hover:text-[#475569] hover:bg-[#0f172a]/[0.04]',
                'transition-all duration-200 border-none bg-transparent cursor-pointer',
                col
                  ? 'lg:justify-center lg:px-0 lg:py-[10px] gap-[9px] px-3 py-[9px]'
                  : 'gap-[9px] px-3 py-[9px]',
              ].join(' ')}
            >
              {col
                ? <PanelLeftOpen size={15} />
                : (
                  <>
                    <PanelLeftClose size={15} />
                    {/* Text visible only when expanded */}
                    <span className="text-[0.8rem] font-medium">Recolher</span>
                  </>
                )
              }
            </button>
          </div>
        </nav>

        {/* ── User area ─────────────────────────────── */}
        <div className="px-[9px] pb-3 pt-2.5 border-t border-[#e2e8f0]/70 shrink-0">
          <div className={[
            'group flex items-center rounded-[9px]',
            'hover:bg-[#0f172a]/[0.04] transition-colors duration-200',
            col
              ? 'lg:justify-center lg:px-0 lg:py-[10px] gap-[10px] px-3 py-[9px]'
              : 'gap-[10px] px-3 py-[9px]',
          ].join(' ')}>
            {/* Avatar + presence */}
            <div className="relative shrink-0">
              <div className="w-[30px] h-[30px] rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-[0.62rem] font-bold select-none">
                AD
              </div>
              <span
                className="absolute bottom-0 right-0 w-[8px] h-[8px] rounded-full bg-emerald-500"
                style={{ border: '2px solid rgba(255,255,255,0.85)' }}
              />
            </div>

            {/* Info */}
            <div className={[
              'flex-1 min-w-0 overflow-hidden leading-none',
              'transition-[opacity,max-width] duration-300',
              col ? 'lg:max-w-0 lg:opacity-0' : 'max-w-full opacity-100',
            ].join(' ')}>
              <p className="text-[0.8rem] font-semibold text-[#0f172a] truncate">Admin Demo</p>
              <p className="text-[0.64rem] text-[#94a3b8] truncate mt-[3px]">admin@atlhon.com</p>
            </div>

            {/* Logout — appears on hover, hidden when collapsed */}
            {!col && (
              <button
                onClick={logout}
                title="Sair da conta"
                className={[
                  'shrink-0 w-[28px] h-[28px] rounded-[7px] flex items-center justify-center',
                  'border-none bg-transparent cursor-pointer',
                  'text-[#94a3b8] hover:text-red-500 hover:bg-red-50',
                  'opacity-0 group-hover:opacity-100',
                  'transition-all duration-200',
                ].join(' ')}
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
