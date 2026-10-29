import React, { useState, useEffect, useCallback } from 'react';
import {
  ViewRole,
  Student,
  TranslatedInsight,
  StimulusType,
  AuthUser,
  RoutePath,
  UserRole,
} from './types/elos';
import {
  INITIAL_STUDENTS,
  INITIAL_TRANSLATED_INSIGHTS,
  WEEKLY_ENGAGEMENT_DATA,
  PRESET_STIMULI,
  MOCK_AUTH_USERS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { PrivateRoute } from './components/PrivateRoute';
import { MediatorView } from './components/MediatorView';
import { StudentKioskView } from './components/StudentKioskView';
import { FamilyDashboardView } from './components/FamilyDashboardView';
import { playGentleSensoryChime } from './utils/sound';

const ROUTE_TO_VIEW_ROLE: Record<Exclude<RoutePath, '/login'>, ViewRole> = {
  '/mediador': 'mediator',
  '/aluno': 'student',
  '/familia': 'family',
  '/sincronizado': 'split',
};

const VIEW_ROLE_TO_ROUTE: Record<ViewRole, Exclude<RoutePath, '/login'>> = {
  mediator: '/mediador',
  student: '/aluno',
  family: '/familia',
  split: '/sincronizado',
};

function resolveInitialRoute(): RoutePath {
  const path = window.location.pathname.toLowerCase();
  if (path === '/mediador') return '/mediador';
  if (path === '/aluno') return '/aluno';
  if (path === '/familia') return '/familia';
  if (path === '/sincronizado') return '/sincronizado';
  return '/login';
}

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentPath, setCurrentPath] = useState<RoutePath>(resolveInitialRoute);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    INITIAL_STUDENTS[0].id
  );
  const [insights, setInsights] = useState<TranslatedInsight[]>(
    INITIAL_TRANSLATED_INSIGHTS
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [liveSyncPulse, setLiveSyncPulse] = useState<boolean>(false);
  const [lastTriggerContext, setLastTriggerContext] = useState<{
    label: string;
    subject: string;
  }>({
    label: 'Abstração em Matemática',
    subject: 'Matemática',
  });

  const navigate = useCallback((path: RoutePath) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // Fallback if running in restricted iframe
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(resolveInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  const triggerSyncPulse = () => {
    setLiveSyncPulse(true);
    window.setTimeout(() => setLiveSyncPulse(false), 3000);
  };

  const getCurrentTimeFormatted = () => {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Authentication & Logout Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    navigate(user.defaultRoute);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const handleSwitchRoleForDemo = (targetRole: UserRole, targetPath: RoutePath) => {
    const found = MOCK_AUTH_USERS.find((u) => u.role === targetRole);
    if (found) {
      const { password: _pwd, ...authUser } = found;
      setCurrentUser(authUser);
      navigate(targetPath);
    }
  };

  // 1. Mediator registers a Cognitive Lock / Loss of Focus
  const handleRegisterCognitiveLock = (triggerLabel: string, subject: string) => {
    setLastTriggerContext({ label: triggerLabel, subject });
    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === selectedStudent.id
          ? {
              ...stu,
              regulationState: 'cognitive_lock',
              focusLockCountToday: stu.focusLockCountToday + 1,
            }
          : stu
      )
    );
    triggerSyncPulse();
  };

  // 2. Mediator dispatches a Remote Visual or Auditory Support to the Student's Kiosk
  const handleDispatchStimulus = (
    stimulusId: StimulusType,
    withAudioCue = false
  ) => {
    const preset = PRESET_STIMULI[stimulusId];
    const timeStr = getCurrentTimeFormatted();

    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === selectedStudent.id
          ? {
              ...stu,
              regulationState:
                stu.regulationState === 'cognitive_lock'
                  ? 'sensory_alert'
                  : stu.regulationState,
              activeStimulus: {
                ...preset,
                audioCueActive: withAudioCue || preset.audioCueActive,
                audioCueLabel: withAudioCue
                  ? 'Alerta Sonoro Suave (432Hz) + Guia Visual'
                  : preset.audioCueLabel,
                updatedAt: timeStr,
              },
            }
          : stu
      )
    );

    if (soundEnabled) {
      playGentleSensoryChime(withAudioCue ? 'breath' : 'chime');
    }
    triggerSyncPulse();
  };

  // 3. Mediator confirms Focus Recovered -> Generates Translated Insight for Family Dashboard
  const handleResolveCognitiveLock = () => {
    const timeStr = getCurrentTimeFormatted();
    const studentFirstName = selectedStudent.name.split(' ')[0];
    const activeTitle = selectedStudent.activeStimulus.title;
    const totalLocks = Math.max(1, selectedStudent.focusLockCountToday);

    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === selectedStudent.id
          ? {
              ...stu,
              regulationState: 'regulated',
              studentSelfReport: 'calm',
            }
          : stu
      )
    );

    const newInsight: TranslatedInsight = {
      id: `ins-${Date.now()}`,
      studentId: selectedStudent.id,
      timestamp: `Agora mesmo (${timeStr})`,
      subject: lastTriggerContext.subject,
      triggerTag: lastTriggerContext.label,
      supportUsed: activeTitle,
      recoverySeconds: 55,
      technicalRawLog: `[AEE-LOG #${Math.floor(
        410 + Math.random() * 80
      )}] Episódio de trava cognitiva associado a "${
        lastTriggerContext.label
      }". Aplicado suporte remoto "${activeTitle}" no modo quiosque. Retorno ao engajamento funcional em 55s.`,
      translatedSummary: `Hoje ${studentFirstName} teve ${totalLocks} ${
        totalLocks === 1 ? 'trava cognitiva' : 'travas cognitivas'
      } durante ${lastTriggerContext.subject.toLowerCase()}. O suporte visual "${activeTitle}" ajudou a recuperar o foco em cerca de 1 minuto.`,
      homeTip:
        'Dica para casa: mantenha uma rotina visual previsível ("Primeiro -> Depois") para as tarefas de casa hoje e evite estímulos sonoros simultâneos.',
      acknowledgedByFamily: false,
    };

    setInsights((prev) => [newInsight, ...prev]);

    if (soundEnabled) {
      playGentleSensoryChime('confirm');
    }
    triggerSyncPulse();
  };

  // Student interactions from Kiosk View
  const handleUpdateElapsedMinutes = (newElapsed: number) => {
    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === selectedStudent.id
          ? {
              ...stu,
              activeStimulus: {
                ...stu.activeStimulus,
                elapsedMinutes: newElapsed,
              },
            }
          : stu
      )
    );
  };

  const handleStudentSelfReport = (
    status: 'calm' | 'need_help' | 'too_noisy'
  ) => {
    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === selectedStudent.id
          ? {
              ...stu,
              studentSelfReport: status,
              regulationState:
                status === 'calm' ? 'regulated' : 'sensory_alert',
            }
          : stu
      )
    );
    triggerSyncPulse();
  };

  // Family interactions
  const handleAcknowledgeInsight = (insightId: string) => {
    setInsights((prev) =>
      prev.map((item) =>
        item.id === insightId
          ? { ...item, acknowledgedByFamily: !item.acknowledgedByFamily }
          : item
      )
    );
  };

  const handleSendFamilyNote = (note: string) => {
    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === selectedStudent.id
          ? {
              ...stu,
              sensoryProfile: [
                ...stu.sensoryProfile.slice(0, 2),
                `Nota da Família: ${note}`,
              ],
            }
          : stu
      )
    );
    triggerSyncPulse();
  };

  // Public Route: Login View
  if (currentPath === '/login' || !currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const activeViewRole: ViewRole = ROUTE_TO_VIEW_ROLE[currentPath] || 'mediator';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        activeRole={activeViewRole}
        onSelectRole={(role) => navigate(VIEW_ROLE_TO_ROUTE[role])}
        selectedStudent={selectedStudent}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        liveSyncPulse={liveSyncPulse}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentPath === '/mediador' && (
          <PrivateRoute
            user={currentUser}
            allowedRoles={['mediator']}
            currentPath={currentPath}
            onNavigate={navigate}
            onSwitchRoleForDemo={handleSwitchRoleForDemo}
          >
            <MediatorView
              students={students}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudentId}
              onRegisterCognitiveLock={handleRegisterCognitiveLock}
              onResolveCognitiveLock={handleResolveCognitiveLock}
              onDispatchStimulus={handleDispatchStimulus}
              onOpenStudentScreen={() => navigate('/aluno')}
              onOpenFamilyScreen={() => navigate('/familia')}
            />
          </PrivateRoute>
        )}

        {currentPath === '/aluno' && (
          <PrivateRoute
            user={currentUser}
            allowedRoles={['student', 'mediator']}
            currentPath={currentPath}
            onNavigate={navigate}
            onSwitchRoleForDemo={handleSwitchRoleForDemo}
          >
            <StudentKioskView
              student={selectedStudent}
              onUpdateElapsedMinutes={handleUpdateElapsedMinutes}
              onStudentSelfReport={handleStudentSelfReport}
              onSwitchStimulusPreview={(stimId) =>
                handleDispatchStimulus(stimId, stimId === 'breathing_pause')
              }
              soundEnabled={soundEnabled}
            />
          </PrivateRoute>
        )}

        {currentPath === '/familia' && (
          <PrivateRoute
            user={currentUser}
            allowedRoles={['family', 'mediator']}
            currentPath={currentPath}
            onNavigate={navigate}
            onSwitchRoleForDemo={handleSwitchRoleForDemo}
          >
            <FamilyDashboardView
              student={selectedStudent}
              insights={insights}
              weeklyData={WEEKLY_ENGAGEMENT_DATA}
              onAcknowledgeInsight={handleAcknowledgeInsight}
              onSendFamilyNote={handleSendFamilyNote}
            />
          </PrivateRoute>
        )}

        {currentPath === '/sincronizado' && (
          <PrivateRoute
            user={currentUser}
            allowedRoles={['mediator']}
            currentPath={currentPath}
            onNavigate={navigate}
            onSwitchRoleForDemo={handleSwitchRoleForDemo}
          >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
              <div className="mb-4 bg-sky-50 border border-sky-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-sky-900">
                <div>
                  <strong>Modo de Demonstração Sincronizada:</strong> Teste clicar em{' '}
                  <em>&ldquo;Enviar Cronograma Visual&rdquo;</em> ou{' '}
                  <em>&ldquo;Enviar Alerta Sonoro Suave&rdquo;</em> no Tablet do Mediador (esquerda)
                  e veja a Tela Sensorial do Aluno (direita) reagir em tempo real.
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/familia')}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-colors"
                >
                  Ir para Dashboard da Família →
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-7 bg-slate-100/80 rounded-3xl border border-slate-200 p-2">
                  <MediatorView
                    students={students}
                    selectedStudent={selectedStudent}
                    onSelectStudent={setSelectedStudentId}
                    onRegisterCognitiveLock={handleRegisterCognitiveLock}
                    onResolveCognitiveLock={handleResolveCognitiveLock}
                    onDispatchStimulus={handleDispatchStimulus}
                    compactMode
                  />
                </div>

                <div className="xl:col-span-5">
                  <StudentKioskView
                    student={selectedStudent}
                    onUpdateElapsedMinutes={handleUpdateElapsedMinutes}
                    onStudentSelfReport={handleStudentSelfReport}
                    soundEnabled={soundEnabled}
                    compactMode
                  />
                </div>
              </div>
            </div>
          </PrivateRoute>
        )}
      </main>
    </div>
  );
}

export default App;
