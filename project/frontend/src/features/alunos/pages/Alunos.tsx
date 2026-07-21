import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone, Users, UserCheck, UserX, Clock } from 'lucide-react';

interface Aluno {
  id: number; name: string; email: string; phone: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Ativo' | 'Inativo' | 'Pendente';
  since: string; avatar: string; color: string;
}

const mockAlunos: Aluno[] = [
  { id:  1, name: 'Ana Souza',      email: 'ana@email.com',      phone: '(11) 99999-0001', plan: 'Pro',        status: 'Ativo',    since: '18 Jul 2026', avatar: 'AS', color: '#3b82f6' },
  { id:  2, name: 'Bruno Lima',     email: 'bruno@email.com',    phone: '(21) 98888-0002', plan: 'Basic',      status: 'Ativo',    since: '16 Jul 2026', avatar: 'BL', color: '#8b5cf6' },
  { id:  3, name: 'Carla Mendes',   email: 'carla@email.com',    phone: '(31) 97777-0003', plan: 'Enterprise', status: 'Ativo',    since: '14 Jul 2026', avatar: 'CM', color: '#10b981' },
  { id:  4, name: 'Diego Rocha',    email: 'diego@email.com',    phone: '(41) 96666-0004', plan: 'Basic',      status: 'Pendente', since: '12 Jul 2026', avatar: 'DR', color: '#f59e0b' },
  { id:  5, name: 'Elisa Ferreira', email: 'elisa@email.com',    phone: '(51) 95555-0005', plan: 'Pro',        status: 'Ativo',    since: '10 Jul 2026', avatar: 'EF', color: '#ef4444' },
  { id:  6, name: 'Felipe Santos',  email: 'felipe@email.com',   phone: '(61) 94444-0006', plan: 'Basic',      status: 'Inativo',  since: '05 Jul 2026', avatar: 'FS', color: '#06b6d4' },
  { id:  7, name: 'Gabriela Costa', email: 'gabi@email.com',     phone: '(71) 93333-0007', plan: 'Pro',        status: 'Ativo',    since: '02 Jul 2026', avatar: 'GC', color: '#ec4899' },
  { id:  8, name: 'Henrique Alves', email: 'henrique@email.com', phone: '(81) 92222-0008', plan: 'Enterprise', status: 'Ativo',    since: '28 Jun 2026', avatar: 'HA', color: '#2563eb' },
  { id:  9, name: 'Isabela Nunes',  email: 'isa@email.com',      phone: '(91) 91111-0009', plan: 'Basic',      status: 'Pendente', since: '24 Jun 2026', avatar: 'IN', color: '#7c3aed' },
  { id: 10, name: 'João Pereira',   email: 'joao@email.com',     phone: '(11) 90000-0010', plan: 'Pro',        status: 'Ativo',    since: '20 Jun 2026', avatar: 'JP', color: '#059669' },
  { id: 11, name: 'Karen Oliveira', email: 'karen@email.com',    phone: '(21) 99887-0011', plan: 'Enterprise', status: 'Ativo',    since: '15 Jun 2026', avatar: 'KO', color: '#d97706' },
  { id: 12, name: 'Lucas Martins',  email: 'lucas@email.com',    phone: '(31) 98776-0012', plan: 'Basic',      status: 'Inativo',  since: '10 Jun 2026', avatar: 'LM', color: '#64748b' },
];

const statusStyle: Record<string, string> = {
  Ativo:    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Pendente: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Inativo:  'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
};

const planStyle: Record<string, { cls: string; dot: string }> = {
  Basic:      { cls: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-400' },
  Pro:        { cls: 'bg-blue-50 text-[#1d4ed8]',     dot: 'bg-[#2563eb]' },
  Enterprise: { cls: 'bg-violet-50 text-violet-700',  dot: 'bg-violet-500' },
};

type FilterTab = 'Todos' | 'Ativo' | 'Inativo' | 'Pendente';

export default function Alunos() {
  const [search,    setSearch]    = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('Todos');
  const [menuOpen,  setMenuOpen]  = useState<number | null>(null);

  const filtered = mockAlunos.filter(a => {
    const q = search.toLowerCase();
    return (a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
      && (activeTab === 'Todos' || a.status === activeTab);
  });

  const tabs: FilterTab[]                    = ['Todos', 'Ativo', 'Inativo', 'Pendente'];
  const counts: Record<FilterTab, number>    = {
    Todos:   mockAlunos.length,
    Ativo:   mockAlunos.filter(a => a.status === 'Ativo').length,
    Inativo: mockAlunos.filter(a => a.status === 'Inativo').length,
    Pendente:mockAlunos.filter(a => a.status === 'Pendente').length,
  };

  const kpis = [
    { label: 'Total',     value: mockAlunos.length, icon: Users,     color: 'text-[#0f172a]',   bg: 'bg-slate-50',   border: 'bg-[#0f172a]' },
    { label: 'Ativos',    value: counts.Ativo,      icon: UserCheck,  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'bg-emerald-500' },
    { label: 'Inativos',  value: counts.Inativo,    icon: UserX,      color: 'text-[#64748b]',   bg: 'bg-slate-50',   border: 'bg-slate-400' },
    { label: 'Pendentes', value: counts.Pendente,   icon: Clock,      color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'bg-amber-400' },
  ];

  return (
    <div className="space-y-5">

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #1e293b 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: '#2563eb', filter: 'blur(65px)', opacity: 0.14 }} />
        <div className="absolute bottom-0 left-1/4 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: '#1e3a8a', filter: 'blur(55px)', opacity: 0.18 }} />

        <div className="relative z-10 flex items-center justify-between px-6 py-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-white/40 text-[0.62rem] font-bold tracking-[0.2em] uppercase">Gestão de Alunos</span>
            </div>
            <h2 className="text-white text-[1.35rem] font-bold tracking-tight leading-none">Alunos</h2>
            <p className="text-white/40 text-[0.78rem] mt-1.5">
              {mockAlunos.length} cadastros · {counts.Ativo} ativos · {counts.Pendente} aguardando
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-[0.8rem] text-white cursor-pointer border-none transition-all duration-200 active:scale-[0.98] hover:shadow-lg hover:shadow-blue-600/30"
            style={{ background: '#2563eb' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
          >
            <Plus size={14} />
            Novo Aluno
          </button>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className="relative bg-white rounded-xl border border-[#e2e8f0] px-4 py-3.5 overflow-hidden hover:shadow-sm transition-all duration-200 cursor-default">
            <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl ${border}`} />
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-[1.6rem] font-bold leading-none tracking-tight ${color}`}>{value}</p>
                <p className="text-[0.7rem] text-[#94a3b8] font-semibold mt-1 uppercase tracking-wide">{label}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg} ${color} shrink-0`}>
                <Icon size={15} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#f1f5f9]">
          {/* Tabs */}
          <div className="flex items-center gap-0.5 bg-[#f1f5f9] p-1 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.75rem] font-semibold transition-all duration-150 cursor-pointer border-none ${
                  activeTab === tab
                    ? 'bg-white text-[#0f172a] shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
                    : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                {tab}
                <span className={`text-[0.6rem] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold ${
                  activeTab === tab ? 'bg-[#f1f5f9] text-[#64748b]' : 'text-[#94a3b8]'
                }`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex items-center">
            <Search size={13} className="absolute left-3 text-[#94a3b8] pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar nome ou e-mail..."
              className="pl-8 pr-4 py-2 text-[0.78rem] rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/15 focus:border-[#2563eb] focus:bg-white transition-all w-52"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: '#fafbfc' }} className="border-b border-[#f1f5f9]">
                {['Aluno', 'Contato', 'Plano', 'Status', 'Membro desde', ''].map((h, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3 text-[0.67rem] font-bold text-[#94a3b8] uppercase tracking-wider ${
                      i === 1 ? 'hidden md:table-cell' : i === 4 ? 'hidden lg:table-cell' : i === 5 ? 'w-10' : ''
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={28} className="text-[#e2e8f0]" />
                      <p className="text-[0.85rem] font-semibold text-[#334155]">Nenhum aluno encontrado</p>
                      <p className="text-[0.73rem] text-[#94a3b8]">Tente outro termo de busca.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-[#fafbfc] transition-colors group">
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.6rem] font-bold shrink-0"
                          style={{ background: aluno.color }}
                        >
                          {aluno.avatar}
                        </div>
                        <div>
                          <p className="text-[0.83rem] font-semibold text-[#0f172a]">{aluno.name}</p>
                          <p className="text-[#94a3b8] text-[0.7rem] md:hidden">{aluno.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[0.75rem] text-[#475569]">
                          <Mail size={11} className="text-[#94a3b8]" /> {aluno.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[0.7rem] text-[#94a3b8]">
                          <Phone size={10} /> {aluno.phone}
                        </div>
                      </div>
                    </td>
                    {/* Plan */}
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1.5 w-fit text-[0.67rem] font-bold px-2.5 py-1 rounded-md ${planStyle[aluno.plan].cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${planStyle[aluno.plan].dot}`} />
                        {aluno.plan}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`text-[0.67rem] font-semibold px-2.5 py-1 rounded-full ${statusStyle[aluno.status]}`}>
                        {aluno.status}
                      </span>
                    </td>
                    {/* Since */}
                    <td className="px-5 py-3.5 hidden lg:table-cell text-[0.75rem] text-[#64748b]">
                      {aluno.since}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3.5 relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === aluno.id ? null : aluno.id)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-none bg-transparent"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {menuOpen === aluno.id && (
                        <div className="absolute right-4 top-10 z-20 bg-white border border-[#e2e8f0] rounded-xl shadow-lg shadow-black/[0.06] py-1 w-36">
                          {['Ver perfil', 'Editar', 'Desativar'].map(action => (
                            <button
                              key={action}
                              onClick={() => setMenuOpen(null)}
                              className={`w-full text-left px-3.5 py-2.5 text-[0.78rem] font-medium transition-colors cursor-pointer border-none bg-transparent ${
                                action === 'Desativar' ? 'text-red-500 hover:bg-red-50' : 'text-[#334155] hover:bg-[#f8fafc]'
                              }`}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#f1f5f9] bg-[#fafbfc]">
          <p className="text-[0.72rem] text-[#94a3b8]">
            Mostrando <span className="font-semibold text-[#475569]">{filtered.length}</span> de <span className="font-semibold text-[#475569]">{mockAlunos.length}</span> alunos
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-7 h-7 rounded-md text-[0.75rem] font-semibold flex items-center justify-center transition-colors cursor-pointer border-none ${
                p === 1 ? 'bg-[#2563eb] text-white shadow-sm shadow-blue-600/20' : 'bg-transparent text-[#64748b] hover:bg-[#f1f5f9]'
              }`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
