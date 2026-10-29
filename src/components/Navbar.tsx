import React from 'react';
import {
  Tablet,
  Sparkles,
  Smartphone,
  Columns,
  ShieldCheck,
  Volume2,
  VolumeX,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { ViewRole, Student, AuthUser } from '../types/elos';

interface NavbarProps {
  activeRole: ViewRole;
  onSelectRole: (role: ViewRole) => void;
  selectedStudent: Student;
  soundEnabled: boolean;
  onToggleSound: () => void;
  liveSyncPulse: boolean;
  currentUser: AuthUser;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onSelectRole,
  selectedStudent,
  soundEnabled,
  onToggleSound,
  liveSyncPulse,
  currentUser,
  onLogout,
}) => {
  const navItems: {
    id: ViewRole;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'mediator',
      label: '1. Mediador AEE',
      sublabel: 'Foco em Tablet',
      icon: <Tablet className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'student',
      label: '2. Tela Sensorial do Aluno',
      sublabel: 'Modo Foco / Kiosk',
      icon: <Sparkles className="w-5 h-5" aria-hidden="true" />,
      badge: selectedStudent.activeStimulus.audioCueActive ? 'Estímulo Ativo' : undefined,
    },
    {
      id: 'family',
      label: '3. Dashboard da Família',
      sublabel: 'Mobile-First',
      icon: <Smartphone className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'split',
      label: 'Visão Sincronizada',
      sublabel: 'Mediador + Aluno',
      icon: <Columns className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  return (
    <header
      className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-sm"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 gap-3">
          {/* Brand & Authenticated User RBAC Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/30 to-sky-500/30 border border-teal-400/40 flex items-center justify-center shadow-inner shrink-0">
                <span className="font-extrabold text-lg tracking-tight text-teal-300">EL</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-white">
                    ELOS
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-teal-950/90 text-teal-300 border border-teal-700/60 font-medium">
                    <UserCheck className="w-3.5 h-3.5" />
                    {currentUser.roleLabel}
                  </span>
                  {liveSyncPulse && (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-sky-900/80 text-sky-200 border border-sky-600/60 animate-pulse"
                      role="status"
                      aria-live="polite"
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Sincronizado em Tempo Real
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Logado como <strong className="text-slate-200">{currentUser.name}</strong> •
                  Aluno em foco:{' '}
                  <strong className="text-teal-300">{selectedStudent.name}</strong>
                </p>
              </div>
            </div>

            {/* Mobile Sound & Logout Buttons */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleSound}
                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                aria-pressed={soundEnabled}
                title="Ativar ou silenciar feedback sonoro suave (432Hz)"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-teal-300" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                title="Encerrar sessão e voltar à Tela de Login"
              >
                <LogOut className="w-4 h-4 text-sky-300" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Profile Switcher Tabs (Simulated Routes) */}
          <nav
            aria-label="Navegação entre rotas protegidas do protótipo ELOS"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0"
          >
            {navItems.map((item) => {
              const isActive = activeRole === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectRole(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all whitespace-nowrap border ${
                    isActive
                      ? 'bg-teal-900/50 text-white border-teal-500/70 shadow-sm'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-300'
                        : 'bg-slate-700/60 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold leading-tight flex items-center gap-1.5">
                      {item.label}
                      {item.badge && (
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      {item.sublabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Desktop Sound, Accessibility & Logout Controls */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              aria-pressed={soundEnabled}
              title="Ativar ou silenciar som harmônico suave ao disparar alertas"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-teal-300" />
                  <span>Áudio 432Hz</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Silenciado</span>
                </>
              )}
            </button>

            <div
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-400 text-xs"
              title="Paleta de baixa excitação sensorial sem vermelhos ou amarelos vibrantes"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>WCAG AAA</span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-600 transition-colors shadow-sm"
              title="Encerrar sessão atual e voltar para a Tela de Login Segura"
            >
              <LogOut className="w-4 h-4 text-sky-300" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
