import React, { useState } from 'react';
import {
  HeartHandshake,
  TrendingUp,
  Sparkles,
  Home,
  CheckCircle2,
  Eye,
  EyeOff,
  Smartphone,
  Maximize2,
  Clock,
  MessageSquareHeart,
  Send,
} from 'lucide-react';
import { Student, TranslatedInsight, DailyEngagement } from '../types/elos';

interface FamilyDashboardViewProps {
  student: Student;
  insights: TranslatedInsight[];
  weeklyData: DailyEngagement[];
  onAcknowledgeInsight: (insightId: string) => void;
  onSendFamilyNote: (note: string) => void;
}

export const FamilyDashboardView: React.FC<FamilyDashboardViewProps> = ({
  student,
  insights,
  weeklyData,
  onAcknowledgeInsight,
  onSendFamilyNote,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(
    weeklyData.length - 1
  );
  const [showTechnicalJargonIds, setShowTechnicalJargonIds] = useState<
    Record<string, boolean>
  >({});
  const [mobileFramePreview, setMobileFramePreview] = useState<boolean>(true);
  const [familyNote, setFamilyNote] = useState('');
  const [noteSentSuccess, setNoteSentSuccess] = useState(false);

  const toggleJargon = (id: string) => {
    setShowTechnicalJargonIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const weeklyAverage = Math.round(
    weeklyData.reduce((acc, item) => acc + item.engagementPercent, 0) /
      weeklyData.length
  );

  const selectedDay = weeklyData[selectedDayIndex] || weeklyData[weeklyData.length - 1];

  // SVG Circular Gauge math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (weeklyAverage / 100) * circumference;

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyNote.trim()) return;
    onSendFamilyNote(familyNote.trim());
    setFamilyNote('');
    setNoteSentSuccess(true);
    window.setTimeout(() => setNoteSentSuccess(false), 4000);
  };

  return (
    <section
      aria-label="Dashboard da Família Mobile-First"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Top Explainer Banner & Mobile Frame Toggle */}
      <div className="max-w-3xl mx-auto mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-teal-50/80 border border-teal-200/80 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">
              Ponte Escola-Casa • Tradutibilidade de Dados
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Converte métricas do AEE em orientações acolhedoras, visuais e práticas para a família.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileFramePreview((prev) => !prev)}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-sm shrink-0 transition-colors"
        >
          {mobileFramePreview ? (
            <>
              <Maximize2 className="w-4 h-4 text-teal-600" />
              <span>Expandir Largura</span>
            </>
          ) : (
            <>
              <Smartphone className="w-4 h-4 text-teal-600" />
              <span>Simular Tela Celular</span>
            </>
          )}
        </button>
      </div>

      {/* MOBILE-FIRST CONTAINER */}
      <div
        className={`mx-auto transition-all duration-300 ${
          mobileFramePreview
            ? 'max-w-[440px] bg-white rounded-[36px] border-[6px] border-slate-800 shadow-2xl overflow-hidden'
            : 'max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden'
        }`}
      >
        {/* Smartphone Status Notch (when in Mobile Frame mode) */}
        {mobileFramePreview && (
          <div className="bg-slate-900 text-slate-300 px-6 py-2 flex items-center justify-between text-[11px] font-medium">
            <span>12:55</span>
            <div className="w-20 h-3.5 rounded-full bg-slate-800 border border-slate-700" />
            <span>5G • 94%</span>
          </div>
        )}

        {/* Welcoming App Header */}
        <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-sky-700 text-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-teal-100 uppercase tracking-wider">
                Diário Acolhedor ELOS
              </span>
              <h2 className="text-xl font-extrabold mt-0.5">
                Dia do {student.name.split(' ')[0]}
              </h2>
              <p className="text-xs text-teal-100 mt-0.5">{student.grade}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center font-extrabold text-lg">
              {student.avatarInitials}
            </div>
          </div>

          <div className="mt-4 bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-teal-200 shrink-0" />
            <p className="text-xs sm:text-sm text-white leading-snug">
              <strong>Resumo de hoje:</strong> {student.name.split(' ')[0]} respondeu muito bem aos
              apoios visuais e manteve média de recuperação em{' '}
              <strong>{student.avgRecoveryTimeSeconds} segundos</strong>.
            </p>
          </div>
        </div>

        {/* App Body Content */}
        <div className="p-4 sm:p-5 space-y-6 bg-slate-50/70">
          {/* 1. CHART CARD: Nível de Engajamento da Semana (Circular + Bar Chart) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-800">
                  Nível de Engajamento da Semana
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                +6% vs. sem. passada
              </span>
            </div>

            {/* Circular Gauge + Weekly Summary */}
            <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 mb-5">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-slate-200"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-teal-500 transition-all duration-700"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold text-slate-800">
                    {weeklyAverage}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Média
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Ritmo Constante e Previsível
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  O uso do cronograma visual reduziu o tempo das travas cognitivas para menos de{' '}
                  <strong>1 minuto</strong>.
                </p>
              </div>
            </div>

            {/* Interactive Bar Chart per Day */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Evolução diária (toque na barra):</span>
                <strong className="text-slate-700">{selectedDay.dayFull}</strong>
              </div>

              <div
                className="grid grid-cols-5 gap-2.5 items-end h-32 pt-4 px-2 bg-slate-50/70 rounded-xl border border-slate-100"
                role="list"
                aria-label="Gráfico de barras de engajamento semanal"
              >
                {weeklyData.map((day, idx) => {
                  const isSelected = idx === selectedDayIndex;
                  return (
                    <button
                      key={day.dayShort}
                      type="button"
                      onClick={() => setSelectedDayIndex(idx)}
                      className="flex flex-col items-center justify-end h-full group focus:outline-none"
                      aria-label={`${day.dayFull}: ${day.engagementPercent}% de engajamento`}
                    >
                      <span
                        className={`text-[11px] font-bold mb-1 ${
                          isSelected ? 'text-teal-700' : 'text-slate-500'
                        }`}
                      >
                        {day.engagementPercent}%
                      </span>
                      <div className="w-full max-w-[38px] bg-slate-200/70 rounded-t-xl h-20 flex items-end overflow-hidden p-0.5">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            isSelected
                              ? 'bg-gradient-to-t from-teal-600 to-sky-400 shadow-sm'
                              : 'bg-teal-400/60 group-hover:bg-teal-500/70'
                          }`}
                          style={{ height: `${day.engagementPercent}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold mt-1.5 pb-1 ${
                          isSelected
                            ? 'text-teal-800 underline decoration-teal-500 decoration-2 underline-offset-4'
                            : 'text-slate-500'
                        }`}
                      >
                        {day.dayShort}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Highlight Pill */}
              <div className="mt-3 p-3 rounded-xl bg-sky-50/90 border border-sky-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">{selectedDay.dayFull}:</strong>{' '}
                  {selectedDay.highlight} ({selectedDay.regulatedHours}h em foco tranquilo).
                </div>
              </div>
            </div>
          </div>

          {/* 2. TRANSLATED INSIGHTS CARDS ("Tradutibilidade de Dados") */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <span>Insights Traduzidos de Hoje</span>
              </h3>
              <span className="text-xs text-slate-500">
                {insights.length} orientações
              </span>
            </div>

            {insights.map((insight, index) => {
              const showJargon = !!showTechnicalJargonIds[insight.id];
              return (
                <article
                  key={insight.id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all bg-white shadow-sm ${
                    index === 0
                      ? 'border-teal-300 ring-1 ring-teal-200/70'
                      : 'border-slate-200/90'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
                      {insight.subject}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {insight.timestamp}
                    </span>
                  </div>

                  {/* Translated Empathetic Summary */}
                  <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
                    {insight.translatedSummary}
                  </p>

                  {/* Practical Home Guidance Box */}
                  <div className="mt-3.5 p-3.5 rounded-xl bg-teal-50/90 border border-teal-200/90 flex items-start gap-3">
                    <Home className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-teal-950 font-semibold leading-relaxed">
                      {insight.homeTip}
                    </p>
                  </div>

                  {/* Toggle to compare Technical Pedagogical Jargon vs Family Translation */}
                  {showJargon && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-mono leading-relaxed">
                      <div className="font-sans font-bold text-slate-700 mb-1">
                        Registro Técnico Original (Traduzido pelo ELOS):
                      </div>
                      {insight.technicalRawLog}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleJargon(insight.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {showJargon ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Ocultar jargão técnico</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver registro técnico original</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onAcknowledgeInsight(insight.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        insight.acknowledgedByFamily
                          ? 'bg-teal-100/80 text-teal-800 border border-teal-300'
                          : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>
                        {insight.acknowledgedByFamily
                          ? 'Dica anotada pela família'
                          : 'Vou aplicar hoje em casa'}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* 3. QUICK FAMILY -> MEDIATOR RETURN NOTE */}
          <form
            onSubmit={handleNoteSubmit}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareHeart className="w-4 h-4 text-teal-600" />
              <label
                htmlFor="family-note-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Recado Rápido da Família para o Mediador
              </label>
            </div>
            <div className="flex gap-2">
              <input
                id="family-note-input"
                type="text"
                value={familyNote}
                onChange={(e) => setFamilyNote(e.target.value)}
                placeholder="Ex: Dormiu bem hoje / Sensível a barulho..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
            {noteSentSuccess && (
              <p
                role="status"
                className="text-xs text-teal-700 font-medium mt-2 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Recado enviado para o tablet do Mediador AEE!
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

