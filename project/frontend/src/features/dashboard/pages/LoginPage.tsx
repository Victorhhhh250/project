import { LucideIcons } from '@/components/ui/LucideIcons';

export function LoginPage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 text-slate-900">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
        <div className="mb-8 flex items-center gap-3">
          <LucideIcons name="Lock" className="h-8 w-8 text-brand-600" />
          <div>
            <h1 className="text-2xl font-semibold">Entrar</h1>
            <p className="text-sm text-slate-500">Acesso placeholder para o fluxo de autenticação.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
