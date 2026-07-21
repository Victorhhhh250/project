import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, User, Settings, Shield,
  LogOut, Moon, Sun, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/app/auth';

export function ProfileDropdown() {
  const [open, setOpen]   = useState(false);
  const [dark, setDark]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);
  const { logout }        = useAuth();
  const navigate          = useNavigate();

  /* Click outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleLogout = () => { setOpen(false); logout(); navigate('/'); };

  const menuItems = [
    { icon: User,       label: 'Meu perfil',       action: () => setOpen(false) },
    { icon: Settings,   label: 'Configurações',     action: () => setOpen(false) },
    { icon: Shield,     label: 'Segurança',         action: () => setOpen(false) },
    { icon: ExternalLink, label: 'Suporte',          action: () => setOpen(false) },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className={[
          'flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-lg',
          'transition-all duration-200 border-none cursor-pointer',
          open
            ? 'bg-[#2563eb]/[0.08]'
            : 'bg-transparent hover:bg-[#0f172a]/[0.05]',
        ].join(' ')}
      >
        {/* Avatar */}
        <div className="w-[27px] h-[27px] rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-[0.58rem] font-bold shrink-0">
          AD
        </div>
        <span className={`text-[0.8rem] font-semibold hidden sm:block transition-colors ${open ? 'text-[#1e40af]' : 'text-[#334155]'}`}>
          Admin
        </span>
        <ChevronDown
          size={13}
          className={`text-[#94a3b8] hidden sm:block transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-[240px] rounded-2xl overflow-hidden z-[100]"
          style={{
            background: 'rgba(255,255,255,0.97)',
            border: '1px solid rgba(226,232,240,0.8)',
            boxShadow: '0 16px 48px rgba(15,23,42,0.14)',
          }}
        >
          {/* User info */}
          <div className="px-4 py-4 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-[0.7rem] font-bold shrink-0">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-[0.85rem] font-bold text-[#0f172a] truncate">Admin Demo</p>
                <p className="text-[0.72rem] text-[#64748b] truncate">admin@atlhon.com</p>
              </div>
            </div>
            {/* Plan badge */}
            <div className="mt-3 flex items-center gap-1.5 bg-[#2563eb]/[0.07] rounded-lg px-3 py-2">
              <Shield size={12} className="text-[#2563eb] shrink-0" />
              <span className="text-[0.72rem] font-semibold text-[#1e40af]">Plano Enterprise</span>
              <span className="ml-auto text-[0.62rem] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Ativo</span>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            {menuItems.map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[0.82rem] font-medium text-[#334155] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors cursor-pointer border-none bg-transparent text-left"
              >
                <Icon size={14} className="text-[#94a3b8] shrink-0" />
                {label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <div className="px-4 py-2.5 border-t border-[#f1f5f9] border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {dark ? <Moon size={14} className="text-[#94a3b8]" /> : <Sun size={14} className="text-[#94a3b8]" />}
                <span className="text-[0.82rem] font-medium text-[#334155]">
                  {dark ? 'Modo escuro' : 'Modo claro'}
                </span>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => setDark(v => !v)}
                className={[
                  'w-9 h-5 rounded-full transition-all duration-200 relative cursor-pointer border-none',
                  dark ? 'bg-[#2563eb]' : 'bg-[#e2e8f0]',
                ].join(' ')}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
                  style={{ left: dark ? 'calc(100% - 18px)' : '2px' }}
                />
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="py-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[0.82rem] font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent text-left"
            >
              <LogOut size={14} className="shrink-0" />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
