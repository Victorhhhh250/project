import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ChevronDown,
  X,
  ChevronRight,
  DollarSign,
  BarChart2,
  Salad,
  UserCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/auth';
import { useAppStore } from '@/stores/useAppStore';
import { ROUTES } from '@/constants/routes';

interface SubMenuItem {
  label: string;
  path: string;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  submenu?: SubMenuItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Principal',
    items: [
      {
        label: 'Dashboard',
        path: ROUTES.dashboard,
        icon: LayoutDashboard,
      },
      {
        label: 'Alunos',
        path: ROUTES.alunos,
        icon: Users,
        badge: '248',
        submenu: [
          { label: 'Todos os Alunos',   path: ROUTES.alunos },
          { label: 'Novos Cadastros',   path: `${ROUTES.alunos}?status=Pendente` },
          { label: 'Ativos',            path: `${ROUTES.alunos}?status=Ativo` },
          { label: 'Inativos',          path: `${ROUTES.alunos}?status=Inativo` },
        ],
      },
      {
        label: 'Agenda',
        path: ROUTES.agenda,
        icon: Calendar,
        badge: '5',
      },
      {
        label: 'Planos Alimentares',
        path: ROUTES.dietas,
        icon: Salad,
      },
    ],
  },
  {
    title: 'Gestão',
    items: [
      {
        label: 'Financeiro',
        path: ROUTES.financeiro,
        icon: DollarSign,
      },
      {
        label: 'Relatórios',
        path: ROUTES.relatorios,
        icon: BarChart2,
      },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Meu Perfil',     path: ROUTES.perfil,       icon: UserCircle },
      { label: 'Configurações',  path: ROUTES.configuracoes, icon: Settings },
      { label: 'Ajuda & Suporte', path: '/ajuda',            icon: HelpCircle },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const store = useAppStore() as any;
  const sidebarOpen      = store?.sidebarOpen      ?? false;
  const setSidebarOpen   = store?.setSidebarOpen   ?? (() => {});
  const sidebarCollapsed = store?.sidebarCollapsed ?? false;
  const setSidebarCollapsed = store?.setSidebarCollapsed ?? (() => {});

  const [searchTerm, setSearchTerm]     = useState('');
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set(['Alunos']));
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredNav, setHoveredNav]     = useState<string | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const col = sidebarCollapsed;

  /* ── Rota ativa ── */
  const isPathActive = useCallback(
    (path: string) => {
      const [targetPath, targetQuery] = path.split('?');
      const currentPath  = location.pathname;
      const currentQuery = location.search;

      if (targetQuery) {
        return currentPath === targetPath && currentQuery.includes(targetQuery);
      }
      if (path === ROUTES.alunos) {
        return currentPath === targetPath && (!currentQuery || !currentQuery.includes('status='));
      }
      return currentPath === targetPath;
    },
    [location.pathname, location.search],
  );

  const isParentActive = useCallback(
    (item: NavItem) => {
      if (isPathActive(item.path)) return true;
      return item.submenu?.some((sub) => isPathActive(sub.path)) ?? false;
    },
    [isPathActive],
  );

  /* ── Auto-expande submenu quando a rota é filha ── */
  useEffect(() => {
    NAV_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        if (item.submenu?.some((sub) => isPathActive(sub.path))) {
          setOpenSubmenus((prev) => new Set(prev).add(item.label));
        }
      });
    });
  }, [location.pathname, location.search, isPathActive]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, location.search, setSidebarOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Filtro de busca ── */
  const filteredGroups = useMemo<NavGroup[]>(() => {
    if (!searchTerm.trim()) return NAV_GROUPS;
    const term = searchTerm.toLowerCase().trim();
    return NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const matchesLabel   = item.label.toLowerCase().includes(term);
        const matchesSubmenu = item.submenu?.some((sub) => sub.label.toLowerCase().includes(term));
        return matchesLabel || matchesSubmenu;
      }),
    })).filter((group) => group.items.length > 0);
  }, [searchTerm]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 lg:hidden bg-slate-950/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col',
          'lg:relative lg:z-auto',
          'bg-[#030712] border-r border-slate-800/80 text-slate-400',
          'transition-all duration-300 ease-in-out select-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          col ? 'w-20' : 'w-72',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="h-16 border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0">
          <Link to={ROUTES.dashboard} className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">A</span>
            </div>
            {!col && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-white text-base tracking-tight truncate leading-tight">
                  Atlhon Sales
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400/90">
                  CRM • Gestão
                </span>
              </div>
            )}
          </Link>

          <button type="button" onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Busca */}
        <div className="px-3 pt-4 pb-2 shrink-0">
          {!col ? (
            <div className="relative group">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Buscar no menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800/80 pl-9 pr-8 py-2 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 transition-all"
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer">
                  <X size={13} />
                </button>
              )}
            </div>
          ) : (
            <button type="button" onClick={() => setSidebarCollapsed(false)} title="Buscar"
              className="w-full flex justify-center py-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer">
              <Search size={18} />
            </button>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 py-3 space-y-5">
          {filteredGroups.map((group) => (
            <div key={group.title}>
              {!col && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {group.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const hasSubmenu = !!item.submenu?.length;
                  const isOpen     = openSubmenus.has(item.label);
                  const active     = isParentActive(item);

                  return (
                    <li key={item.label} className="relative"
                      onMouseEnter={() => col && setHoveredNav(item.label)}
                      onMouseLeave={() => col && setHoveredNav(null)}>

                      <Link
                        to={hasSubmenu && !col ? '#' : item.path}
                        onClick={(e) => {
                          if (hasSubmenu && !col) {
                            e.preventDefault();
                            toggleSubmenu(item.label);
                          } else if (col) {
                            setSidebarCollapsed(false);
                            if (hasSubmenu) setOpenSubmenus((prev) => new Set(prev).add(item.label));
                          }
                        }}
                        className={[
                          'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group',
                          col ? 'justify-center' : '',
                          active
                            ? 'bg-blue-600/10 text-white font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60',
                        ].join(' ')}
                      >
                        {active && (
                          <motion.div
                            layoutId="activePill"
                            className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.7)]"
                          />
                        )}

                        <item.icon size={18} className={`shrink-0 transition-colors ${active ? 'text-blue-500' : 'group-hover:text-slate-200'}`} />

                        {!col && <span className="truncate flex-1">{item.label}</span>}

                        {!col && (
                          <div className="flex items-center gap-1.5 ml-auto shrink-0">
                            {item.badge && (
                              <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                            {hasSubmenu && (
                              <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-300' : ''}`} />
                            )}
                          </div>
                        )}
                      </Link>

                      {/* Popover (modo recolhido) */}
                      {col && hoveredNav === item.label && (
                        <div className="absolute left-full top-0 ml-3 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-3 w-48 animate-fade-slide">
                          <div className="flex items-center justify-between font-semibold text-xs text-white pb-2 mb-2 border-b border-slate-800">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="bg-blue-500/10 text-blue-400 text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>
                            )}
                          </div>
                          {hasSubmenu ? (
                            <div className="space-y-1">
                              {item.submenu!.map((sub) => (
                                <Link key={sub.path} to={sub.path}
                                  className={`block px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                                    isPathActive(sub.path)
                                      ? 'text-blue-400 bg-blue-500/10 font-semibold'
                                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                  }`}>
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <Link to={item.path} className="text-[11px] text-slate-400 hover:text-white transition-colors">
                              Ir para {item.label}
                            </Link>
                          )}
                        </div>
                      )}

                      {/* Submenu expandido */}
                      <AnimatePresence>
                        {hasSubmenu && isOpen && !col && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="pl-8 pr-2 mt-0.5 space-y-0.5 border-l border-slate-800/80 ml-5 overflow-hidden"
                          >
                            {item.submenu!.map((sub) => {
                              const subActive = isPathActive(sub.path);
                              return (
                                <li key={sub.path}>
                                  <Link to={sub.path}
                                    className={`block px-3 py-1.5 text-xs rounded-lg transition-colors truncate ${
                                      subActive
                                        ? 'text-blue-400 font-semibold bg-blue-500/10'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                                    }`}>
                                    {sub.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Perfil */}
        <div className="border-t border-slate-800/80 p-3 shrink-0 relative" ref={profileRef}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 cursor-pointer group transition-colors ${col ? 'justify-center' : ''}`}
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#030712] rounded-full" />
            </div>

            {!col && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">Admin Demo</p>
                <p className="text-[10px] text-slate-500 truncate">admin@atlhon.com</p>
              </div>
            )}

            {!col && (
              <ChevronRight size={15} className={`text-slate-500 group-hover:text-slate-300 transition-transform ${showProfileMenu ? 'rotate-90' : ''}`} />
            )}
          </div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className={`absolute bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 ${col ? 'bottom-3 left-20 w-48' : 'bottom-16 left-3 right-3'}`}
              >
                <Link to={ROUTES.perfil} onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:bg-slate-800/80 rounded-xl transition-colors text-xs font-medium cursor-pointer">
                  <UserCircle size={15} className="shrink-0" />
                  <span>Meu Perfil</span>
                </Link>
                <Link to={ROUTES.configuracoes} onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:bg-slate-800/80 rounded-xl transition-colors text-xs font-medium cursor-pointer">
                  <Settings size={15} className="shrink-0" />
                  <span>Configurações</span>
                </Link>
                <div className="my-1 border-t border-slate-800" />
                <button type="button" onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-xs font-medium cursor-pointer">
                  <LogOut size={15} className="shrink-0" />
                  <span>Sair da conta</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expandir/Recolher */}
        <div className="hidden lg:block p-3 border-t border-slate-800/80 shrink-0">
          <button type="button" onClick={() => setSidebarCollapsed(!col)} title={col ? 'Expandir' : 'Recolher'}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer">
            {col ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /><span>Recolher menu</span></>}
          </button>
        </div>
      </aside>
    </>
  );
}
