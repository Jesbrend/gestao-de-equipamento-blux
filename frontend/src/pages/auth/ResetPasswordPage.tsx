import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../../schemas/authSchemas';
import { useResetPassword } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../utils/apiError';
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

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') ?? '';
  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: tokenFromUrl },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPassword(data, {
      onSuccess: () => {
        toast.success('Senha redefinida com sucesso!');
        navigate('/login');
      },
      onError: (error: unknown) =>
        toast.error(getApiErrorMessage(error, 'Token inválido ou expirado.')),
    });
  };

  return (
    <div className="flex min-h-screen bg-[#080c14]">
      <LeftPanel />

      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 bg-dots">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100">Redefinir senha</h2>
            <p className="text-sm text-slate-500 mt-1">Crie uma nova senha segura.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Token de recuperação
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                placeholder="Cole o token aqui"
                className={`input-base font-mono text-xs ${errors.token ? 'input-error' : ''}`}
                {...register('token')}
              />
              {errors.token && <p className="text-xs text-red-400">{errors.token.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Nova senha
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input-base ${errors.newPassword ? 'input-error' : ''}`}
                {...register('newPassword')}
              />
              {errors.newPassword && <p className="text-xs text-red-400">{errors.newPassword.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Confirmar senha
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input-base ${errors.confirmPassword ? 'input-error' : ''}`}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
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
                'Redefinir senha'
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
