import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User } from 'lucide-react';

interface Evento {
  id: number; title: string; time: string; duration: string;
  instructor: string; location: string;
  type: 'aula' | 'avaliacao' | 'reuniao' | 'personal'; day: number;
}

const eventos: Evento[] = [
  { id:  1, title: 'Yoga Flow',             time: '07:00', duration: '1h',    instructor: 'Maria Clara',    location: 'Sala A',       type: 'aula',      day: 20 },
  { id:  2, title: 'Personal Training',     time: '09:00', duration: '1h',    instructor: 'Carlos Eduardo', location: 'Sala B',       type: 'personal',  day: 20 },
  { id:  3, title: 'Avaliação Física',      time: '10:30', duration: '45min', instructor: 'Fernanda Lima',  location: 'Sala C',       type: 'avaliacao', day: 20 },
  { id:  4, title: 'Pilates',               time: '15:00', duration: '1h',    instructor: 'Juliana Torres', location: 'Sala A',       type: 'aula',      day: 20 },
  { id:  5, title: 'Reunião de Equipe',     time: '17:00', duration: '30min', instructor: 'Admin',          location: 'Sala Reunião', type: 'reuniao',   day: 20 },
  { id:  6, title: 'Musculação Avançada',   time: '08:00', duration: '1h30',  instructor: 'Roberto Alves',  location: 'Sala B',       type: 'aula',      day: 21 },
  { id:  7, title: 'Yoga Flow',             time: '07:00', duration: '1h',    instructor: 'Maria Clara',    location: 'Sala A',       type: 'aula',      day: 22 },
  { id:  8, title: 'Personal Training',     time: '11:00', duration: '1h',    instructor: 'Carlos Eduardo', location: 'Sala B',       type: 'personal',  day: 22 },
  { id:  9, title: 'Avaliação Nutricional', time: '14:00', duration: '45min', instructor: 'Dra. Renata',    location: 'Sala C',       type: 'avaliacao', day: 23 },
  { id: 10, title: 'Pilates Iniciante',     time: '09:00', duration: '1h',    instructor: 'Juliana Torres', location: 'Sala A',       type: 'aula',      day: 24 },
  { id: 11, title: 'Yoga Flow',             time: '07:00', duration: '1h',    instructor: 'Maria Clara',    location: 'Sala A',       type: 'aula',      day: 25 },
  { id: 12, title: 'Reunião Comercial',     time: '16:00', duration: '1h',    instructor: 'Admin',          location: 'Sala Reunião', type: 'reuniao',   day: 25 },
];

const typeConfig = {
  aula:      { label: 'Aula',       bg: 'bg-blue-50',    text: 'text-[#1d4ed8]',  bar: '#2563eb', dot: 'bg-[#2563eb]',  accent: '#eff6ff' },
  personal:  { label: 'Personal',   bg: 'bg-violet-50',  text: 'text-violet-700', bar: '#7c3aed', dot: 'bg-violet-500', accent: '#f5f3ff' },
  avaliacao: { label: 'Avaliação',  bg: 'bg-amber-50',   text: 'text-amber-700',  bar: '#d97706', dot: 'bg-amber-400',  accent: '#fffbeb' },
  reuniao:   { label: 'Reunião',    bg: 'bg-slate-50',   text: 'text-slate-600',  bar: '#64748b', dot: 'bg-slate-400',  accent: '#f8fafc' },
};

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES  = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function buildCalendar(year: number, month: number) {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function Agenda() {
  const today = new Date();
  const [viewMonth,   setViewMonth]   = useState(today.getMonth());
  const [viewYear,    setViewYear]    = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const cells     = buildCalendar(viewYear, viewMonth);
  const eventDays = new Set(eventos.map(e => e.day));
  const dayEvents = eventos.filter(e => e.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time));

  const prevMonth = () => viewMonth === 0  ? (setViewMonth(11), setViewYear(y => y - 1)) : setViewMonth(m => m - 1);
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0),  setViewYear(y => y + 1)) : setViewMonth(m => m + 1);
  const isToday   = (day: number) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (day: number) => day === selectedDay;

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
        <div className="absolute bottom-0 right-1/3 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: '#1e3a8a', filter: 'blur(55px)', opacity: 0.18 }} />

        <div className="relative z-10 flex items-center justify-between px-6 py-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-white/40 text-[0.62rem] font-bold tracking-[0.2em] uppercase">Agenda & Aulas</span>
            </div>
            <h2 className="text-white text-[1.35rem] font-bold tracking-tight leading-none">Agenda</h2>
            <p className="text-white/40 text-[0.78rem] mt-1.5">
              {dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''} em {selectedDay} de {MONTH_NAMES[viewMonth]}
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-[0.8rem] text-white cursor-pointer border-none transition-all duration-200 active:scale-[0.98] hover:shadow-lg hover:shadow-blue-600/30"
            style={{ background: '#2563eb' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
          >
            <Plus size={14} /> Novo Evento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">

        {/* ── Calendar ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden self-start">
          {/* Month nav */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#f1f5f9]">
            <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors cursor-pointer border-none bg-transparent">
              <ChevronLeft size={15} />
            </button>
            <p className="text-[0.85rem] font-bold text-[#0f172a]">{MONTH_NAMES[viewMonth]} {viewYear}</p>
            <button onClick={nextMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors cursor-pointer border-none bg-transparent">
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAYS_OF_WEEK.map(d => (
              <div key={d} className="text-center text-[0.63rem] font-bold text-[#94a3b8] uppercase tracking-wider py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {cells.map((day, i) => (
              <div key={i} className="aspect-square flex items-center justify-center">
                {day !== null && (
                  <button
                    onClick={() => setSelectedDay(day)}
                    className={`relative w-8 h-8 rounded-full text-[0.78rem] font-medium flex flex-col items-center justify-center transition-all duration-150 cursor-pointer border-none ${
                      isSelected(day)
                        ? 'text-white font-bold shadow-sm shadow-blue-600/25'
                        : isToday(day)
                        ? 'font-bold bg-transparent'
                        : 'text-[#334155] hover:bg-[#f1f5f9] bg-transparent'
                    }`}
                    style={isSelected(day) ? { background: '#2563eb' } : isToday(day) ? { color: '#2563eb', boxShadow: '0 0 0 1.5px #2563eb' } : {}}
                  >
                    {day}
                    {eventDays.has(day) && !isSelected(day) && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2563eb] opacity-60" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-[#f1f5f9] flex flex-wrap gap-x-4 gap-y-1.5">
            {Object.entries(typeConfig).map(([, cfg]) => (
              <div key={cfg.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-[0.67rem] text-[#64748b] font-medium">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Events list ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <p className="text-[0.88rem] font-bold text-[#0f172a]">
              {isToday(selectedDay) && viewMonth === today.getMonth() ? 'Hoje' : `${selectedDay} de ${MONTH_NAMES[viewMonth]}`}
            </p>
            <p className="text-[0.7rem] text-[#94a3b8] mt-0.5">
              {dayEvents.length > 0 ? `${dayEvents.length} evento${dayEvents.length !== 1 ? 's' : ''} agendado${dayEvents.length !== 1 ? 's' : ''}` : 'Sem eventos'}
            </p>
          </div>

          {dayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mb-3">
                <Clock size={20} className="text-[#cbd5e1]" />
              </div>
              <p className="text-[0.88rem] font-bold text-[#334155]">Nenhum evento</p>
              <p className="text-[0.75rem] text-[#94a3b8] mt-1">Selecione outro dia ou crie um evento.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f8fafc]">
              {dayEvents.map(evento => {
                const cfg = typeConfig[evento.type];
                return (
                  <div
                    key={evento.id}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-[#fafbfc] transition-colors group cursor-pointer"
                  >
                    {/* Time col */}
                    <div className="text-right shrink-0 pt-0.5 min-w-[42px]">
                      <p className="text-[0.8rem] font-bold text-[#0f172a]">{evento.time}</p>
                      <p className="text-[0.67rem] text-[#94a3b8] mt-0.5">{evento.duration}</p>
                    </div>

                    {/* Colored bar */}
                    <div className="w-[3px] self-stretch rounded-full shrink-0" style={{ background: cfg.bar }} />

                    {/* Content */}
                    <div
                      className="flex-1 min-w-0 rounded-xl px-3 py-2.5 transition-colors"
                      style={{ background: cfg.accent }}
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="text-[0.87rem] font-bold text-[#0f172a]">{evento.title}</p>
                        <span className={`text-[0.63rem] font-bold px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.text} shrink-0`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-[0.72rem] text-[#475569]">
                          <User size={10} className="text-[#94a3b8]" /> {evento.instructor}
                        </span>
                        <span className="flex items-center gap-1 text-[0.72rem] text-[#94a3b8]">
                          <MapPin size={10} /> {evento.location}
                        </span>
                      </div>
                    </div>

                    {/* Edit action */}
                    <button className="opacity-0 group-hover:opacity-100 text-[0.73rem] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-all cursor-pointer border-none bg-transparent pt-1 shrink-0">
                      Editar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
