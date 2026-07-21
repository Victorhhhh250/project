import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, UserPlus, DollarSign, AlertCircle, RefreshCw, Zap, X } from 'lucide-react';

interface Notification {
  id: number;
  type: 'enrollment' | 'payment' | 'alert' | 'renewal' | 'system';
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const INITIAL: Notification[] = [
  { id: 1, type: 'enrollment', title: 'Nova matrícula',       desc: 'Ana Souza se matriculou no Plano Pro',           time: 'há 5 min', read: false },
  { id: 2, type: 'payment',    title: 'Pagamento recebido',   desc: 'R$ 299,00 confirmado — Bruno Lima',              time: 'há 2h',    read: false },
  { id: 3, type: 'alert',      title: 'Aula cancelada',       desc: 'Personal Training das 09h foi cancelado',        time: 'há 4h',    read: false },
  { id: 4, type: 'renewal',    title: 'Renovação aprovada',   desc: 'Carla Mendes renovou o Plano Enterprise',        time: 'ontem',    read: true },
  { id: 5, type: 'system',     title: 'Atualização pendente', desc: 'Versão 2.1.0 do sistema disponível',             time: '2 dias',   read: true },
];

const TYPE_CONFIG = {
  enrollment: { icon: UserPlus,    bg: 'bg-blue-50',    text: 'text-blue-600',   dot: 'bg-blue-500' },
  payment:    { icon: DollarSign,  bg: 'bg-emerald-50', text: 'text-emerald-600',dot: 'bg-emerald-500' },
  alert:      { icon: AlertCircle, bg: 'bg-red-50',     text: 'text-red-500',    dot: 'bg-red-500' },
  renewal:    { icon: RefreshCw,   bg: 'bg-violet-50',  text: 'text-violet-600', dot: 'bg-violet-500' },
  system:     { icon: Zap,         bg: 'bg-amber-50',   text: 'text-amber-600',  dot: 'bg-amber-500' },
};

interface Props { onCountChange?: (n: number) => void }

export function NotificationsDropdown({ onCountChange }: Props) {
  const [open, setOpen]   = useState(false);
  const [items, setItems] = useState<Notification[]>(INITIAL);
  const ref = useRef<HTMLDivElement>(null);

  const unread = items.filter(n => !n.read).length;

  useEffect(() => { onCountChange?.(unread); }, [unread, onCountChange]);

  /* Click outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const markAllRead   = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss       = (id: number) => setItems(prev => prev.filter(n => n.id !== id));
  const markRead      = (id: number) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className={[
          'relative w-9 h-9 rounded-lg flex items-center justify-center',
          'transition-colors duration-200 border-none cursor-pointer',
          open
            ? 'bg-[#2563eb]/[0.08] text-[#2563eb]'
            : 'bg-transparent text-[#64748b] hover:text-[#0f172a] hover:bg-[#0f172a]/[0.05]',
        ].join(' ')}
        aria-label="Notificações"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute top-[7px] right-[7px] min-w-[16px] h-[16px] rounded-full bg-[#2563eb] text-white text-[0.5rem] font-bold flex items-center justify-center px-[3px] leading-none">
            {unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-[360px] rounded-2xl overflow-hidden z-[100]"
          style={{
            background: 'rgba(255,255,255,0.97)',
            border: '1px solid rgba(226,232,240,0.8)',
            boxShadow: '0 16px 48px rgba(15,23,42,0.14)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2">
              <p className="text-[0.88rem] font-bold text-[#0f172a]">Notificações</p>
              {unread > 0 && (
                <span className="bg-[#2563eb] text-white text-[0.58rem] font-bold px-[7px] py-[2px] rounded-full">
                  {unread}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors cursor-pointer border-none bg-transparent"
              >
                <CheckCheck size={13} />
                Marcar todas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-[#f8fafc]">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Bell size={28} className="text-[#e2e8f0] mb-3" />
                <p className="text-[0.83rem] font-semibold text-[#334155]">Tudo em dia!</p>
                <p className="text-[0.72rem] text-[#94a3b8] mt-1">Nenhuma notificação pendente.</p>
              </div>
            ) : items.map((item) => {
              const cfg = TYPE_CONFIG[item.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => markRead(item.id)}
                  className={[
                    'group flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer',
                    item.read ? 'hover:bg-[#fafbfc]' : 'bg-blue-50/30 hover:bg-blue-50/50',
                  ].join(' ')}
                >
                  {/* Icon */}
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg} ${cfg.text}`}>
                    <Icon size={14} />
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-[0.82rem] font-semibold truncate ${item.read ? 'text-[#475569]' : 'text-[#0f172a]'}`}>
                        {item.title}
                      </p>
                      {!item.read && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />}
                    </div>
                    <p className="text-[0.73rem] text-[#64748b] mt-0.5 leading-snug">{item.desc}</p>
                    <p className="text-[0.68rem] text-[#94a3b8] mt-1">{item.time}</p>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={e => { e.stopPropagation(); dismiss(item.id); }}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9] transition-all duration-200 shrink-0 mt-0.5 cursor-pointer border-none bg-transparent"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-4 py-3 border-t border-[#f1f5f9] bg-[#fafbfc]">
              <button className="w-full text-center text-[0.75rem] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors cursor-pointer border-none bg-transparent">
                Ver todas as notificações →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
