import { useState } from 'react';
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  Sparkles,
  CheckCircle2,
  Building2,
  Globe,
} from 'lucide-react';

type Tab = 'dados' | 'seguranca' | 'notificacoes';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0 cursor-pointer border-none ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
      style={{ height: '22px' }}
    >
      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
        style={{ width: '18px', height: '18px' }} />
    </button>
  );
}

export default function Perfil() {
  const [activeTab, setActiveTab] = useState<Tab>('dados');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const [notif, setNotif] = useState({
    novaMatricula:   true,
    pagamento:       true,
    cancelamento:    true,
    relatorioSemanal: false,
    marketingEmail:  false,
    sms:             true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dados',        label: 'Dados Pessoais',   icon: User },
    { id: 'seguranca',    label: 'Segurança',         icon: Shield },
    { id: 'notificacoes', label: 'Notificações',      icon: Bell },
  ];

  return (
    <div className="space-y-6 text-slate-800 max-w-3xl">

      {/* Header */}
      <div className="animate-fade-slide">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Meu Perfil</h1>
          <span className="page-tag">
            <Sparkles className="w-3 h-3 text-blue-500" /> Conta
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">Gerencie suas informações pessoais e preferências</p>
      </div>

      {/* Profile Card */}
      <div className="panel-card animate-fade-slide delay-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
              AD
            </div>
            <button type="button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm cursor-pointer"
              onClick={() => alert('Alterar foto de perfil')}>
              <Camera size={13} />
            </button>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-lg font-bold text-slate-800">Admin Demo</h2>
            <p className="text-sm text-slate-500 mt-0.5">admin@atlhon.com</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                <Shield size={11} /> Administrador
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <CheckCircle2 size={11} /> Conta verificada
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 animate-fade-slide delay-100">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer whitespace-nowrap ${
              activeTab === id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}>
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Dados Pessoais */}
      {activeTab === 'dados' && (
        <div className="panel-card animate-fade-slide space-y-5">
          <h3 className="text-base font-semibold text-slate-800 mb-1">Informações Pessoais</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Nome Completo',  id: 'nome',     icon: User,      value: 'Admin Demo',          type: 'text' },
              { label: 'E-mail',         id: 'email',    icon: Mail,      value: 'admin@atlhon.com',    type: 'email' },
              { label: 'Telefone',       id: 'telefone', icon: Phone,     value: '(11) 99999-0000',     type: 'tel' },
              { label: 'Cargo / Função', id: 'cargo',    icon: Building2, value: 'Administrador',       type: 'text' },
              { label: 'Cidade',         id: 'cidade',   icon: MapPin,    value: 'São Paulo, SP',       type: 'text' },
              { label: 'Site ou Link',   id: 'site',     icon: Globe,     value: 'atlhon.com',          type: 'url' },
            ].map((field) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label htmlFor={field.id} className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{field.label}</label>
                <div className="relative">
                  <field.icon size={14} className="absolute left-3.5 top-3 text-slate-400" />
                  <input id={field.id} type={field.type} defaultValue={field.value}
                    className="input-field pl-9 pr-3 py-2.5 text-xs" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Biografia</label>
            <textarea rows={3} defaultValue="Gestor da plataforma Atlhon Sales. Responsável pela administração de alunos e finanças."
              className="input-field px-4 py-3 text-xs resize-none" />
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button type="button" onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                saved ? 'bg-emerald-500 text-white' : 'btn-primary'
              }`}>
              {saved ? <><CheckCircle2 size={14} /> Salvo!</> : <><Save size={14} /> Salvar alterações</>}
            </button>
          </div>
        </div>
      )}

      {/* Tab: Segurança */}
      {activeTab === 'seguranca' && (
        <div className="space-y-4 animate-fade-slide">
          <div className="panel-card space-y-4">
            <h3 className="text-base font-semibold text-slate-800">Alterar Senha</h3>

            {[
              { label: 'Senha Atual',   id: 'curr', show: showCurrentPass, toggle: () => setShowCurrentPass((v) => !v) },
              { label: 'Nova Senha',    id: 'new',  show: showNewPass,     toggle: () => setShowNewPass((v) => !v) },
              { label: 'Confirmar Nova Senha', id: 'conf', show: showNewPass, toggle: () => setShowNewPass((v) => !v) },
            ].map((field) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label htmlFor={field.id} className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{field.label}</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-3 text-slate-400" />
                  <input id={field.id} type={field.show ? 'text' : 'password'} placeholder="••••••••"
                    className="input-field pl-9 pr-10 py-2.5 text-xs" />
                  <button type="button" onClick={field.toggle}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                    {field.show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button type="button" onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'btn-primary'}`}>
                {saved ? <><CheckCircle2 size={14} /> Atualizado!</> : <><Save size={14} /> Atualizar senha</>}
              </button>
            </div>
          </div>

          <div className="panel-card space-y-4">
            <h3 className="text-base font-semibold text-slate-800">Sessões Ativas</h3>
            {[
              { device: 'Chrome · macOS', location: 'São Paulo, BR', time: 'Agora (sessão atual)', current: true },
              { device: 'Safari · iPhone', location: 'São Paulo, BR', time: 'Há 2 horas', current: false },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{session.device}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{session.location} · {session.time}</p>
                </div>
                {session.current
                  ? <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">Atual</span>
                  : <button type="button" className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer" onClick={() => alert('Sessão encerrada')}>Encerrar</button>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Notificações */}
      {activeTab === 'notificacoes' && (
        <div className="panel-card animate-fade-slide space-y-1">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Preferências de Notificação</h3>
          {[
            { key: 'novaMatricula',    label: 'Nova matrícula',         desc: 'Receba ao cadastrar um novo aluno' },
            { key: 'pagamento',        label: 'Pagamento recebido',      desc: 'Notificação de cobrança confirmada' },
            { key: 'cancelamento',     label: 'Cancelamento de plano',   desc: 'Alerta quando um aluno cancela' },
            { key: 'relatorioSemanal', label: 'Relatório semanal',       desc: 'Resumo automático toda segunda-feira' },
            { key: 'marketingEmail',   label: 'E-mails de marketing',    desc: 'Novidades, dicas e atualizações da plataforma' },
            { key: 'sms',              label: 'Notificações via SMS',    desc: 'Alertas críticos por mensagem de texto' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-none">
              <div>
                <p className="text-xs font-semibold text-slate-800">{label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
              </div>
              <Toggle
                checked={notif[key as keyof typeof notif]}
                onChange={() => setNotif((n) => ({ ...n, [key]: !n[key as keyof typeof notif] }))}
              />
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button type="button" onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'btn-primary'}`}>
              {saved ? <><CheckCircle2 size={14} /> Salvo!</> : <><Save size={14} /> Salvar preferências</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
