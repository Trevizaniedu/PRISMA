import { useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
}

export function ForgotPasswordScreen({ onNavigateToLogin }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Por favor, preencha o seu e-mail.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, // Redireciona de volta para a aplicação após o clique no link
    });

    setLoading(false);

    if (error) {
      alert(`Erro ao enviar e-mail de recuperação: ${error.message}`);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#212127] border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-wide">PRISMA <span className="text-blue-500">APRENDIZADO</span></h1>
          <p className="text-sm text-gray-400 mt-2">Recuperação de Acesso</p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="bg-blue-900/40 border border-blue-600/50 p-4 rounded-xl text-blue-200 text-sm">
              E-mail de recuperação enviado com sucesso! Verifique a sua caixa de entrada e siga as instruções para redefinir a sua palavra-passe.
            </div>
            <button
              onClick={onNavigateToLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow-lg"
            >
              Voltar ao Login
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">E-mail cadastrado</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full px-4 py-2.5 bg-[#0b0e13] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'A enviar...' : 'Enviar instruções'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                Lembrou-se da palavra-passe? <span className="text-blue-400 font-medium">Entrar</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}