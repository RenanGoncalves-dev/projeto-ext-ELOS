import React, { useEffect } from 'react';
import { ShieldAlert, ArrowLeft, UserCheck, Lock } from 'lucide-react';
import { AuthUser, RoutePath, UserRole } from '../types/elos';

interface PrivateRouteProps {
  user: AuthUser | null;
  allowedRoles: UserRole[];
  currentPath: RoutePath;
  onNavigate: (path: RoutePath) => void;
  onSwitchRoleForDemo: (targetRole: UserRole, targetPath: RoutePath) => void;
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  user,
  allowedRoles,
  currentPath,
  onNavigate,
  onSwitchRoleForDemo,
  children,
}) => {
  // Redirect unauthenticated users to /login immediately
  useEffect(() => {
    if (!user && currentPath !== '/login') {
      onNavigate('/login');
    }
  }, [user, currentPath, onNavigate]);

  if (!user) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50"
      >
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Rota Protegida (Private Route)</h2>
          <p className="text-sm text-slate-600 mt-1">
            Redirecionando para a autenticação segura do ELOS...
          </p>
        </div>
      </div>
    );
  }

  // RBAC Verification: check if the user's role has permission for this route
  const hasPermission = allowedRoles.includes(user.role);

  if (!hasPermission) {
    const requiredRole = allowedRoles[0];
    const roleNames: Record<UserRole, string> = {
      mediator: 'Mediador AEE / Gestor',
      student: 'Aluno (Modo Kiosk)',
      family: 'Família / Responsável',
    };

    return (
      <section
        aria-label="Aviso de Controle de Acesso Baseado em Papéis (RBAC)"
        className="max-w-xl mx-auto px-4 py-12"
      >
        <div className="bg-white rounded-3xl border-2 border-indigo-200 p-6 sm:p-8 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7" aria-hidden="true" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 mb-3">
            Proteção RBAC Ativa • Rota Restrita
          </span>

          <h2 className="text-xl font-extrabold text-slate-800">
            Acesso exclusivo para o perfil: {roleNames[requiredRole]}
          </h2>

          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Você está autenticado como <strong>{user.name}</strong> ({user.roleLabel}). Por
            segurança e proteção de dados escolares (LGPD), esta rota exige credenciais de{' '}
            <strong>{roleNames[requiredRole]}</strong>.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onNavigate(user.defaultRoute)}
              className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-colors border border-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Meu Painel</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchRoleForDemo(requiredRole, currentPath)}
              className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>Alternar Perfil p/ {roleNames[requiredRole]} (Demo)</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
};

