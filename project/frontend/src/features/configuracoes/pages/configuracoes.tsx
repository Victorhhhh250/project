import { useState } from 'react';
import {
  Settings,
  Building2,
  Palette,
  Globe,
  Zap,
  Database,
  ShieldCheck,
  Save,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

type Tab = 'geral' | 'aparencia' | 'integracoes' | 'planos' | 'avancado';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} disabled={disabled}
      onClick={onChange}
      className={`relative rounded-full transition-colors duration-200 shrink-0 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
      style={{ width: '40px', height: '22px' }}>
      <span className={`absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
        style={{ width: '18px', height: '18px' }} />
    </button>
  );
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'geral',        label: 'Geral',          icon: Settings },
  { id: 'aparencia',    label: 'Aparência',       icon: Palette },
  { id: 'integracoes',  label: 'Integrações',     icon: Zap },
  { id: 'planos',       label: 'Plano & Fatura',  icon: ShieldCheck },
  { id: 'avancado',     label: 'Avançado',        icon: Database },
];

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState<Tab>('geral');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    nomeEmpresa:     'Atlhon Sales',
    emailContato:    'contato@atlhon.com',
    telefone:        '(11) 99999-0000',
    fuso:            'America/Sao_Paulo',
    moeda:           'BRL',
    idioma:          'pt-BR',
    temaEscuro:      false,
    compactMode:     false,
    animacoes:       true,
    autoBackup:      true,
    modoManutencao:  false,
    logAtividades:   true,
  });

  const update = (key: keyof typeof settings, value: boolean | string) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const integrations = [
    { name: 'Google Calendar',  desc: 'Sincronize eventos com a agenda Google',   connected: true,  logo: '📅' },
    { name: 'Stripe',           desc: 'Processamento de pagamentos e cobranças',   connected: true,  logo: '💳' },
    { name: 'WhatsApp',         desc: 'Envio de mensagens automáticas',            connected: false, logo: '💬' },
    { name: 'Mailchimp',        desc: 'Campanhas de e-mail e marketing',           connected: false, logo: '📧' },
    { name: 'Zapier',           desc: 'Automações com mais de 5.000 aplicativos',  connected: false, logo: '⚡' },
    { name: 'Slack',            desc: 'Notificações da equipe em tempo real',      connected: false, logo: '🔔' },
  ];

  return (
    <div className="space-y-6 text-slate-800">

      {/* Header */}
      <div className="animate-fade-slide">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Configurações</h1>
          <span className="page-tag">
            <Sparkles className="w-3 h-3 text-blue-500" /> Sistema
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">Personalize e controle o comportamento da plataforma</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 animate-fade-slide delay-100">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}>
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Geral */}
      {activeTab === 'geral' && (
        <div className="space-y-4 animate-fade-slide">
          <div className="panel-card space-y-5">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Building2 size={16} className="text-slate-400" /> Informações da Empresa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Nome da Empresa', key: 'nomeEmpresa',  type: 'text' },
                { label: 'E-mail de Contato', key: 'emailContato', type: 'email' },
                { label: 'Telefone',         key: 'telefone',     type: 'tel' },
              ].map(({ label, key, type }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
                  <input type={type} value={settings[key as keyof typeof settings] as string}
                    onChange={(e) => update(key as keyof typeof settings, e.target.value)}
                    className="input-field px-3.5 py-2.5 text-xs" />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fuso Horário</label>
                <select value={settings.fuso} onChange={(e) => update('fuso', e.target.value)}
                  className="input-field px-3.5 py-2.5 text-xs appearance-none cursor-pointer">
                  <option value="America/Sao_Paulo">América/São Paulo (BRT)</option>
                  <option value="America/Manaus">América/Manaus (AMT)</option>
                  <option value="America/Fortaleza">América/Fortaleza (BRT)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="panel-card space-y-1">
            <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Globe size={16} className="text-slate-400" /> Localização & Moeda
            </h3>
            {[
              { label: 'Idioma', key: 'idioma', options: [{ v: 'pt-BR', l: 'Português (Brasil)' }, { v: 'en-US', l: 'English (US)' }, { v: 'es-ES', l: 'Español' }] },
              { label: 'Moeda',  key: 'moeda',  options: [{ v: 'BRL', l: 'Real (BRL)' }, { v: 'USD', l: 'Dollar (USD)' }, { v: 'EUR', l: 'Euro (EUR)' }] },
            ].map(({ label, key, options }) => (
              <div key={key} className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-none">
                <span className="text-xs font-medium text-slate-700">{label}</span>
                <select value={settings[key as keyof typeof settings] as string} onChange={(e) => update(key as keyof typeof settings, e.target.value)}
                  className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 appearance-none cursor-pointer focus:outline-none focus:border-blue-500">
                  {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'btn-primary'}`}>
              {saved ? <><CheckCircle2 size={14} /> Salvo!</> : <><Save size={14} /> Salvar configurações</>}
            </button>
          </div>
        </div>
      )}

      {/* Aparência */}
      {activeTab === 'aparencia' && (
        <div className="panel-card animate-fade-slide space-y-1">
          <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Palette size={16} className="text-slate-400" /> Preferências Visuais
          </h3>
          {[
            { key: 'temaEscuro',    label: 'Modo escuro',        desc: 'Interface com tema dark (em breve)' },
            { key: 'compactMode',   label: 'Modo compacto',      desc: 'Reduz o espaçamento para mais densidade' },
            { key: 'animacoes',     label: 'Animações',          desc: 'Ativa transições e microinterações' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-none">
              <div>
                <p className="text-xs font-semibold text-slate-800">{label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
              </div>
              <Toggle
                checked={settings[key as keyof typeof settings] as boolean}
                onChange={() => update(key as keyof typeof settings, !settings[key as keyof typeof settings])}
                disabled={key === 'temaEscuro'}
              />
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <button type="button" onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'btn-primary'}`}>
              {saved ? <><CheckCircle2 size={14} /> Salvo!</> : <><Save size={14} /> Salvar</>}
            </button>
          </div>
        </div>
      )}

      {/* Integrações */}
      {activeTab === 'integracoes' && (
        <div className="space-y-3 animate-fade-slide">
          {integrations.map((integ) => (
            <div key={integ.name} className="panel-card !p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">
                  {integ.logo}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{integ.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{integ.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {integ.connected ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Conectado
                    </span>
                    <button type="button" className="btn-icon" onClick={() => alert(`Configurar ${integ.name}`)}>
                      <ChevronRight size={14} />
                    </button>
                  </>
                ) : (
                  <button type="button"
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    onClick={() => alert(`Conectar ${integ.name}`)}>
                    <ExternalLink size={12} /> Conectar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Planos */}
      {activeTab === 'planos' && (
        <div className="space-y-4 animate-fade-slide">
          <div className="panel-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">Plano Atual</p>
                <h3 className="text-2xl font-bold text-slate-800">Enterprise</h3>
                <p className="text-sm text-slate-500 mt-1">Renovação em <strong className="text-slate-700">01 Ago 2026</strong></p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
                <ShieldCheck size={13} /> Ativo
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              {[
                { label: 'Usuários',    value: 'Ilimitado' },
                { label: 'Alunos',     value: 'Até 1.000' },
                { label: 'Suporte',    value: 'Prioritário' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-sm font-bold text-slate-800">{item.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-card !p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-800">Próxima fatura</p>
              <p className="text-[11px] text-slate-400 mt-0.5">R$ 497,00 — 01 Ago 2026 via Cartão ••• 4242</p>
            </div>
            <button type="button" className="btn-outline text-xs" onClick={() => alert('Gerenciar fatura')}>
              Gerenciar
            </button>
          </div>
        </div>
      )}

      {/* Avançado */}
      {activeTab === 'avancado' && (
        <div className="space-y-4 animate-fade-slide">
          <div className="panel-card space-y-1">
            <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Database size={16} className="text-slate-400" /> Dados & Sistema
            </h3>
            {[
              { key: 'autoBackup',     label: 'Backup automático',    desc: 'Realiza backup diário dos dados' },
              { key: 'logAtividades',  label: 'Log de atividades',    desc: 'Registra todas as ações de usuários' },
              { key: 'modoManutencao', label: 'Modo manutenção',      desc: 'Bloqueia o acesso de outros usuários' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-none">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                </div>
                <Toggle
                  checked={settings[key as keyof typeof settings] as boolean}
                  onChange={() => update(key as keyof typeof settings, !settings[key as keyof typeof settings])}
                />
              </div>
            ))}
          </div>

          <div className="panel-card space-y-3">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <RefreshCw size={16} className="text-slate-400" /> Manutenção
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" className="btn-outline flex-1 justify-center" onClick={() => alert('Limpando cache do sistema...')}>
                <RefreshCw size={14} className="text-slate-500" /> Limpar Cache
              </button>
              <button type="button" className="btn-outline flex-1 justify-center" onClick={() => alert('Exportando backup...')}>
                <Database size={14} className="text-slate-500" /> Exportar Backup
              </button>
            </div>
          </div>

          <div className="panel-card border border-rose-200/60 bg-rose-50/30">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-rose-800">Zona de Perigo</h3>
                <p className="text-[11px] text-rose-600/80 mt-0.5">Essas ações são irreversíveis. Proceda com cuidado.</p>
              </div>
            </div>
            <button type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer shadow-sm"
              onClick={() => alert('Confirmação necessária para excluir os dados.')}>
              <Trash2 size={13} /> Excluir todos os dados da conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
