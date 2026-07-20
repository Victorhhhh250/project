import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '@/app/auth';
import { ROUTES } from '@/constants/routes';

const navItems = [
  { label: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard, hint: '⌘D' },
  { label: 'Alunos',    path: ROUTES.alunos,    icon: Users,            hint: '⌘A' },
  { label: 'Agenda',    path: ROUTES.agenda,    icon: Calendar,         hint: '⌘G' },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside
      className="w-[215px] h-screen flex flex-col shrink-0"
      style={{ background: '#0D0D10', borderRight: '1px solid rgba(255,255,255,0.045)' }}
    >
      {/* ── Logo ─────────────────────────────────── */}
      <div
        className="flex items-center gap-2.5 px-[18px] h-[58px] shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}
      >
        {/* Mark */}
        <div
          className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center shrink-0"
          style={{ background: '#1d4ed8' }}
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>

        {/* Wordmark */}
        <div className="flex flex-col leading-none select-none">
          <span
            className="text-[0.8rem] font-semibold tracking-tight"
            style={{ color: 'rgba(255,255,255,0.88)' }}
          >
            Atlhon
          </span>
          <span
            className="text-[0.6rem] font-medium mt-[3px]"
            style={{ color: 'rgba(96,165,250,0.75)', letterSpacing: '0.04em' }}
          >
            Sales CRM
          </span>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────── */}
      <nav className="flex-1 px-[10px] py-3 overflow-y-auto">
        <ul className="space-y-[2px]" role="list">
          {navItems.map(({ label, path, icon: Icon, hint }) => {
            const isActive = location.pathname === path;

            return (
              <li key={path}>
                <Link
                  to={path}
                  className={[
                    'group relative flex items-center gap-[10px] rounded-[8px]',
                    'text-[0.815rem] font-medium select-none outline-none',
                    'transition-all duration-200 ease-out',
                    'border-l-[1.5px]',
                    isActive
                      ? 'border-blue-500/60 bg-white/[0.055] text-white/90 pl-[10px] pr-3 py-[8px]'
                      : 'border-transparent text-white/36 pl-[10px] pr-3 py-[8px] hover:text-white/72 hover:bg-white/[0.032]',
                  ].join(' ')}
                >
                  {/* Icon */}
                  <Icon
                    size={14}
                    className="shrink-0 transition-all duration-200"
                    style={{
                      color: isActive
                        ? '#60a5fa'
                        : undefined,
                      opacity: isActive ? 1 : 0.5,
                    }}
                  />

                  {/* Label — shifts 1 px on hover when inactive */}
                  <span
                    className={[
                      'flex-1 transition-transform duration-200 ease-out',
                      !isActive && 'group-hover:translate-x-px',
                    ].filter(Boolean).join(' ')}
                  >
                    {label}
                  </span>

                  {/* Keyboard hint — fades in on hover */}
                  {!isActive && (
                    <span
                      className="text-[0.58rem] font-medium transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                      style={{ color: 'rgba(255,255,255,0.18)' }}
                    >
                      {hint}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── User area ─────────────────────────────── */}
      <div
        className="px-[10px] pb-[12px] pt-[10px] shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.045)' }}
      >
        <div className="group flex items-center gap-[10px] px-[10px] py-[9px] rounded-[8px] hover:bg-white/[0.032] transition-all duration-200 cursor-default">
          {/* Avatar + presence dot */}
          <div className="relative shrink-0">
            <div
              className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[0.6rem] font-semibold select-none"
              style={{
                background: '#161622',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              AD
            </div>
            {/* Presence */}
            <span
              className="absolute bottom-0 right-0 w-[7px] h-[7px] rounded-full bg-emerald-500"
              style={{ border: '1.5px solid #0D0D10' }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 leading-none">
            <p
              className="text-[0.775rem] font-medium truncate"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Admin Demo
            </p>
            <p
              className="text-[0.64rem] truncate mt-[3px]"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              admin@atlhon.com
            </p>
          </div>

          {/* Logout — only visible on row hover */}
          <button
            onClick={logout}
            title="Sair da conta"
            className={[
              'shrink-0 w-[26px] h-[26px] rounded-[6px] flex items-center justify-center',
              'border-none bg-transparent cursor-pointer',
              'text-white/25 transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              'hover:bg-red-500/[0.12] hover:text-red-400',
              '-translate-x-0.5 group-hover:translate-x-0',
            ].join(' ')}
          >
            <LogOut size={12} />
          </button>
        </div>
      </div>
    </aside>
  );
}
