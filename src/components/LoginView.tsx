import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Tablet,
  Sparkles,
  Smartphone,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Puzzle,
} from 'lucide-react';
import { AuthUser, UserRole } from '../types/elos';
import { MOCK_AUTH_USERS } from '../data/mockData';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false);
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [recoverySent, setRecoverySent] = useState<boolean>(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!normalizedEmail || !trimmedPassword) {
      setErrorMessage(
        'Por favor, preencha o e-mail institucional/familiar e a senha para continuar.'
      );
      return;
    }

    // 1. Exact match against MOCK_AUTH_USERS
    const exactMatch = MOCK_AUTH_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === trimmedPassword
    );

    if (exactMatch) {
      const { password: _pwd, ...authUser } = exactMatch;
      onLoginSuccess(authUser);
      return;
    }

    // 2. Flexible email prefix detection if password is 'senha123'
    if (trimmedPassword === 'senha123') {
      if (normalizedEmail.includes('mediador') || normalizedEmail.includes('aee')) {
        const { password: _pwd, ...user } = MOCK_AUTH_USERS[0];
        onLoginSuccess(user);
        return;
      }
      if (normalizedEmail.includes('familia') || normalizedEmail.includes('mae') || normalizedEmail.includes('pai')) {
        const { password: _pwd, ...user } = MOCK_AUTH_USERS[1];
        onLoginSuccess(user);
        return;
      }
      if (normalizedEmail.includes('aluno') || normalizedEmail.includes('lucas')) {
        const { password: _pwd, ...user } = MOCK_AUTH_USERS[2];
        onLoginSuccess(user);
        return;
      }
    }

    // Invalid credentials feedback (using calm indigo/slate tones instead of harsh red)
    setErrorMessage(
      'Credenciais não reconhecidas. Verifique seu e-mail e senha (padrão de teste: senha123) ou utilize um dos botões de Login Rápido abaixo.'
    );
  };

  const handleQuickLogin = (role: UserRole) => {
    setErrorMessage(null);
    const target = MOCK_AUTH_USERS.find((u) => u.role === role) || MOCK_AUTH_USERS[0];
    const { password: _pwd, ...authUser } = target;
    onLoginSuccess(authUser);
  };

  const handleFillCredentials = (role: UserRole) => {
    setErrorMessage(null);
    const target = MOCK_AUTH_USERS.find((u) => u.role === role);
    if (target) {
      setEmail(target.email);
      setPassword(target.password);
    }
  };

  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;
    setRecoverySent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50/60 to-teal-50/50 flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-slate-800">
      {/* Top Accessibility & Security Bar */}
      <header className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-teal-300 flex items-center justify-center shadow-sm border border-teal-500/30">
            <Puzzle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                ELOS
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100/90 text-teal-900 border border-teal-300">
                MVP • TEA Nível 2
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ecossistema Lógico Orientado ao Suporte para Inclusão Escolar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Design Neuroafirmativo • WCAG 2.2 AA/AAA • RBAC Ativo</span>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-6xl w-full mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Value Proposition & Quick Demo Access */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-sky-900 border border-sky-200 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Tecnologia Assistiva e Tradutibilidade de Dados
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Inclusão escolar com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-sky-700">
              previsibilidade sensorial
            </span>{' '}
            e conexão humana.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            O <strong>ELOS</strong> conecta mediadores escolares, alunos neurodivergentes (TEA
            Nível 2) e suas famílias através de interfaces adaptadas ao contexto cognitivo de cada
            usuário.
          </p>

          {/* QUICK LOGIN DEMO CARDS (1-Click RBAC Redirection) */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                Acesso Rápido de Demonstração (RBAC)
              </h2>
              <span className="text-xs text-slate-500">
                Clique em um perfil para entrar direto ou preencher
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* 1. Mediador AEE */}
              <div className="rounded-2xl border-2 border-teal-200/90 bg-teal-50/50 p-4 flex flex-col justify-between hover:border-teal-400 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-3 shadow-sm">
                    <Tablet className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">1. Mediador AEE</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Foco em Tablet. Registro de travas cognitivas e disparo de suporte remoto.
                  </p>
                  <div className="mt-2.5 text-[11px] font-mono text-teal-900 bg-teal-100/80 px-2 py-1 rounded-md truncate">
                    mediador@elos.com
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('mediator')}
                    className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Entrar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillCredentials('mediator')}
                    className="min-h-[42px] px-2.5 py-2 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold transition-colors"
                    title="Preencher no formulário ao lado"
                  >
                    Preencher
                  </button>
                </div>
              </div>

              {/* 2. Aluno (Modo Kiosk) */}
              <div className="rounded-2xl border-2 border-sky-200/90 bg-sky-50/50 p-4 flex flex-col justify-between hover:border-sky-400 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-sky-300 flex items-center justify-center mb-3 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">2. Aluno (Kiosk)</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Modo foco escuro suave, pictograma AGORA → DEPOIS e timer contínuo.
                  </p>
                  <div className="mt-2.5 text-[11px] font-mono text-sky-900 bg-sky-100/80 px-2 py-1 rounded-md truncate">
                    aluno@elos.com
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student')}
                    className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Entrar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillCredentials('student')}
                    className="min-h-[42px] px-2.5 py-2 rounded-xl bg-white hover:bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold transition-colors"
                    title="Preencher no formulário ao lado"
                  >
                    Preencher
                  </button>
                </div>
              </div>

              {/* 3. Família (Mobile-First) */}
              <div className="rounded-2xl border-2 border-purple-200/90 bg-purple-50/40 p-4 flex flex-col justify-between hover:border-purple-400 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center mb-3 shadow-sm">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">3. Família</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Mobile-First. Gráfico semanal e insights traduzidos para a rotina em casa.
                  </p>
                  <div className="mt-2.5 text-[11px] font-mono text-purple-900 bg-purple-100/80 px-2 py-1 rounded-md truncate">
                    familia@elos.com
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('family')}
                    className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Entrar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillCredentials('family')}
                    className="min-h-[42px] px-2.5 py-2 rounded-xl bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 text-xs font-semibold transition-colors"
                    title="Preencher no formulário ao lado"
                  >
                    Preencher
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Accessible Login Form Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[32px] border border-slate-200/90 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  Autenticação Segura
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Entrar no Portal ELOS
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Redirecionamento automático por perfil (RBAC)
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" aria-hidden="true" />
              </div>
            </div>

            {/* Non-alarming, TEA-friendly Error Banner */}
            {errorMessage && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-5 p-4 rounded-2xl bg-indigo-50/90 border-2 border-indigo-200 text-indigo-950 text-xs sm:text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-bold block mb-0.5">Atenção aos dados de acesso</strong>
                  {errorMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5"
                >
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail
                    className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: mediador@elos.com"
                    className="w-full min-h-[50px] pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/70 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-sky-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs sm:text-sm font-bold text-slate-700"
                  >
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordOpen((prev) => !prev);
                      setRecoverySent(false);
                      setRecoveryEmail(email);
                    }}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900 underline underline-offset-2"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <div className="relative">
                  <KeyRound
                    className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha (senha123)"
                    className="w-full min-h-[50px] pl-11 pr-12 py-3 rounded-xl border border-slate-300 bg-slate-50/70 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-sky-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[54px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-700 to-sky-700 hover:from-teal-600 hover:to-sky-600 text-white font-bold text-base shadow-md flex items-center justify-center gap-2.5 transition-all"
              >
                <span>Acessar Plataforma ELOS</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Interactive "Esqueci minha senha" Drawer */}
            {forgotPasswordOpen && (
              <div className="mt-5 p-4 rounded-2xl bg-sky-50/80 border border-sky-200 text-xs sm:text-sm space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="font-bold text-slate-800">
                    Recuperação de Acesso Assistida
                  </strong>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Fechar
                  </button>
                </div>

                {recoverySent ? (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 text-teal-900 bg-teal-50 p-3 rounded-xl border border-teal-200"
                  >
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      Instruções enviadas para <strong>{recoveryEmail}</strong>! No modo de
                      demonstração, a senha padrão para todos os perfis é{' '}
                      <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-teal-200">
                        senha123
                      </code>
                      .
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordRecovery} className="space-y-2.5">
                    <p className="text-xs text-slate-600">
                      Informe seu e-mail para receber o link de redefinição ou restaurar a senha de
                      teste:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="seu-email@elos.com"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm"
                        required
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold shrink-0"
                      >
                        Enviar Link
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Credentials Cheat-Sheet Box */}
            <div className="mt-6 pt-5 border-t border-slate-200/80">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Credenciais de Teste (Mock RBAC)
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 font-mono bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <div className="flex justify-between">
                  <span>Mediador AEE:</span>
                  <strong className="text-slate-800">mediador@elos.com / senha123</strong>
                </div>
                <div className="flex justify-between">
                  <span>Família:</span>
                  <strong className="text-slate-800">familia@elos.com / senha123</strong>
                </div>
                <div className="flex justify-between">
                  <span>Aluno:</span>
                  <strong className="text-slate-800">aluno@elos.com / senha123</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500 py-3 border-t border-slate-200/60">
        <span>ELOS — Ecossistema Lógico Orientado ao Suporte (MVP)</span>
        <span className="block sm:inline mt-1 sm:mt-0 font-medium text-slate-600">
          Desenvolvido por Renan Bernardo Gonçalves — IFES Campus Alegre
        </span>
      </footer>
    </div>
  );
};

