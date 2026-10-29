import React, { useState } from 'react';
import {
  Users,
  PauseCircle,
  Send,
  CalendarClock,
  Volume2,
  Wind,
  CheckCircle2,
  Sparkles,
  Clock,
  Eye,
  HeartHandshake,
  Layers,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { Student, StimulusType, RegulationState } from '../types/elos';
import { COGNITIVE_LOCK_TRIGGERS, PRESET_STIMULI } from '../data/mockData';

interface MediatorViewProps {
  students: Student[];
  selectedStudent: Student;
  onSelectStudent: (studentId: string) => void;
  onRegisterCognitiveLock: (triggerLabel: string, subject: string) => void;
  onResolveCognitiveLock: () => void;
  onDispatchStimulus: (stimulusId: StimulusType, withAudioCue?: boolean) => void;
  onOpenStudentScreen?: () => void;
  onOpenFamilyScreen?: () => void;
  compactMode?: boolean;
}

export const MediatorView: React.FC<MediatorViewProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  onRegisterCognitiveLock,
  onResolveCognitiveLock,
  onDispatchStimulus,
  onOpenStudentScreen,
  onOpenFamilyScreen,
  compactMode = false,
}) => {
  const [selectedTriggerId, setSelectedTriggerId] = useState<string>(
    COGNITIVE_LOCK_TRIGGERS[0].id
  );
  const [lastFeedbackMessage, setLastFeedbackMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setLastFeedbackMessage(msg);
    window.setTimeout(() => {
      setLastFeedbackMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const getRegulationBadge = (state: RegulationState) => {
    switch (state) {
      case 'regulated':
        return {
          label: 'Foco Estável',
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          dot: 'bg-teal-500',
        };
      case 'sensory_alert':
        return {
          label: 'Sinal Sensorial',
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'cognitive_lock':
        return {
          label: 'Trava Cognitiva Ativa',
          bg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          dot: 'bg-indigo-600 animate-ping',
        };
    }
  };

  const handleLockClick = () => {
    const trigger =
      COGNITIVE_LOCK_TRIGGERS.find((t) => t.id === selectedTriggerId) ||
      COGNITIVE_LOCK_TRIGGERS[0];
    onRegisterCognitiveLock(trigger.label, trigger.subject);
    showToast(
      `Trava cognitiva registrada para ${selectedStudent.name} (${trigger.label}). Dispare um suporte visual abaixo.`
    );
  };

  const handleResolveClick = () => {
    onResolveCognitiveLock();
    showToast(
      `Foco recuperado! O registro foi traduzido automaticamente para o Dashboard da Família de ${selectedStudent.name}.`
    );
  };

  const handleSendSupport = (
    stimulusId: StimulusType,
    label: string,
    withAudio = false
  ) => {
    onDispatchStimulus(stimulusId, withAudio);
    showToast(`Enviado para o tablet de ${selectedStudent.name}: "${label}"`);
  };

  const currentBadge = getRegulationBadge(selectedStudent.regulationState);

  return (
    <section
      aria-label="Painel do Mediador Escolar AEE"
      className={`${compactMode ? 'p-3' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}
    >
      {/* Tablet Top Status Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">
                  Painel do Mediador AEE
                </h1>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Modo Tablet • Toque Rápido (Sala 4º Ano B)
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Intervenção silenciosa em 1 toque sem interromper a dinâmica da aula.
              </p>
            </div>
          </div>

          {/* Live Toast Feedback */}
          {lastFeedbackMessage ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-300 text-teal-900 text-sm font-medium shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span>{lastFeedbackMessage}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Tempo médio de recuperação da turma hoje:</span>
              <strong className="text-slate-700">55 segundos</strong>
            </div>
          )}
        </div>
      </div>

      <div
        className={`grid grid-cols-1 ${
          compactMode ? ' gap-5' : 'lg:grid-cols-12 gap-6'
        }`}
      >
        {/* LEFT COLUMN: Quick Student Roster (Touch-friendly cards) */}
        <div className={compactMode ? '' : 'lg:col-span-4 space-y-4'}>
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Alunos Acompanhados ({students.length})
              </h2>
              <span className="text-xs text-slate-400">Toque para selecionar</span>
            </div>

            <div className="space-y-3" role="listbox" aria-label="Lista rápida de alunos da turma">
              {students.map((student) => {
                const isSelected = student.id === selectedStudent.id;
                const badge = getRegulationBadge(student.regulationState);

                return (
                  <button
                    key={student.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => onSelectStudent(student.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 min-h-[82px] ${
                      isSelected
                        ? 'bg-sky-50/70 border-sky-500 shadow-sm ring-2 ring-sky-200/60'
                        : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0 border ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-700'
                            : 'bg-slate-200/80 text-slate-700 border-slate-300'
                        }`}
                      >
                        {student.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-base truncate">
                          {student.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {student.currentSubject}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                            {badge.label}
                          </span>
                          {student.studentSelfReport === 'too_noisy' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                              <Headphones className="w-3 h-3" /> Pediu Silêncio
                            </span>
                          )}
                          {student.studentSelfReport === 'need_help' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                              Pediu Apoio
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-slate-500">Travas hoje</div>
                      <div className="text-lg font-extrabold text-slate-700">
                        {student.focusLockCountToday}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Student Sensory Profile Summary */}
          <div className="bg-slate-100/80 rounded-2xl border border-slate-200/90 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Perfil Sensorial • {selectedStudent.name}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedStudent.sensoryProfile.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Touch-Friendly Primary Actions & Remote Stimulus Dispatcher */}
        <div className={compactMode ? 'space-y-5' : 'lg:col-span-8 space-y-6'}>
          {/* 1. PRIMARY ACTION CARD: Registrar Perda de Foco / Trava Cognitiva */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/60">
                  Ação Principal de Registro
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-1.5">
                  Monitoramento de Foco • {selectedStudent.name}
                </h2>
              </div>
              <span
                className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border self-start ${currentBadge.bg}`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${currentBadge.dot}`} />
                {currentBadge.label}
              </span>
            </div>

            {/* Context Tags before registering lock (1-tap selection) */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Contexto observado em sala (opcional — 1 toque):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COGNITIVE_LOCK_TRIGGERS.map((trigger) => {
                  const isActive = selectedTriggerId === trigger.id;
                  return (
                    <button
                      key={trigger.id}
                      type="button"
                      onClick={() => setSelectedTriggerId(trigger.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left border transition-all min-h-[48px] ${
                        isActive
                          ? 'bg-indigo-50/90 text-indigo-900 border-indigo-400 ring-1 ring-indigo-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {trigger.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Giant Touch-Friendly Action Button */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <button
                type="button"
                onClick={handleLockClick}
                className="sm:col-span-8 w-full min-h-[76px] px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-slate-700 hover:from-indigo-500 hover:to-slate-600 active:scale-[0.99] text-white font-bold text-base sm:text-lg shadow-md flex items-center justify-center gap-3.5 transition-all border border-indigo-400/30"
              >
                <PauseCircle className="w-7 h-7 text-indigo-200 shrink-0" />
                <div className="text-left">
                  <div>Registrar Perda de Foco / Trava Cognitiva</div>
                  <div className="text-xs font-normal text-indigo-100">
                    Marca o início do episódio e sugere suporte visual imediato
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleResolveClick}
                className={`sm:col-span-4 w-full min-h-[76px] px-4 py-4 rounded-2xl font-bold text-sm flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                  selectedStudent.regulationState === 'cognitive_lock'
                    ? 'bg-teal-600 hover:bg-teal-500 text-white border-teal-400 shadow-md animate-gentle-pulse'
                    : 'bg-teal-50/80 hover:bg-teal-100/80 text-teal-800 border-teal-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Foco Recuperado</span>
                </div>
                <span
                  className={`text-[11px] font-normal ${
                    selectedStudent.regulationState === 'cognitive_lock'
                      ? 'text-teal-100'
                      : 'text-teal-700'
                  }`}
                >
                  Traduz insight p/ Família
                </span>
              </button>
            </div>
          </div>

          {/* 2. REMOTE VISUAL & SENSORY SUPPORT DISPATCHER */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/80">
                  Suporte Remoto Kiosk
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-1.5">
                  Disparar Estímulo na Tela de {selectedStudent.name.split(' ')[0]}
                </h2>
              </div>
              <Send className="w-5 h-5 text-teal-600 hidden sm:block" />
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Ao tocar em um botão abaixo, a <strong>Tela Sensorial do Aluno</strong> atualiza
              instantaneamente sem pop-ups bruscos.
            </p>

            {/* Primary 2 Remote Dispatch Buttons requested in prompt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button
                type="button"
                onClick={() =>
                  handleSendSupport(
                    'reading_schedule',
                    'Cronograma Visual: Hora da Leitura',
                    false
                  )
                }
                className="min-h-[88px] p-4 rounded-2xl bg-sky-50/90 hover:bg-sky-100/90 active:scale-[0.99] border-2 border-sky-300 text-left flex items-center gap-4 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-sky-500 transition-colors">
                  <CalendarClock className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-base">
                    Enviar Cronograma Visual
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Exibe pictograma &ldquo;Hora da Leitura&rdquo; + sequência Primeiro/Depois
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSendSupport(
                    'breathing_pause',
                    'Alerta Sonoro Suave (432Hz) + Guia de Respiração',
                    true
                  )
                }
                className="min-h-[88px] p-4 rounded-2xl bg-purple-50/80 hover:bg-purple-100/80 active:scale-[0.99] border-2 border-purple-300 text-left flex items-center gap-4 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-purple-500 transition-colors">
                  <Volume2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-base">
                    Enviar Alerta Sonoro Suave
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Sinal harmônico 432Hz sem susto + círculo de respiração guiada
                  </div>
                </div>
              </button>
            </div>

            {/* Additional Quick Pedagogical Supports */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  handleSendSupport(
                    'math_blocks',
                    'Matemática em Blocos Visuais',
                    false
                  )
                }
                className="min-h-[64px] p-3.5 rounded-xl bg-teal-50/70 hover:bg-teal-100/80 border border-teal-300 text-left flex items-center gap-3 transition-all"
              >
                <Layers className="w-5 h-5 text-teal-700 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Matemática Passo a Passo
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Fragmentar em 3 grupos visuais
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSendSupport(
                    'sensory_break',
                    'Pausa Sensorial (Abafador)',
                    false
                  )
                }
                className="min-h-[64px] p-3.5 rounded-xl bg-teal-50/70 hover:bg-teal-100/80 border border-teal-300 text-left flex items-center gap-3 transition-all"
              >
                <Wind className="w-5 h-5 text-teal-700 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Sugerir Abafador / Pausa
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Reduzir carga auditiva
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSendSupport(
                    'transition_next',
                    'Aviso de Transição (3 min)',
                    false
                  )
                }
                className="min-h-[64px] p-3.5 rounded-xl bg-sky-50/70 hover:bg-sky-100/80 border border-sky-300 text-left flex items-center gap-3 transition-all"
              >
                <Clock className="w-5 h-5 text-sky-700 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Previsibilidade: Faltam 3 min
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Prepara para próxima tarefa
                  </div>
                </div>
              </button>
            </div>

            {/* Live Mirror Status Bar of Student's Screen */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 p-3.5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 text-teal-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">
                    Exibindo agora no Quiosque de{' '}
                    <strong className="text-slate-700">{selectedStudent.name}</strong> (desde{' '}
                    {selectedStudent.activeStimulus.updatedAt}):
                  </div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>{selectedStudent.activeStimulus.title}</span>
                    {selectedStudent.activeStimulus.audioCueActive && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold">
                        Som 432Hz Ativo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!compactMode && (
                <div className="flex items-center gap-2">
                  {onOpenStudentScreen && (
                    <button
                      type="button"
                      onClick={onOpenStudentScreen}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-4 h-4 text-teal-300" />
                      <span>Ver Tela do Aluno</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onOpenFamilyScreen && (
                    <button
                      type="button"
                      onClick={onOpenFamilyScreen}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 text-xs font-semibold transition-colors"
                    >
                      <HeartHandshake className="w-4 h-4 text-teal-700" />
                      <span>Ver App Família</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

