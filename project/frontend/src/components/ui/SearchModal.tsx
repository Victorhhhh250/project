import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Users, Calendar, ArrowRight, Clock, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PAGES = [
  { label: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard, subtitle: 'Visão geral' },
  { label: 'Alunos',    path: ROUTES.alunos,    icon: Users,            subtitle: 'Lista e matrículas' },
  { label: 'Agenda',    path: ROUTES.agenda,    icon: Calendar,         subtitle: 'Aulas agendadas' },
];

const STUDENTS = [
  { name: 'Ana Souza',      email: 'ana@email.com',      plan: 'Pro',        initials: 'AS' },
  { name: 'Bruno Lima',     email: 'bruno@email.com',    plan: 'Basic',      initials: 'BL' },
  { name: 'Carla Mendes',   email: 'carla@email.com',    plan: 'Enterprise', initials: 'CM' },
  { name: 'Diego Rocha',    email: 'diego@email.com',    plan: 'Basic',      initials: 'DR' },
  { name: 'Elisa Ferreira', email: 'elisa@email.com',    plan: 'Pro',        initials: 'EF' },
  { name: 'Felipe Santos',  email: 'felipe@email.com',   plan: 'Basic',      initials: 'FS' },
  { name: 'Gabriela Costa', email: 'gabi@email.com',     plan: 'Pro',        initials: 'GC' },
];

const AVATAR_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899',
];

export function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate  = useNavigate();

  /* Focus input when opens */
  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  /* Escape to close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  const q = query.toLowerCase().trim();

  const filteredPages    = PAGES.filter(p =>
    p.label.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q),
  );
  const filteredStudents = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.plan.toLowerCase().includes(q),
  );

  const go = (path: string) => { navigate(path); onClose(); };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'rgba(255,255,255,0.97)',
          border: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 24px 64px rgba(15,23,42,0.18)',
        }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#f1f5f9]">
          <Search size={16} className="text-[#94a3b8] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar páginas, alunos, e-mails..."
            className="flex-1 text-[0.88rem] text-[#0f172a] placeholder-[#94a3b8] bg-transparent outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#94a3b8] hover:text-[#475569] transition-colors cursor-pointer border-none bg-transparent p-0">
              <X size={14} />
            </button>
          )}
          <kbd className="text-[0.6rem] font-semibold text-[#94a3b8] bg-[#f8fafc] border border-[#e2e8f0] rounded px-[6px] py-[3px]">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">

          {/* Pages */}
          {filteredPages.length > 0 && (
            <section className="mb-1">
              <p className="px-4 py-1.5 text-[0.65rem] font-bold text-[#94a3b8] uppercase tracking-wider">
                {q ? 'Páginas' : 'Navegação rápida'}
              </p>
              {filteredPages.map(({ label, path, icon: Icon, subtitle }) => (
                <button
                  key={path}
                  onClick={() => go(path)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8fafc] transition-colors text-left cursor-pointer border-none bg-transparent"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#2563eb]/[0.08] flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-[#2563eb]" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.83rem] font-semibold text-[#0f172a]">{label}</p>
                    <p className="text-[0.7rem] text-[#94a3b8]">{subtitle}</p>
                  </div>
                  <ArrowRight size={13} className="text-[#cbd5e1] shrink-0" />
                </button>
              ))}
            </section>
          )}

          {/* Students */}
          {filteredStudents.length > 0 && (
            <section>
              <p className="px-4 py-1.5 text-[0.65rem] font-bold text-[#94a3b8] uppercase tracking-wider">
                {q ? 'Alunos' : 'Alunos recentes'}
              </p>
              {(q ? filteredStudents : filteredStudents.slice(0, 4)).map(({ name, email, plan, initials }, i) => (
                <button
                  key={email}
                  onClick={() => go(ROUTES.alunos)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8fafc] transition-colors text-left cursor-pointer border-none bg-transparent"
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.62rem] font-bold shrink-0"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {initials}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.83rem] font-semibold text-[#0f172a] truncate">{name}</p>
                    <p className="text-[0.7rem] text-[#94a3b8] truncate">{email}</p>
                  </div>
                  <span className="text-[0.65rem] font-bold text-[#2563eb] bg-[#2563eb]/[0.07] px-2 py-0.5 rounded-md shrink-0">
                    {plan}
                  </span>
                </button>
              ))}
            </section>
          )}

          {/* Empty */}
          {q && filteredPages.length === 0 && filteredStudents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock size={28} className="text-[#e2e8f0] mb-3" />
              <p className="text-[0.85rem] font-semibold text-[#334155]">Nenhum resultado</p>
              <p className="text-[0.75rem] text-[#94a3b8] mt-1">Tente outro termo de busca.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#f1f5f9] bg-[#fafbfc]">
          {[['↵', 'Selecionar'], ['↑↓', 'Navegar'], ['Esc', 'Fechar']].map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5 text-[0.65rem] text-[#94a3b8]">
              <kbd className="bg-white border border-[#e2e8f0] rounded px-[5px] py-[2px] font-semibold text-[#64748b]">{key}</kbd>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
