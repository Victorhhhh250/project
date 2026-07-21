import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { 
  Bell, 
  BellRing,
  CheckCheck, 
  UserPlus, 
  DollarSign, 
  AlertCircle, 
  RefreshCw, 
  Zap, 
  X, 
  ChevronRight,
  Trash2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type NotificationType = 'enrollment' | 'payment' | 'alert' | 'renewal' | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'enrollment', title: 'Nova matrícula', desc: 'Ana Souza se matriculou no Plano Pro', time: 'há 5 min', read: false },
  { id: 2, type: 'payment', title: 'Pagamento recebido', desc: 'R$ 299,00 confirmado — Bruno Lima', time: 'há 2h', read: false },
  { id: 3, type: 'alert', title: 'Aula cancelada', desc: 'Personal Training das 09h foi cancelado', time: 'há 4h', read: false },
  { id: 4, type: 'renewal', title: 'Renovação aprovada', desc: 'Carla Mendes renovou o Plano Enterprise', time: 'ontem', read: true },
  { id: 5, type: 'system', title: 'Atualização pendente', desc: 'Versão 2.1.0 do sistema disponível para instalação', time: '2 dias', read: true },
];

/* ── Mapeamento Estrito de Estilos e Ícones da Lucide ── */
const TYPE_CONFIG: Record<
  NotificationType, 
  { icon: React.ElementType; badgeBg: string; dotBg: string; actionText: string }
> = {
  enrollment: {
    icon: UserPlus,
    badgeBg: 'bg-blue-50 text-blue-600 border-blue-200/60',
    dotBg: 'bg-blue-500',
    actionText: 'Ver Aluno',
  },
  payment: {
    icon: DollarSign,
    badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
    dotBg: 'bg-emerald-500',
    actionText: 'Ver Recibo',
  },
  alert: {
    icon: AlertCircle,
    badgeBg: 'bg-rose-50 text-rose-600 border-rose-200/60',
    dotBg: 'bg-rose-500',
    actionText: 'Ver Agenda',
  },
  renewal: {
    icon: RefreshCw,
    badgeBg: 'bg-violet-50 text-violet-600 border-violet-200/60',
    dotBg: 'bg-violet-500',
    actionText: 'Ver Contrato',
  },
  system: {
    icon: Zap,
    badgeBg: 'bg-amber-50 text-amber-600 border-amber-200/60',
    dotBg: 'bg-amber-500',
    actionText: 'Detalhes',
  },
};

interface Props {
  onCountChange?: (count: number) => void;
}

export function NotificationsDropdown({ onCountChange }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  // Sincroniza contador externo
  useEffect(() => {
    onCountChange?.(unreadCount);
  }, [unreadCount, onCountChange]);

  /* Fechar ao clicar fora */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const dismiss = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  }, [notifications, activeTab]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* ── BOTÃO DE NOTIFICAÇÃO ── */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`
          relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer
          ${open 
            ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500/20' 
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }
        `}
        aria-label={`Notificações (${unreadCount} não lidas)`}
        aria-expanded={open}
      >
        {/* Ícone Lucide dinâmico */}
        {unreadCount > 0 ? (
          <BellRing size={18} className="text-blue-600 animate-pulse" />
        ) : (
          <Bell size={18} />
        )}

        {/* Badge de Alerta */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
          </span>
        )}
      </button>

      {/* ── DROPDOWN FLUTUANTE ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-[calc(100%+8px)] w-[360px] sm:w-[390px] bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-100/90 overflow-hidden z-50 flex flex-col"
          >
            {/* ── HEADER ── */}
            <div className="p-4 pb-3 border-b border-slate-100 bg-white/80 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm tracking-tight">Notificações</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded-full">
                      {unreadCount} novas
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      <CheckCheck size={14} />
                      Marcar lidas
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      title="Limpar todas as notificações"
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* ── ABAS DE NAVEGAÇÃO ── */}
              <div className="flex bg-slate-100/80 p-0.5 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('unread')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    activeTab === 'unread'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Não lidas ({unreadCount})
                </button>
              </div>
            </div>

            {/* ── LISTA DE NOTIFICAÇÕES ── */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 text-slate-300">
                    <Sparkles size={22} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Tudo limpo por aqui!</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {activeTab === 'unread' 
                      ? 'Você não possui mensagens não lidas.' 
                      : 'Nenhuma notificação recente.'}
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {filteredNotifications.map((item) => {
                    const config = TYPE_CONFIG[item.type];
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => markAsRead(item.id)}
                        className={`
                          group relative flex gap-3.5 p-4 transition-colors cursor-pointer
                          ${!item.read ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-slate-50/80'}
                        `}
                      >
                        {/* Ícone */}
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${config.badgeBg} mt-0.5`}>
                          <Icon size={16} />
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-semibold ${item.read ? 'text-slate-700' : 'text-slate-900'}`}>
                              {item.title}
                            </p>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                              {!item.read && (
                                <span className={`w-1.5 h-1.5 rounded-full ${config.dotBg}`} />
                              )}
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {item.desc}
                          </p>

                          {/* Ação Contextual */}
                          <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700">
                            <span>{config.actionText}</span>
                            <ChevronRight size={12} />
                          </div>
                        </div>

                        {/* Botão Dispensar */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismiss(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all self-start"
                          aria-label="Dispensar notificação"
                        >
                          <X size={13} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* ── FOOTER ── */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                <button
                  type="button"
                  onClick={() => alert('Navegar para central de notificações')}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200/80 cursor-pointer"
                >
                  Ver central completa
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}