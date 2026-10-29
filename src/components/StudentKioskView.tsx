import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Blocks,
  Wind,
  Headphones,
  Clock,
  Check,
  Volume2,
  Smile,
  HandHelping,
  EarOff,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Student, StimulusType } from '../types/elos';
import { playGentleSensoryChime } from '../utils/sound';

interface StudentKioskViewProps {
  student: Student;
  onUpdateElapsedMinutes: (newElapsed: number) => void;
  onStudentSelfReport: (status: 'calm' | 'need_help' | 'too_noisy') => void;
  onSwitchStimulusPreview?: (stimulusId: StimulusType) => void;
  soundEnabled: boolean;
  compactMode?: boolean;
}

export const StudentKioskView: React.FC<StudentKioskViewProps> = ({
  student,
  onUpdateElapsedMinutes,
  onStudentSelfReport,
  onSwitchStimulusPreview,
  soundEnabled,
  compactMode = false,
}) => {
  const { activeStimulus } = student;
  const [stepCompleted, setStepCompleted] = useState(false);

  // Reset step completion state when mediator sends a new stimulus
  useEffect(() => {
    setStepCompleted(false);
  }, [activeStimulus.id, activeStimulus.updatedAt]);

  const progressPercent = Math.min(
    100,
    Math.round((activeStimulus.elapsedMinutes / activeStimulus.durationMinutes) * 100)
  );
  const remainingMinutes = Math.max(
    0,
    activeStimulus.durationMinutes - activeStimulus.elapsedMinutes
  );

  const renderCentralPictogram = (id: StimulusType) => {
    switch (id) {
      case 'reading_schedule':
        return <BookOpen className="w-20 h-20 sm:w-24 sm:h-24 text-sky-300 stroke-[1.75]" />;
      case 'math_blocks':
        return <Blocks className="w-20 h-20 sm:w-24 sm:h-24 text-teal-300 stroke-[1.75]" />;
      case 'breathing_pause':
        return <Wind className="w-20 h-20 sm:w-24 sm:h-24 text-purple-300 stroke-[1.75]" />;
      case 'sensory_break':
        return <Headphones className="w-20 h-20 sm:w-24 sm:h-24 text-teal-300 stroke-[1.75]" />;
      case 'transition_next':
        return <Clock className="w-20 h-20 sm:w-24 sm:h-24 text-sky-300 stroke-[1.75]" />;
    }
  };

  const themeAccentClasses = {
    sky: {
      ring: 'border-sky-400/30 bg-sky-950/40',
      iconBg: 'bg-sky-900/50 border-sky-400/40',
      barFill: 'bg-gradient-to-r from-sky-400/80 to-teal-300/80',
      pill: 'bg-sky-900/60 text-sky-200 border-sky-500/40',
    },
    sage: {
      ring: 'border-teal-400/30 bg-teal-950/40',
      iconBg: 'bg-teal-900/50 border-teal-400/40',
      barFill: 'bg-gradient-to-r from-teal-400/80 to-sky-300/80',
      pill: 'bg-teal-900/60 text-teal-200 border-teal-500/40',
    },
    lavender: {
      ring: 'border-purple-400/30 bg-purple-950/40',
      iconBg: 'bg-purple-900/50 border-purple-400/40',
      barFill: 'bg-gradient-to-r from-purple-400/80 to-sky-300/80',
      pill: 'bg-purple-900/60 text-purple-200 border-purple-500/40',
    },
  }[activeStimulus.themeColor];

  const handleCompleteStep = () => {
    setStepCompleted(true);
    onUpdateElapsedMinutes(activeStimulus.durationMinutes);
    if (soundEnabled) {
      playGentleSensoryChime('confirm');
    }
  };

  return (
    <section
      aria-label="Tela Sensorial do Aluno em Modo Quiosque"
      className={`min-h-[calc(100vh-76px)] bg-elos-kioskBg text-slate-100 flex flex-col justify-between transition-colors duration-700 ${
        compactMode ? 'p-4 rounded-3xl min-h-[680px]' : 'px-4 sm:px-8 py-6 sm:py-8'
      }`}
    >
      {/* Top Minimalist Kiosk Bar (Low Visual Noise) */}
      <div className="max-w-4xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center font-bold text-teal-300">
            {student.avatarInitials}
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-slate-400 block">
              Modo Foco Sensorial • Sem Distrações
            </span>
            <h1 className="text-base sm:text-lg font-bold text-slate-200">
              Olá, {student.name.split(' ')[0]}
            </h1>
          </div>
        </div>

        {/* Optional quick simulator pills so evaluator can test stimuli directly inside Student View too */}
        {onSwitchStimulusPreview && (
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2 hidden sm:inline">
              Simular recepção:
            </span>
            <button
              type="button"
              onClick={() => onSwitchStimulusPreview('reading_schedule')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeStimulus.id === 'reading_schedule'
                  ? 'bg-sky-800/80 text-sky-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Leitura
            </button>
            <button
              type="button"
              onClick={() => onSwitchStimulusPreview('math_blocks')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeStimulus.id === 'math_blocks'
                  ? 'bg-teal-800/80 text-teal-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Matemática
            </button>
            <button
              type="button"
              onClick={() => onSwitchStimulusPreview('breathing_pause')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeStimulus.id === 'breathing_pause'
                  ? 'bg-purple-800/80 text-purple-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Respirar (432Hz)
            </button>
          </div>
        )}
      </div>

      {/* CENTRAL HIGH-PREDICTABILITY PICTOGRAM CARD */}
      <div className="max-w-3xl w-full mx-auto my-auto py-6">
        <div
          className={`rounded-[32px] bg-elos-kioskCard border-2 ${themeAccentClasses.ring} p-6 sm:p-10 shadow-2xl transition-all duration-700`}
        >
          {/* Gentle Audio Cue Indicator (if dispatched by mediator) */}
          {activeStimulus.audioCueActive && (
            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={() => playGentleSensoryChime('breath')}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-purple-900/60 border border-purple-400/40 text-purple-200 text-xs sm:text-sm font-medium animate-gentle-pulse"
              >
                <Volume2 className="w-4 h-4 text-purple-300" />
                <span>{activeStimulus.audioCueLabel || 'Alerta Sonoro Suave Recebido'}</span>
                <span className="underline text-purple-300 ml-1">(Ouvir tom suave)</span>
              </button>
            </div>
          )}

          {/* Central Giant Pictogram Container */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-[36px] border-2 ${themeAccentClasses.iconBg} flex items-center justify-center mb-6 shadow-inner animate-gentle-pulse`}
              role="img"
              aria-label={`Pictograma central: ${activeStimulus.title}`}
            >
              {renderCentralPictogram(activeStimulus.id)}
            </div>

            <span
              className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border mb-3 ${themeAccentClasses.pill}`}
            >
              {activeStimulus.category === 'cronograma'
                ? 'Atividade Atual'
                : activeStimulus.category === 'autorregulacao'
                ? 'Momento de Calma'
                : 'Aviso de Transição'}
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {activeStimulus.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 mt-2 max-w-xl leading-relaxed">
              {activeStimulus.subtitle}
            </p>
          </div>

          {/* FIRST -> THEN (AGORA -> DEPOIS) High-Predictability Sequence */}
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center mt-8 bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-slate-700/70">
            <div className="sm:col-span-5 bg-slate-800/90 p-4 rounded-xl border border-teal-500/40 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block">
                AGORA (Passo 1)
              </span>
              <p className="text-base sm:text-lg font-bold text-white mt-1">
                {activeStimulus.currentStepLabel}
              </p>
            </div>

            <div className="sm:col-span-1 flex justify-center text-slate-400">
              <ArrowRight className="w-6 h-6 rotate-90 sm:rotate-0" aria-hidden="true" />
            </div>

            <div className="sm:col-span-5 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 text-left opacity-85">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 block">
                DEPOIS (Previsível)
              </span>
              <p className="text-base sm:text-lg font-semibold text-slate-200 mt-1">
                {activeStimulus.nextStepLabel}
              </p>
            </div>
          </div>

          {/* VISUAL TIME PROGRESS BAR (No ticking seconds to prevent anxiety) */}
          <div className="mt-8">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 mb-2.5">
              <span className="font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-300" />
                Barra Visual de Tempo
              </span>
              <span className="font-bold text-teal-300">
                {stepCompleted
                  ? 'Concluído com sucesso!'
                  : `Faltam ${remainingMinutes} min de ${activeStimulus.durationMinutes} min`}
              </span>
            </div>

            <div
              className="w-full h-6 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-1"
              role="progressbar"
              aria-valuenow={stepCompleted ? 100 : progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso de tempo da atividade atual"
            >
              <div
                className={`h-full rounded-full transition-all duration-700 ${themeAccentClasses.barFill}`}
                style={{ width: `${stepCompleted ? 100 : progressPercent}%` }}
              />
            </div>

            {/* Interactive Time Slider & Step Completion Button */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Ajustar tempo simulado:</span>
                {[3, Math.round(activeStimulus.durationMinutes / 2), activeStimulus.durationMinutes].map(
                  (minVal, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setStepCompleted(minVal >= activeStimulus.durationMinutes);
                        onUpdateElapsedMinutes(minVal);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      {minVal} min
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={handleCompleteStep}
                className={`w-full sm:w-auto min-h-[54px] px-6 py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all ${
                  stepCompleted
                    ? 'bg-teal-600/30 text-teal-200 border-2 border-teal-400/60'
                    : 'bg-teal-600 hover:bg-teal-500 text-slate-950 shadow-lg'
                }`}
              >
                {stepCompleted ? (
                  <>
                    <Sparkles className="w-5 h-5 text-teal-300" />
                    <span>Muito bem! Passo concluído</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 stroke-[2.5]" />
                    <span>Terminei este passo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SELF-ADVOCACY CAA BAR (3 Simple Touch Pictograms for the Student) */}
      <div className="max-w-3xl w-full mx-auto pt-2">
        <p className="text-center text-xs uppercase tracking-wider text-slate-400 mb-2.5">
          Como você está se sentindo agora? (Toque para avisar o mediador)
        </p>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onStudentSelfReport('calm')}
            aria-pressed={student.studentSelfReport === 'calm'}
            className={`min-h-[64px] p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-center gap-2.5 transition-all ${
              student.studentSelfReport === 'calm'
                ? 'bg-teal-900/60 border-teal-400 text-teal-100'
                : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <Smile className="w-6 h-6 text-teal-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">Estou Bem</span>
          </button>

          <button
            type="button"
            onClick={() => onStudentSelfReport('need_help')}
            aria-pressed={student.studentSelfReport === 'need_help'}
            className={`min-h-[64px] p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-center gap-2.5 transition-all ${
              student.studentSelfReport === 'need_help'
                ? 'bg-sky-900/60 border-sky-400 text-sky-100'
                : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <HandHelping className="w-6 h-6 text-sky-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">Preciso de Ajuda</span>
          </button>

          <button
            type="button"
            onClick={() => onStudentSelfReport('too_noisy')}
            aria-pressed={student.studentSelfReport === 'too_noisy'}
            className={`min-h-[64px] p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-center gap-2.5 transition-all ${
              student.studentSelfReport === 'too_noisy'
                ? 'bg-purple-900/60 border-purple-400 text-purple-100'
                : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <EarOff className="w-6 h-6 text-purple-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">Muito Barulho</span>
          </button>
        </div>
      </div>
    </section>
  );
};

