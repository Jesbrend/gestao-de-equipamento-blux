import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../schemas/authSchemas';
import { useForgotPassword } from '../../hooks/useAuth';
import { toast, ToastContainer } from '../../components/ui/Toast';

const LeftPanel = () => (
  <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden border-r border-[#1a2744]">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[440, 340, 240, 140, 80].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full border border-cyan-500/10"
          style={{ width: size, height: size, opacity: 1 - i * 0.12 }}
        />
      ))}
    </div>
    <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/25 mb-5">
        <svg className="h-7 w-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Blux</h1>
      <p className="text-sm text-slate-400 leading-relaxed">
        Gestão inteligente de equipamentos. Controle, organize e gere relatórios.
      </p>
      <div className="mt-6 flex items-center gap-2 rounded-full border border-[#1a2744] bg-[#0d1421] px-4 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-xs text-slate-500">v1.0.0 — sistema ativo</span>
      </div>
    </div>
  </div>
);

export default function ForgotPasswordPage() {
  const [resetToken, setResetToken] = useState<string | null>(null);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword(data, {
      onSuccess: (res) => {
        setResetToken(res.token);
        toast.success('Token gerado com sucesso!');
      },
      onError: () => toast.error('Erro ao processar solicitação.'),
    });
  };

  if (resetToken) {
    return (
      <div className="flex min-h-screen bg-[#080c14]">
        <LeftPanel />
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 bg-dots">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Token gerado!</h2>
              <p className="text-sm text-slate-500 mt-1">
                Em produção, esse token seria enviado por e-mail.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a2744] bg-[#0d1421] p-4 mb-6">
              <p className="font-mono text-xs text-slate-600 mb-2">// token de recuperação</p>
              <code className="font-mono text-xs text-cyan-400 break-all">{resetToken}</code>
            </div>
            <Link to={`/reset-password?token=${resetToken}`} className="btn-primary w-full justify-center mb-4">
              Redefinir senha
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao login
            </Link>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#080c14]">
      <LeftPanel />

      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 bg-dots">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100">Recuperar senha</h2>
            <p className="text-sm text-slate-500 mt-1">
              Informe seu e-mail para receber o link de recuperação
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                className={`input-base ${errors.email ? 'input-error' : ''}`}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full justify-center"
            >
              {isPending ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Enviar link'
              )}
            </button>
          </form>

          <Link
            to="/login"
            className="mt-4 flex items-center gap-1.5 text-sm text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao login
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
