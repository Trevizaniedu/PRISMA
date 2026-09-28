import { useState, type FormEvent } from 'react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginScreen({
  onLogin,
  onNavigateToRegister,
  onNavigateToForgotPassword,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Preencha email e senha.');
      return;
    }

    await onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            PRISMA
          </h1>

          <p className="text-gray-400">
            Plataforma de aprendizagem
          </p>
        </div>

        <div className="bg-[#212127] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Entrar
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-gray-300">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Esqueceu-se da senha?
                </button>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Entrar
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Ainda não possui uma conta?
          </p>

          <button
            onClick={onNavigateToRegister}
            className="w-full mt-2 text-blue-400 hover:text-blue-300"
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
}